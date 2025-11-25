import { Webhook } from "svix";
import User from "../models/User.js"; 

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
