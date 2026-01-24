import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth';
import courseRoutes from './routes/course';
import lessonRoutes from './routes/lesson';
import purchaseRoutes from './routes/purchase';

const app = express();
const port = Number(process.env.PORT);

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/lessons', lessonRoutes);
app.use('/purchases', purchaseRoutes);

app.listen(port, () => {
    console.log(`Listening to Aujla on port ${port}`);
});