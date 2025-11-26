import { Webhook } from "svix";
import User from "../models/User.js"; 
import Stripe from "stripe";
import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify webhook
    whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = JSON.parse(req.body);
    switch (type) {
      case "user.created": {
        const email = Array.isArray(data.email_addresses)
          ? data.email_addresses[0].email_address
          : data.email_address;

        const userData = {
          _id: data.id,
          email,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };

        // await User.create(userData);
        
        // Upsert: update if exists, insert if not
        await User.findOneAndUpdate(
          { _id: data.id },
          userData,
          { upsert: true, new: true }
        );        
        break;
      }

      case "user.updated": {
        const email = Array.isArray(data.email_addresses)
          ? data.email_addresses[0].email_address
          : data.email_address;

        const userData = {
          email,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, userData);
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        console.log("Unhandled webhook type:", type);
        break;
    }
    // Send response once
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebHooks = async() => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  }
  catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  switch (event.type) {
    case 'payment_intent.succeeded':{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent:  paymentIntentId
      })

      const {purchaseId} = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId);
      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(purchaseData.courseId.toString());

      courseData.enrolledStudents.push(userData);
      await courseData.save();
      userData.enrolledCourses.push(courseData._id);
      await userData.save();
      purchaseData.status = 'completed';
      await purchaseData.save();

      break;
    }
    case 'payment_intent.payment_failed':{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent:  paymentIntentId
      })  
      const {purchaseId} = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId);
      purchaseData.status = 'failed';
      await purchaseData.save();
      
      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});  
}
