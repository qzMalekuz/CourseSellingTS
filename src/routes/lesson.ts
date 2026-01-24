import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { schemas } from "../validators/schema";
import { prisma } from "../lib/prisma";

const router = Router();


export default router;