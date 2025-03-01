import React, { useState } from "react";
import { Loader2, Download } from "lucide-react"; // Import Download icon
import { Input } from "@/components/ui/input"; // Input component from shadcn
import { Button } from "@/components/ui/button"; // Button component from shadcn
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Card components from shadcn

const App = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [imgbbUrl, setImgbbUrl] = useState("");
  const [prompt, setPrompt] = useState("cute cat");
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false); // Track image loading state
  const [error, setError] = useState("");

  const generateImage = async () => {
    setIsLoading(true);
    setIsImageLoading(true); // Start image loading
    setImageUrl(""); // Clear previous image
    setImgbbUrl(""); // Clear previous ImgBB URL
    setError(""); // Clear previous error

    try {
      // Step 1: Fetch the image from the backend
      const backendImageUrl = `http://localhost:4000/generate-image?prompt=${encodeURIComponent(prompt)}`;
      const imageResponse = await fetch(backendImageUrl);

      if (!imageResponse.ok) {
        throw new Error("Failed to fetch image from the backend");
      }

      const imageBlob = await imageResponse.blob(); // Get the image as a blob
      const localImageUrl = URL.createObjectURL(imageBlob); // Create a URL for the blob
      setImageUrl(localImageUrl); // Display the image immediately

      // Step 2: Upload the image to ImgBB
      const formData = new FormData();
      formData.append("image", imageBlob);

      const imgbbResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=78026bbefd12af05a47cbdfffe141f83`, // Your ImgBB API key
        {
          method: "POST",
          body: formData
        }
      );

      const imgbbData = await imgbbResponse.json();

      // Step 3: Check if the ImgBB upload was successful
      if (!imgbbData.success) {
        throw new Error("Failed to upload image to ImgBB");
      }

      // Step 4: Replace the local image URL with the ImgBB URL
      setImgbbUrl(imgbbData.data.url);
    } catch (error) {
      console.error("Failed to generate or upload image:", error);
      setError(error.message); // Display the error message
    } finally {
      setIsLoading(false);
      setIsImageLoading(false); // Stop image loading
    }
  };

  // Function to handle image download
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imgbbUrl || imageUrl; // Use ImgBB URL if available, otherwise use local URL
    link.download = `generated-image-${Date.now()}.jpg`; // Set the download filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex justify-center items-center flex-col h-screen bg-gray-100 pt-14 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Image Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt"
            className="w-full"
          />
          <Button
            onClick={generateImage}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? "Generating..." : "Generate Image"}
          </Button>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          {/* Dedicated Image Space */}
          <div className="mt-6 w-full flex justify-center items-center bg-gray-200 rounded-lg">
            {(imageUrl || imgbbUrl) && (
              <div className="relative">
                <img
                  src={imgbbUrl || imageUrl}
                  alt="Generated"
                  className="rounded-lg shadow-lg max-w-full max-h-96 object-contain"
                  onLoad={() => setIsImageLoading(false)} // Stop loading when image is loaded
                  onError={() => {
                    setIsImageLoading(false);
                    setError("Failed to load image.");
                  }}
                />
                {isImageLoading && (
                  <div className="absolute inset-0 flex justify-center items-center bg-gray-200 rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Download Button */}
          {(imageUrl || imgbbUrl) && !isImageLoading && (
            <Button
              onClick={handleDownload}
              className="w-full mt-4"
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" /> Download Image
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default App;