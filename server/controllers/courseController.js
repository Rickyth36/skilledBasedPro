import Course from "../models/Course.js";


// Get all courses

export const getAllCourses = async() => {
    try {
        const courses = await Course.find({isPublished: true}).select(['-courseContent','-enrolledStudent']).
        populate({path: 'educator'});

        res.json({success: true, courses});
    } catch (error) {
        res.json({success: false, error: error.message});
    }

}

export const getCourseId = async() => {
    const {id} = req.params;

    try {
        const courseData = await Course.findById(id).populate({path: 'educator'});

        // remove lecture url is preview is false
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl = "";
                }
            })
        })

        res.json({success: true, courseData});
    } catch (error) {
        res.json({success: true, error: error.message});
        
    }
}

