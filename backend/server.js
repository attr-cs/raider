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
const connectDb = require("./config/db");
const Image = require("./models/Image");

const app = express();
app.use(cors());
app.use(express.json());

connectDb();
// pollination 
// https://image.pollinations.ai/prompt/water%20drop?width=1024&height=900&seed=4245&nologo=true&enhance=true&model=turbo
//  models = flux and turbo
// gives response in streaming image

// websim ai
// giver response like this
// {
//   "url": "https://page-images.websim.ai/laksjdsdfsasdsjlaskdjdfsdfsdfldsfkasj_b76f49d527dda.jpg"
// }
// const axios = require('axios');
// let data = '{"project_id":"kx0m131_rzz66qb2xoy7","prompt":"cute cat","aspect_ratio":"1:1"}';

// let config = {
//   method: 'post',
//   maxBodyLength: Infinity,
//   url: 'https://websim.ai/api/v1/inference/run_image_generation',
//   headers: { 
//     'accept': '*/*', 
//     'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7', 
//     'content-type': 'text/plain;charset=UTF-8', 
//     'origin': 'https://websim.ai', 
//     'priority': 'u=1, i', 
//     'referer': 'https://websim.ai/@ISWEARIAMNOTADDICTEDTOPILLOW/ai-image-prompt-generator', 
//     'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"', 
//     'sec-ch-ua-mobile': '?0', 
//     'sec-ch-ua-platform': '"Windows"', 
//     'sec-fetch-dest': 'empty', 
//     'sec-fetch-mode': 'cors', 
//     'sec-fetch-site': 'same-origin', 
//     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36', 
//     'websim-flags': '', 
//     'Cookie': 'theme=auto; nosleep=1; ph_phc_VHMOlrdxAbgSZHeF0SdSf07LZLRLAg5pZuTHkJGn050_posthog=%7B%22distinct_id%22%3A%2201955b70-d715-730e-a05e-c9049e7ec2cb%22%2C%22%24sesid%22%3A%5B1740996062046%2C%2201955b70-d70f-75f9-bbfc-0d388d74c02d%22%2C1740995876623%5D%7D'
//   },
//   data : data
// };

// axios.request(config)
// .then((response) => {
//   console.log(JSON.stringify(response.data));
// })
// .catch((error) => {
//   console.log(error);
// });



app.post("/api/save-image-details", async (req, res) => {
  try {
    const { imgbbUrl, prompt, model, aspectRatio, seed } = req.body;

    // Validate required fields
    if (!imgbbUrl || !prompt || !model || !aspectRatio || !seed) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Create a new image document
    const newImage = new Image({
      imgbbUrl,
      prompt,
      model,
      aspectRatio,
      seed,
    });

    // Save the document to the database
    await newImage.save();

    res.status(201).json({ message: "Image details saved successfully.", data: newImage });
  } catch (error) {
    console.error("Error saving image details:", error);
    res.status(500).json({ error: "Failed to save image details." });
  }
});

app.get('/',(req,res)=>{
  res.json({msg:"Server is live!"})
})

// Generate image using the Imagine2 API
app.get("/generate-image", async (req, res) => {
  try {
    const { prompt, size = "1:1", seed = Date.now(), model = "flux-realism" } = req.query;

    // Validate aspect ratio
    const validSizes = ["1:1", "16:9", "9:16", "21:9", "9:21", "1:2", "2:1"];
    if (!validSizes.includes(size)) {
      throw new Error("Invalid aspect ratio");
    }

    // Validate model
    const validModels = [
      "flux",
      "flux-realism",
      "flux-4o",
      "flux-pixel",
      "flux-3d",
      "flux-anime",
      "flux-disney",
      "any-dark",
      "stable-diffusion-xl-lightning",
      "stable-diffusion-xl-base",
    ];
    if (!validModels.includes(model)) {
      throw new Error("Invalid model");
    }

    // Construct the URL for the Imagine2 API
    const imageUrl = `https://api.airforce/v1/imagine2?prompt=${encodeURIComponent(prompt)}&size=${size}&seed=${seed}&model=${model}`;

    // Fetch the image from the Imagine2 API
    const response = await axios.get(imageUrl, {
      responseType: "stream",
      headers: {
        accept: "image/png",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
      },
    });

    // Stream the image directly to the frontend
    res.set("Content-Type", "image/png");
    response.data.pipe(res);
  } catch (error) {
    console.error("Failed to fetch image:", error);
    res.status(500).json({ error: error.message || "Failed to fetch image. Please try again later." });
  }
});

// Gallery Route
app.get("/gallery", async (req, res) => {
  try {
    const { page = 1, limit = 40 } = req.query; // Default to page 1 and 10 items per page

    // Fetch paginated images from the database
    const images = await Image.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip((page - 1) * limit) // Skip previous pages
      .limit(parseInt(limit)) // Limit the number of results
      .select("imgbbUrl prompt model aspectRatio seed createdAt"); // Select only necessary fields

    // Count total images for pagination metadata
    const totalImages = await Image.countDocuments();

    res.json({
      images,
      totalPages: Math.ceil(totalImages / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Failed to fetch gallery images:", error);
    res.status(500).json({ error: "Failed to fetch gallery images. Please try again later." });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🔥 Server running on http://localhost:${PORT}`));