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
};

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
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");

// const app = express();
// app.use(cors()); // Enable CORS for frontend communication

// app.get("/generate-image", async (req, res) => {
//   try {
//     const prompt = req.query.prompt || "cute cat";
    
//     let config = {
//       method: "get",
//       maxBodyLength: Infinity,
//       url: `https://imagegenai.techzone.workers.dev/generate-image?prompt=${encodeURIComponent(prompt)}`,
//       headers: {
//         accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
//         "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7",
//         priority: "i",
//         referer: "https://fluxvip.netlify.app/",
//         "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
//         "sec-ch-ua-mobile": "?0",
//         "sec-ch-ua-platform": '"Windows"',
//         "sec-fetch-dest": "image",
//         "sec-fetch-mode": "no-cors",
//         "sec-fetch-site": "cross-site",
//         "sec-fetch-storage-access": "active",
//         "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
//       }
//     };

//     const response = await axios.request(config);
//     console.log(response.data);
//     res.json({ image: response.data }); // Send base64 image
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch image" });
//   }
// });

// const PORT = 4000;
// app.listen(PORT, () => console.log(`🔥 Server running on http://localhost:${PORT}`));


// const axios = require('axios');

// let config = {
//   method: 'get',
//   maxBodyLength: Infinity,
//   url: 'https://imagegenai.techzone.workers.dev/generate-image?prompt=cute%20cat',
//   headers: { 
//     'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8', 
//     'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7', 
//     'priority': 'i', 
//     'referer': 'https://fluxvip.netlify.app/', 
//     'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"', 
//     'sec-ch-ua-mobile': '?0', 
//     'sec-ch-ua-platform': '"Windows"', 
//     'sec-fetch-dest': 'image', 
//     'sec-fetch-mode': 'no-cors', 
//     'sec-fetch-site': 'cross-site', 
//     'sec-fetch-storage-access': 'active', 
//     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
//   }
// };

// axios.request(config)
// .then((response) => {
//   console.log(JSON.stringify(response.data));
// })
// .catch((error) => {
//   console.log(error);
// });


// const myHeaders = new Headers();
// myHeaders.append("accept", "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8");
// myHeaders.append("accept-language", "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7");
// myHeaders.append("priority", "i");
// myHeaders.append("referer", "https://fluxvip.netlify.app/");
// myHeaders.append("sec-ch-ua", "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"");
// myHeaders.append("sec-ch-ua-mobile", "?0");
// myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
// myHeaders.append("sec-fetch-dest", "image");
// myHeaders.append("sec-fetch-mode", "no-cors");
// myHeaders.append("sec-fetch-site", "cross-site");
// myHeaders.append("sec-fetch-storage-access", "active");
// myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36");

// const requestOptions = {
//   method: "GET",
//   headers: myHeaders,
//   redirect: "follow"
// };

// fetch("https://imagegenai.techzone.workers.dev/generate-image?prompt=cute%20cat", requestOptions)
//   .then((response) => response.text())
//   .then((result) => console.log(result))
//   .catch((error) => console.error(error));