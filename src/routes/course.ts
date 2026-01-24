import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { schemas } from "../validators/schema";
import { prisma } from "../lib/prisma";
import { date, success } from "zod";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post('/', authMiddleware, async(req: Request, res: Response) => {
    try {
        const validation = schemas.CreateCourseSchema.safeParse(req.body);
        if(!validation.success) {
            return res.status(400).json({
                success: false,
                error: "InvalidSchema"
            });
        }

        const { title, description, price } = validation.data;

        if (req.user?.role !== 'Instructor') {
                return res.status(403).json({
                    success: false,
                    data: null,
                    error: "Forbidden"
                });
            }
        
        const course = await prisma.course.create({
            data: {
                title,
                description,
                price,
                instructorId: req.user?.userId
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                id: course.id,
                description: course.description,
                title: course.title,
                price: course.price
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "InternalServerError"
        });
    }
});

router.get('/', async(req: Request, res: Response) => {
    try {
        const courses = await prisma.course.findMany({
            include: { lesson: true }
        });

        return res.status(200).json({
            success: true,
            data: courses
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "InvalidServerError"
        });
    }
});

router.get('/:id', authMiddleware, async(req: Request, res: Response) => {
   try {
        const courseId = req.params.courseId as string;

        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                lesson: true
            }
        });

        if(!course) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "CourseNotFound"
            });
        }

        if (req.user?.role !== 'Instructor') {
                return res.status(403).json({
                    success: false,
                    data: null,
                    error: "Forbidden"
                });
            }
        
        return res.status(200).json({
            success: true,
            data: {
                id: course.id,
                description: course.description,
                title: course.title,
                price: course.price
            }
        });
   } catch (err) {
    return res.status(500).json({
        success: false,
        error: "InvalidServerError"
    });
   }
});

router.patch('/:id', authMiddleware, async(req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId as string;

        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if(!course) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "CourseNotFound"
            });
        }

        if (req.user?.role !== 'Instructor') {
                return res.status(403).json({
                    success: false,
                    data: null,
                    error: "Forbidden"
                });
        }

        const body = req.body;

        if (!body.success) {
            return res.status(400).json({
                success: false,
                error: "InvalidBody"
            });
        };

        const updatedCourse = await prisma.course.update({
            where: { id: courseId },
            data: body.data
        });

        return res.status(200).json({
            success: true,
            data: {
                id: updatedCourse.id,
                title: updatedCourse.title,
                description: updatedCourse.description,
                price: updatedCourse.price
            }
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "InvalidSchema"
        });
    }
});

router.delete('/:id', authMiddleware, async(req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId as string;

        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if(!course) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "CourseNotFound"
            });
        }

        if (req.user?.role !== 'Instructor') {
                return res.status(403).json({
                    success: false,
                    data: null,
                    error: "Forbidden"
                });
        }

        await prisma.course.delete({
            where: { id: courseId }
        });

        return res.status(200).json({
            success: true,
            data: "SuccessfullyDeleted"
        })
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "InvalidSchema"
        });
    }
});

export default router;