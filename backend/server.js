// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const connectDb = require('./config/db');
// const router = require('./routes/index');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const compression = require('compression');

// // Initialize express app
// const app = express();
// const PORT = process.env.PORT || 4000;

// // Check required environment variables
// if (!process.env.CLIENT_URL || !process.env.DB_URL) {
//   console.error("Missing required environment variables. Ensure CLIENT_URL and DB_URL are set.");
//   process.exit(1);
// }

// // Connect to database
// connectDb();

// // Trust proxy if behind a reverse proxy (like Heroku, Nginx)
// app.set('trust proxy', 1);

// // Security middleware
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       imgSrc: ["'self'", "data:", "https:", "blob:"],
//       scriptSrc: ["'self'"],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//       connectSrc: ["'self'", process.env.CLIENT_URL],
//     },
//   },
//   crossOriginEmbedderPolicy: false,
//   crossOriginResourcePolicy: false,
//   crossOriginOpenerPolicy: false,
// }));

// // CORS configuration
// const corsOptions = {
//   origin: process.env.CLIENT_URL,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
//   maxAge: 86400,
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };
// app.use(cors(corsOptions));

// // Request parsing middleware
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // Compression middleware
// app.use(compression({
//   level: 6,
//   threshold: 100 * 1000, // 100kb
//   filter: (req, res) => {
//     if (req.headers['x-no-compression']) {
//       return false;
//     }
//     return compression.filter(req, res);
//   }
// }));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: { error: true, message: 'Too many requests, please try again later.' },
//   standardHeaders: true,
//   legacyHeaders: false,
//   keyGenerator: (req) => {
//     return req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip;
//   },
// });

// // Apply rate limiting to all routes
// app.use(limiter);

// // API routes
// app.use('/api', router);

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.status(200).json({ status: 'healthy' });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error(`[${new Date().toISOString()}] Error:`, {
//     message: err.message,
//     stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
//     path: req.path,
//     method: req.method,
//   });

//   res.status(err.status || 500).json({
//     error: true,
//     message: process.env.NODE_ENV === 'production' 
//       ? 'An internal server error occurred' 
//       : err.message
//   });
// });

// // Handle unhandled routes
// app.use('*', (req, res) => {
//   res.status(404).json({ error: true, message: 'Route not found' });
// });

// // Start server
// const server = app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // Graceful shutdown
// const gracefulShutdown = () => {
//   console.log('Received shutdown signal, starting graceful shutdown...');
  
//   server.close(async () => {
//     console.log('HTTP server closed');
//     try {
//       await mongoose.connection.close(false);
//       console.log('MongoDB connection closed');
//       process.exit(0);
//     } catch (err) {
//       console.error('Error during shutdown:', err);
//       process.exit(1);
//     }
//   });

//   // Force shutdown after 30 seconds
//   setTimeout(() => {
//     console.error('Could not close connections in time, forcefully shutting down');
//     process.exit(1);
//   }, 30000);
// };

// process.on('SIGTERM', gracefulShutdown);
// process.on('SIGINT', gracefulShutdown);

// // Handle uncaught exceptions and rejections
// process.on('uncaughtException', (err) => {
//   console.error('Uncaught Exception:', err);
//   gracefulShutdown();
// });

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection at:', promise, 'reason:', reason);
//   gracefulShutdown();
// });



const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

// Function to fetch image with infinite retries
const fetchImageWithRetries = async (url) => {
  let retries = 0;
  const maxRetries = 15; // Set a maximum number of retries to avoid infinite loops
  while (retries < maxRetries) {
    try {
      const response = await axios.get(url, {
        responseType: "stream",
        headers: {
          accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7",
          priority: "i",
          referer: "https://fluxvip.netlify.app/",
          "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "image",
          "sec-fetch-mode": "no-cors",
          "sec-fetch-site": "cross-site",
          "sec-fetch-storage-access": "active",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
        }
      });
      return response.data; // Return the image stream if successful
    } catch (error) {
      retries++;
      console.warn(`Attempt ${retries} failed. Retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
    }
  }
  throw new Error("Max retries reached. Failed to fetch image.");
  retries = 0;
};
app.get("/", (req,res)=>{
  res.json({"message":"hello"});
})
app.get("/generate-image", async (req, res) => {
  try {
    const prompt = req.query.prompt || "cute cat";
    const imageUrl = `https://imagegenai.techzone.workers.dev/generate-image?prompt=${encodeURIComponent(prompt)}`;

    // Step 1: Fetch the image with retries
    const imageStream = await fetchImageWithRetries(imageUrl);

    // Step 2: Stream the image directly to the frontend
    res.set("Content-Type", "image/jpeg");
    imageStream.pipe(res);
  } catch (error) {
    console.error("Failed to fetch image:", error);
    res.status(500).json({ error: "Failed to fetch image. Please try again later." });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🔥 Server running on http://localhost:${PORT}`));
