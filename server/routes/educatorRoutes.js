import express from 'express';
import upload from '../config/multer.js';
import { requireAuth } from '@clerk/express';
import { protectEducator } from '../middlewares/authMiddleware.js';
import { addCourse, educatorDashboardData, getEducatorCourse, getEnrolledStudentsData, updateRoleEducator } from '../controllers/educatorController.js';

const router = express.Router();

router.post('/update-role', requireAuth(), updateRoleEducator);
router.post('/add-course', requireAuth(), protectEducator, upload.single('image'), addCourse);

router.get('/courses', protectEducator, getEducatorCourse);
router.get('/dashboard', protectEducator, educatorDashboardData);
router.get('/enrolled-students', protectEducator, getEnrolledStudentsData);

router.get('/test', (req, res) => res.json({ success: true, message: 'Educator router working' }));

export default router;
