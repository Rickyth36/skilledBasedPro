import Course from "../models/Course.js";
import mongoose from 'mongoose';

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .select(['-courseContent', '-enrolledStudents']) // check plural in schema
            .populate({ path: 'educator' })
            .lean();

        res.json({ success: true, courses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getCourseId = async (req, res) => {
    const { id } = req.params;
    console.log('id',id);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }
    try {
        const courseData = await Course.findById(id)
            .populate({ path: 'educator' })
            .lean();

        if (!courseData) {
            return res.json({ success: false, message: "Course not found" });
        }

        courseData.courseContent.forEach((chapter) => {
            chapter.chapterContent.forEach((lecture) => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = "";
                }
            });
        });

        res.json({ success: true, courseData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
