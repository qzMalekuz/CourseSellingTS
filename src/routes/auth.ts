import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { schemas } from "../validators/schema";
import { prisma } from "../lib/prisma"

const jwtSecret = process.env.JWT_SECRET;
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

const router = Router();

router.post('/signup', async(req: Request, res: Response) => {
    try{
        const validation = schemas.SignupSchema.safeParse(req.body);
        if(!validation.success) {
            return res.status(400).json({
                success: false,
                error: "InvalidSchema"
            });
        }

        const { name, email, password, role } = validation.data;

        const hashedPassword = await bcrypt.hash(password, saltRounds || 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role
            }
        });

        return res.status(201).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            error: null
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "InternalServerError"
        });
    }
});

router.post('/login', async(req: Request, res: Response) => {
    try{
        const validation = schemas.LoginSchema.safeParse(req.body);
        if(!validation.success) {
            return res.status(400).json({
                success: false,
                error: "InvalidSchema"
            });
        }

        const { email, password } = validation.data;
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if(!user) {
            return res.status(401).json({
                success: false,
                error: "InvalidCredentials"
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword) {
            return res.status(401).json({
                success: false,
                error: "InvalidUser"
            });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret as string);

        return res.status(200).json({
            success: true,
            data: {
                token
            },
            error: null
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "InternalServerError"
        });
    }
});

export default router;