import User from "../models/User";


export const getUserData = async(req,res) => {
    try {
        const userId = req.auth.userId;
        const user = User.findById(userId);
        if(!User){
            return res.json({success: false,message: 'User not found'})
        }

        res.json({success: true, user});
    }catch(errror){
        res.json({success: false, message: error.message});

    }
}

export const userEnrolledCourses = async(req,res) => {
    try {
        const userId = req.auth.userId;
        const userData = User.findById(userId).populate('enrolledCourses');
        res.json({success: true, enrollesCourses: userData.enrolledCourses})
    } catch (error) {
        res.json({success: false, message: error.message})
         
    }
}