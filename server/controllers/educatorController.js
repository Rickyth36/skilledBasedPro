import {clerkClient} from '@clerk/express'
import { json } from 'express'
import {v2 as cloudinary} from 'cloudinary'
import Course from '../models/Course.js'
import Purchase from '../models/Purchase.js'

// update role to educator
export const updateRoleEducator = async(req,res) =>{
    try {
        const userId = req.auth.userId;
        await clerkClient.users.updateUserMetadata(userId,{
            publicMetadata: {
                role: 'educator'
            }
        })
        res.json({success: true,message: 'You can publish a course now'});
        
        
    } catch (error) {
        res.json({success: false,message: error.message});
        
    }
}

// Add new course
export const addCourse = async(req,res) => {
    try {
        const {couseData} = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        if(!imageFile){
            return res.json({success: false,message: 'Thumbnail not attached'});
        }
        const parsedCourseData = await JSON.parse(courseData);
        parsedCourseData.educator = educatorId;
        const newCourse = await Course.create(parsedCourseData);
        const imageUpload = await cloudinary.uploader.upload(imageFile);

        newCourse.courseThumbnail = imageUpload.secure_url;
        await newCourse.save();

        res.json({success: true, message: 'Course added'})
        
        await cloudinary
    } catch (error) {
        res.json({success: false, message: error.message})
        
    }
}

export const getEducatorCourse = async(req,res) => {
    try {
        const educator = req.auth.userId;

        const courses = await Course.find({educator})
        res.json({success:true, courses})
    } catch (error) {
        req.json({success: false, message: error.message})
    }
}

// Get educator dashboard data(Total earning, Enrolled students, No. of courses)

export const educatorDashboardData = async(req,res) =>{
    try {
        const educator = req.auth.userId;
        const courses = await Course.find(educator);
        const totalCourses = courses.length;
        
        const courseIds = courses.map(course=> course._id);

        const purchases = await Purchase({
            courseId: {$in: courseIds} 
        });

        const totalEarnings = purchases.reduce((sum,purchase) => sum +=purchase.amount 
        ,0)
        
        const enrolledStudentsData = [];
        for(const course of courses){
            const students = await user.find({
                _id: {$in: course.enrolledStudents}
            },'name imageUrl')
            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            })
        }
        res.json({success: true, dashboard:{
            totalEarnings, enrolledStudentsData, totalCourses
        }})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// Get enrolled stuednts data with purchase data
export const getEnrolledStudentsData = async(req,res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Courses.find({educator});
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        }).populate('userId','name imageUrl').populate('courseId', 'courseTitle');

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }))

        res.json({success: true, enrolledStudents});
    } catch (error) {
        res.json({success: false, message: error.message});
        
    }
}