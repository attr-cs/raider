"use client";

import React, { useState, useEffect } from "react";
import {
    Loader2,
    Download,
    Maximize,
    Sparkles,
    Brush,
    Copy,
    Moon,
    Sun,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const Fastest = () => {
    const [imageUrl, setImageUrl] = useState("");
    const [imgbbUrl, setImgbbUrl] = useState("");
    const [prompt, setPrompt] = useState("cute cat");
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [error, setError] = useState("");
    const [aspectRatio, setAspectRatio] = useState("1:1");
    
    const [downloadUrl, setDownloadUrl] = useState("");
    const [theme, setTheme] = useState("light"); // 'dark' or 'light'
    
    const { toast } = useToast();

    // Toggle Theme with Smooth Animation
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const generateImage = async () => {
        setIsLoading(true);
        setIsImageLoading(true);
        setImgbbUrl("");
        setImageUrl("");
        setError("");
        setDownloadUrl("");

        if (!prompt) {
            toast({
                title: "Error",
                description: "Please enter a prompt.",
                variant: "destructive",
            });
            setIsLoading(false);
            setIsImageLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate-fast`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, aspectRatio }),
            });

            const data = await response.json();
            if (!data.imageUrl) {
                throw new Error("Failed to fetch image from the backend");
                
            } 

            setImageUrl(data.imageUrl); //  image URL
            
            setDownloadUrl(data.imageUrl);
            toast({
                title: "Success!",
                description: "Your image has been generated.",
            });

            setIsLoading(false);
            setIsImageLoading(false);
            setPrompt("");

            const formData = new FormData();
            formData.append("image", data.imageUrl);

            const imgbbResponse = await fetch(
                `${import.meta.env.VITE_IMGBB_URL}/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, // Your ImgBB API key
                {
                    method: "POST",
                    body: formData,
                }
            );

            const imgbbData = await imgbbResponse.json();

            // Step 3: Check if the ImgBB upload was successful
            if (!imgbbData.success) {
                throw new Error("Failed to upload image to ImgBB");
            }

            // Step 4: Replace the local image URL with the ImgBB URL
            const newImgbbUrl = imgbbData.data.url;
            setImgbbUrl(newImgbbUrl);

            const saveResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/save-image-details`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newImageUrl: newImgbbUrl,
                    imgbbId:imgbbData.data.id,
                    displayUrl:imgbbData.data.display_url,
                    thumbnailUrl:imgbbData.data.thumb.url,
                    prompt,
                    model: "Fastest",
                    aspectRatio,
                    seed: 1111
                }),
            });

            const saveData = await saveResponse.json();
            if (!saveResponse.ok) {
                throw new Error(saveData.error || "Failed to save image details.");
            }
        } catch (error) {
            console.error("Failed to generate image:", error);
            setError(error.message || "An unexpected error occurred.");
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate image. Please try again.",
            });
        } finally {
            setIsLoading(false);
            setIsImageLoading(false);
            setPrompt(""); // Clear the prompt after image generation
        }

       
    };
    const handleDownload = async () => {
        if (!imgbbUrl) {
            toast({
                title: "Error",
                description: "No image available to download.",
                variant: "destructive",
            });
            return;
        }
    
        try {
            const response = await fetch(imgbbUrl);
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
    };
    
    

    const handleCopyUrl = () => {
        if (!imgbbUrl && !imageUrl) {
            toast({
                title: "Error",
                description: "No image available to copy.",
                variant: "destructive",
            });
            return;
        }

        navigator.clipboard.writeText(imgbbUrl || imageUrl);
        toast({
            title: "Copied!",
            description: "Image URL copied to clipboard.",
        });
    };

    return (
        <div
            className={`min-h-screen ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-white text-gray-900"
                } flex flex-col items-center justify-center md:pt-4 pt-8 p-4 transition-colors duration-300`}
        >
            <Toaster />
            {/* Theme Toggle Button */}
            <Button
                onClick={toggleTheme}
                className="absolute top-4 right-4 bg-slate-700 hover:bg-slate-800 text-white rounded-full p-1"
                size="icon"
            >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5 " />}
            </Button>

            {/* Main Container */}
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Form Section */}
                <Card
                    className={`w-full ${theme === "dark"
                            ? "bg-slate-900 border-slate-800"
                            : "bg-white border-gray-200"
                        } shadow-lg relative overflow-hidden`}
                >
                    {/* Slate Beam Effect */}
                    <div
                        className={`absolute top-0 left-0 w-32 h-32 ${theme === "dark" ? "bg-slate-700/20" : "bg-gray-200/20"
                            } blur-xl rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300`}
                    />
                    <CardHeader>
                        <CardTitle className={`${theme === "dark" ? "text-slate-100" : "text-gray-900"
                            } text-center text-xl font-bold md:text-2xl flex items-center justify-center gap-2`}>
                            <Sparkles className="h-5 w-5 text-blue-400" /> Fastest 
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Prompt Input */}
                        <div className="relative">
                            <Input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Enter a prompt..."
                                className={`w-full ${theme === "dark"
                                        ? "bg-slate-800 text-slate-100 border-slate-700 focus-visible:ring-slate-500"
                                        : "bg-gray-100 text-gray-900 border-gray-300 focus-visible:ring-blue-500"
                                    } pl-10`}
                            />
                            <Brush
                                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${theme === "dark" ? "text-slate-400" : "text-gray-500"
                                    }`}
                            />
                        </div>

                        {/* Aspect Ratio and Model Selectors */}
                        <div className="grid grid-cols-1 gap-4">

                            {/* Aspect Ratio Selector */}
                            <Select value={aspectRatio} onValueChange={(value) => {
    setAspectRatio(value);
}}>
                                <SelectTrigger
                                    className={`${theme === "dark"
                                            ? "bg-slate-800 text-slate-100 border-slate-700 focus:ring-slate-500"
                                            : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-500"
                                        }`}>
                                    <SelectValue placeholder="Aspect Ratio" />
                                </SelectTrigger>
                                <SelectContent
                                    className={`${theme === "dark"
                                            ? "bg-slate-800 border-slate-700"
                                            : "bg-white border-gray-200 text-slate-800"
                                        }`}>
                                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                                    <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                                    <SelectItem value="21:9">21:9 (Ultrawide)</SelectItem>
                                    <SelectItem value="9:21">9:21 (Tall)</SelectItem>
                                    <SelectItem value="1:2">1:2 (Portrait)</SelectItem>
                                    <SelectItem value="2:1">2:1 (Landscape)</SelectItem>
                                </SelectContent>
                            </Select>

                        

              
                        </div>
                            {/* Generate Button */}
                            <Button
                                onClick={generateImage}
                                disabled={isLoading}
                                className={`w-full ${theme === "dark"
                                        ? "bg-slate-700 hover:bg-slate-600"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    } text-white transition-colors border-blue-400/40 border-1`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    "Generate Image"
                                )}
                            </Button>

                            {/* Error Message */}
                            {error && (
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            )}
                    </CardContent>
                </Card>

                {/* Right Column: Image Display Section */}
                <div
                    className={`relative w-full aspect-video ${theme === "dark"
                            ? "bg-slate-800 border-slate-700"
                            : "bg-gray-100 border-gray-300"
                        } rounded-lg overflow-hidden flex justify-center items-center transition-colors duration-300`}
                >
                    {/* Loading Animation */}
                    {isImageLoading && (
                        <div
                            className={`absolute inset-0 flex justify-center items-center ${theme === "dark" ? "bg-slate-900/75" : "bg-gray-200/75"
                                }`}
                        >
                            <div className="relative w-16 h-16">
                                <div
                                    className={`absolute inset-0 ${theme === "dark" ? "bg-slate-500/20" : "bg-gray-500/20"
                                        } rounded-full animate-ping`}
                                />
                                <div
                                    className={`absolute inset-0 ${theme === "dark" ? "bg-slate-500/50" : "bg-gray-500/50"
                                        } rounded-full`}
                                />
                            </div>
                        </div>
                    )}

                    {imageUrl && !isImageLoading && (
                        <>
                            <img
                                src={imgbbUrl || imageUrl}
                                alt="Generated"
                                className="w-full h-full object-contain cursor-pointer"
                                onLoad={() => setIsImageLoading(false)}
                                onError={() => {
                                    setIsImageLoading(false);
                                    setError("Failed to load image.");
                                }}
                            />

                            {/* View Image Modal */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`absolute top-2 right-2  ${theme === "dark"
                                                ? "bg-slate-800/75 hover:bg-slate-700/75 text-slate-100"
                                                : "bg-gray-100/75 hover:bg-gray-200/75 text-gray-900 hover:text-black"
                                            }`}
                                    >
                                        <Maximize className={`h-4 w-4`} />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent
                                    className={`max-w-4xl border-gray-200 ${theme === "dark"
                                            ? "bg-slate-900 "
                                            : "bg-black "
                                        }`}
                                >


                                    <img
                                        src={imgbbUrl || imageUrl}
                                        alt="Generated"
                                        className="w-full h-auto max-h-[80vh] object-contain"
                                    />
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </div>

                {/* Mobile Buttons */}
                {imageUrl && !isImageLoading && (
                    <div className="md:hidden absolute bottom-0 right-6 flex gap-2">
                        <Button
                            // disabled={!imgbbUrl}
                            onClick={handleDownload}
                            className={`${theme === "dark"
                                    ? "bg-slate-700 hover:bg-slate-600"
                                    : "bg-green-600 hover:bg-green-700"
                                } text-white rounded-full p-2`}
                            size="icon"
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button
                            onClick={handleCopyUrl}
                            className={`${theme === "dark"
                                    ? "bg-slate-700 hover:bg-slate-600"
                                    : "bg-slate-600 hover:bg-slate-700"
                                } text-white rounded-full p-2`}
                            size="icon"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* Desktop Buttons */}
                {imageUrl && !isImageLoading && (
                    <div className="hidden md:flex flex-col gap-2 w-full mt-4">
                        <Button
                            // disabled={!imgbbUrl} 
                            onClick={handleDownload}
                            className={`w-full ${theme === "dark"
                                    ? "bg-green-800 hover:bg-green-900"
                                    : "bg-green-600 hover:bg-green-700"
                                } text-white transition-colors`}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download Image
                        </Button>
                        <Button
                            onClick={handleCopyUrl}
                            className={`w-full ${theme === "dark"
                                    ? "bg-blue-900 hover:bg-blue-950"
                                    : "bg-slate-700 hover:bg-slate-600"
                                } text-white transition-colors`}
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Image URL
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Fastest;