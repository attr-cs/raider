"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"; // Adjust import paths
import { Download, Maximize, MoreVertical, Copy, Loader, Clock, Image, Ruler, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch images from the backend
  const fetchImages = async () => {
    if (page > totalPages) return;
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/gallery?page=${page}&limit=30`);
      const data = await response.json();
      setImages((prevImages) => {
        const uniqueImages = [...new Map([...prevImages, ...data.images].map(img => [img._id, img])).values()];
        return uniqueImages;
      });
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 100 &&
        !isLoading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  return (
    <div className="p-4 bg-white pt-32 min-h-screen dark:bg-black flex flex-col  justify-center">
      <Toaster/>
      <h1 className="text-6xl font-bold mb-4 text-black dark:text-slate-300 text-center">Gallery</h1>
      <p className="text-gray-600 mb-8 text-center dark:text-slate-400">Explore a collection of generated images.</p>
      
      {/* Gallery Grid */}
      <div className="grid pt-4 px-15 mx-auto w-[800px] grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
        {images.map((image) => (
          <div
            key={image._id}
            className="relative group rounded-lg cursor-pointer  overflow-hidden shadow-md bg-slate-300"
            style={{
              aspectRatio: "1 / 1", // Maintain a square aspect ratio for the wrapper
            }}
          >
            {/* Vignette Effect */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none"
            ></div>

            {/* Image */}
            <img
              src={image.thumbnailUrl}
              alt={image.prompt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              onClick={() => setSelectedImage(image)}
            />
            {/* Download Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 left-2 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/75 text-white rounded-full p-0 z-10"
              onClick={async () => {
                if (!image.displayUrl) {
                  toast({
                      title: "Error",
                      description: "No image available to download.",
                      variant: "destructive",
                  });
                  return;
              }
          
              try {
                  const response = await fetch(image.displayUrl);
                  const blob = await response.blob(); // Convert response to Blob
                  const localUrl = URL.createObjectURL(blob); // Create a local object URL
          
                  const link = document.createElement("a");
                  link.href = localUrl;
                  link.download = `generated-image-${Date.now()}.png`; // Set file name
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
          
                  URL.revokeObjectURL(localUrl); // Clean up URL object
                  toast({
            
                      title: "Success!",
                      description: "Image downloaded successfully.",
                    });
              } catch (error) {
                  console.error("Download error:", error);
                  toast({
                      title: "Error",
                      description: "Failed to download the image.",
                      variant: "destructive",
                  });
              }
              }}
            >
              <Download className="h-4 w-4" />
            </Button>


            {/* Three-dot Menu */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2  group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/75 text-white rounded-full p-0 z-10"
                >
                  <MoreVertical className="h-4 w-4" strokeWidth={3} />
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-sm bg-black text-white rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
                <div className="space-y-3">
                  {/* Prompt Section - Full Width Restored */}
                  <p>
                    <strong className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-yellow-400" /> Prompt:
                    </strong>
                    <div className="relative bg-gray-800 text-gray-300 p-2 rounded-md max-h-24 overflow-y-auto text-sm scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                      {image.prompt}
                      <button
                        className="absolute top-2 right-2 text-blue-400 hover:text-blue-300"
                        onClick={() => {
                          navigator.clipboard.writeText(image.prompt);
                          const copiedText = document.getElementById(`copied-${image._id}`);
                          copiedText.style.opacity = "1";
                          setTimeout(() => (copiedText.style.opacity = "0"), 2000);
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <span id={`copied-${image._id}`} className="absolute top-2 right-8 text-green-400 opacity-0 transition-opacity">
                        Copied!
                      </span>
                    </div>
                  </p>

                  {/* Model Name - Simple Gradient Text */}
                  <p className="flex items-center gap-2">
                    <strong className="flex items-center gap-1">
                      <Image className="h-4 w-4 text-blue-400" /> Model:
                    </strong>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">
                      {image.model}
                    </span>
                  </p>

                  {/* Aspect Ratio */}
                  <p className="flex items-center gap-2">
                    <strong className="flex items-center gap-1">
                      <Ruler className="h-4 w-4 text-green-400" /> Aspect Ratio:
                    </strong>
                    {image.aspectRatio}
                  </p>

                  {/* Seed */}
                  <p className="flex items-center gap-2">
                    <strong className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-yellow-400" /> Seed:
                    </strong>
                    {image.seed}
                  </p>

                  {/* Created At - 12-hour format */}
                  <p className="flex items-center gap-2">
                    <strong className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" /> Created At:
                    </strong>
                    {new Date(image.createdAt).toLocaleDateString()},{" "}
                    {new Date(image.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </DialogContent>;


            </Dialog>
          </div>
        ))}
      </div>

      {/* Fullscreen Dialog for Selected Image */}
      {selectedImage && (
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        
        <DialogContent className={`max-w-4xl border-gray-200  border-none min-h-[300px] flex items-center justify-center bg-black`}>
          {loading && <Loader className="animate-spin w-10 h-10 text-gray-300" />}
          <img
            src={selectedImage.displayUrl}
            alt={selectedImage.prompt}
            className={`w-full h-auto max-h-[80vh] object-contain ${loading ? "hidden" : "block"}`}
            onLoad={() => setLoading(false)}
          />
        </DialogContent>
      </Dialog>
    )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      )}
    </div>
  );
};

export default GalleryPage;