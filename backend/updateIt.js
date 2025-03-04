import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";
import mongoose from "mongoose";
import Image from "./models/Image.js"; // Adjust the path if needed

const IMGBB_API_KEY = "78026bbefd12af05a47cbdfffe141f83"; // Embedded API Key

const fixOldImages = async () => {
  const oldImages = await Image.find({ imgbbId: { $exists: false } });

  let updatedCount = 0;
  let logData = "";

  console.log(`Total images to update: ${oldImages.length}`);

  for (const image of oldImages) {
    try {
      const formData = new FormData();
      formData.append("image", image.imgbbUrl); // Ensure this contains valid image data

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        { method: "POST", body: formData }
      );

      const data = await response.json();

      if (data.success) {
        const { id, url, thumb, display_url } = data.data;

        await Image.findByIdAndUpdate(image._id, {
          imgbbId: id,
          imgbbUrl: url,
          thumbnailUrl: thumb.url,
          displayUrl: display_url,
        });

        console.log(`✅ Updated: ${image._id}`);
        logData += `MongoDB ID: ${image._id}, ImgBB ID: ${id}, Thumbnail: ${thumb.url}, Display: ${display_url}\n`;
        updatedCount++;
      } else {
        console.log(`❌ Failed to update: ${image._id}, Error: ${data.error.message}`);
        logData += `ERROR: Failed to update ${image._id} - ${data.error.message}\n`;
      }
    } catch (error) {
      console.log(`❌ Error processing ${image._id}: ${error.message}`);
      logData += `ERROR: Exception for ${image._id} - ${error.message}\n`;
    }
  }

  fs.writeFileSync("mydata.txt", logData);
  console.log(`\n🎯 Total images updated: ${updatedCount}/${oldImages.length}`);
};

fixOldImages();
