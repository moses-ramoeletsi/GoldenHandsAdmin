import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDatabase from './dbConnection/connection.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: ['https://golden-hands-admin.vercel.app/', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
  res.status(200).send('API is running');
});

app.use('/api', userRoutes);

// start server and attempt DB connect (server will still run if DB fails)
app.listen(PORT, async () => {
  const dbOk = await connectDatabase();
  console.log(`Server is running on port ${PORT} (DB connected: ${dbOk})`);
});

export default app;