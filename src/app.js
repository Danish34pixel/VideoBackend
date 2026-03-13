const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');

const app = express();

// Middleware
const allowedOrigins = [
  'https://video-frontend-gp91.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: err.message 
  });
});

module.exports = app;
