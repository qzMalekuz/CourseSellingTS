import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { schemas } from "../validators/schema";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Question - 9

router.post('/', authMiddleware, async(req:Request, res: Response) => {
    try {
        const validation = schemas.CreateLessonSchema.safeParse(req.body);
        if(!validation.success) {
            return res.status(401).json({
                success: false,
                error: "Invalid Schema"
            });
        }

        if (req.user?.role !== 'Instructor') {
                return res.status(403).json({
                    success: false,
                    data: null,
                    error: "Forbidden"
                });
            }

        const { title, content, courseId } = validation.data;

        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course Not Found"
            });
        }

        const lessons = await prisma.lesson.create({
            data: {
                title,
                content,
                courseId
            },
        });

        return res.status(201).json({
            success: true,
            data: {
                lessons
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "InternalServerError"
        });
      }

});

export default router;