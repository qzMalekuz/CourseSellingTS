import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { schemas } from "../validators/schema";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Question - 10

router.post('/', authMiddleware, async(req:Request, res: Response) => {
    try {
        const userId = req.user?.userId as string;

        const validation = schemas.PurchaseCourseSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
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

        const { courseId } = validation.data;

        const purchase = await prisma.$transaction(async (tr) => {
            const course = await tr.course.findUnique({
                where: { id: courseId }
            });

            const purchaseDone = await tr.purchase.create({
                data: {
                    userId,
                    courseId
                }
            });

            return purchaseDone;

        });

        return res.status(200).json({
            success: true,
            data: {
                purchase
            }
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "InternalServerError"
        });
    }
});

// Question - 11

router.get('/users/:id/purchases', authMiddleware, async(req:Request, res: Response) => {
    try {
        const userId = req.user?.userId as string;

        const purchases = await prisma.purchase.findMany({
            where: { userId },
        });

        return res.json({
            success: true,
            data: {
                purchases
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