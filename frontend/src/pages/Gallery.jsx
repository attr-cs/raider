"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"; // Adjust import paths
import { Maximize, MoreVertical, Copy, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch images from the backend
  const fetchImages = async () => {
    if (page > totalPages) return;
    setIsLoading(true);
    try {
      const response = await fetch(`https://raider.onrender.com/gallery?page=${page}&limit=10`);
      const data = await response.json();
      setImages((prevImages) => [...prevImages, ...data.images]);
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
    <div className="p-4 bg-white min-h-screen">
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image._id}
            className="relative group rounded-lg overflow-hidden shadow-md bg-black/20"
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
              src={image.imgbbUrl}
              alt={image.prompt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              onClick={() => setSelectedImage(image)}
            />

            {/* Three-dot Menu */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/75 text-white rounded-full p-1 z-10"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm bg-black text-white rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
                <div className="space-y-2">
                  <p>
                    <strong>Prompt:</strong>{" "}
                    <span className="flex items-center gap-2">
                      <div
                        className="max-h-24 overflow-y-auto text-sm text-gray-300 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                        style={{ width: "calc(100% - 2rem)" }}
                      >
                        {image.prompt}
                      </div>
                      <button
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => {
                          navigator.clipboard.writeText(image.prompt);
                          const copiedText = document.getElementById(`copied-${image._id}`);
                          copiedText.style.opacity = "1";
                          setTimeout(() => (copiedText.style.opacity = "0"), 2000);
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <span
                        id={`copied-${image._id}`}
                        className="text-green-400 opacity-0 transition-opacity"
                      >
                        Copied!
                      </span>
                    </span>
                  </p>
                  <p>
                    <strong>Model:</strong> {image.model}
                  </p>
                  <p>
                    <strong>Aspect Ratio:</strong> {image.aspectRatio}
                  </p>
                  <p>
                    <strong>Seed:</strong> {image.seed}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>

      {/* Fullscreen Dialog for Selected Image */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl bg-black border-none">
            <img
              src={selectedImage.imgbbUrl}
              alt={selectedImage.prompt}
              className="w-full h-auto max-h-[80vh] object-contain"
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