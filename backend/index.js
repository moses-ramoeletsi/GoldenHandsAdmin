// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import connectDatabase from './dbConnection/connection.js';
// import userRoutes from './routes/user.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use(cors({
//   origin: ['https://golden-hands-admin.vercel.app', 'http://localhost:5173'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Health check route
// app.get('/', (req, res) => {
//   res.status(200).json({ 
//     message: 'API is running',
//     timestamp: new Date().toISOString()
//   });
// });

// // API routes
// app.use('/api/users', userRoutes);

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found',
//     path: req.path
//   });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(500).json({
//     success: false,
//     message: 'Internal server error'
//   });
// });

// // Connect to database
// connectDatabase().catch(err => {
//   console.error('Database connection failed:', err);
// });

// // Only start server if not in serverless environment
// if (process.env.NODE_ENV !== 'production') {
//   app.listen(PORT, () => {
//     console.log(`✅ Server running on port ${PORT}`);
//   });
// }

// export default app;

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDatabase from './dbConnection/connection.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['https://golden-hands-admin.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Initialize database connection (moved outside routes)
let dbInitialized = false;

const initDB = async () => {
  if (!dbInitialized) {
    try {
      await connectDatabase();
      dbInitialized = true;
      console.log('Database initialized');
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }
};

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  await initDB();
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    dbStatus: dbInitialized ? 'connected' : 'disconnected'
  });
});

// API routes
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

export default app;