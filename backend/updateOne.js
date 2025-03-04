const fetchAndUploadImage = async () => {
    try {
      // Step 1: Fetch the image from MongoDB using the _id
      const image = await Image.findById("67c4869bd5dea89fdb65f1d6"); // Replace with actual MongoDB ID
  
      if (!image || !image.imgbbUrl) {
        console.log("\x1b[31m%s\x1b[0m", `❌ No valid image found in MongoDB!`);
        return;
      }
  
      const imageUrl = image.imgbbUrl;
  
      // Step 2: Upload to ImgBB
      const formData = new URLSearchParams();
      formData.append("image", imageUrl);
  
      const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=78026bbefd12af05a47cbdfffe141f83`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
  
      const imgbbData = await imgbbResponse.json();
  
      if (imgbbData.success) {
        const { id, url, display_url, thumb } = imgbbData.data;
  
        console.log("\x1b[32m%s\x1b[0m", `✅ Image uploaded successfully!`);
        console.log("🆔 MongoDB ID:", image._id);
        console.log("📌 ImgBB ID:", id);
        console.log("🌐 ImgBB URL:", url);
        console.log("🖼️ Display URL:", display_url);
        console.log("🔽 Thumbnail URL:", thumb.url);
      } else {
        console.log("\x1b[31m%s\x1b[0m", `❌ Failed to upload image!`);
        console.log("Error:", imgbbData);
      }
    } catch (error) {
      console.log("\x1b[31m%s\x1b[0m", `🚨 Error:`, error.message);
    } finally {
      mongoose.connection.close(); // Close DB connection after execution
    }
  };
  
  // Run the function
  fetchAndUploadImage();