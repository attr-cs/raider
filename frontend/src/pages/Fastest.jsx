// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Loader2,
//   Download,
//   Maximize,
//   Sparkles,
//   Brush,
//   Copy,
//   Moon,
//   Sun,
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { useToast } from "@/hooks/use-toast";
// import { Toaster } from "@/components/ui/toaster";

// const Customize = () => {
//   const [imageUrl, setImageUrl] = useState("");
//   const [imgbbUrl, setImgbbUrl] = useState("");
//   const [prompt, setPrompt] = useState("water drop");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isImageLoading, setIsImageLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [aspectRatio, setAspectRatio] = useState("1:1");
//   const [model, setModel] = useState("turbo"); // Default to 'turbo'
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const [theme, setTheme] = useState("dark"); // 'dark' or 'light'
//   const [seed, setSeed] = useState(4245); // New: Seed value
//   const [width, setWidth] = useState(1024); // New: Width value
//   const [height, setHeight] = useState(900); // New: Height value
//   const [enhance, setEnhance] = useState(true); // New: Enhance toggle
//   const { toast } = useToast();

//   // Toggle Theme with Smooth Animation
//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
//   };

//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", theme);
//   }, [theme]);

//   const generateImage = async () => {
//     setIsLoading(true);
//     setIsImageLoading(true);
//     setImgbbUrl("");
//     setImageUrl("");
//     setError("");
//     setDownloadUrl("");

//     if (!prompt) {
//       toast({
//         title: "Error",
//         description: "Please enter a prompt.",
//         variant: "destructive",
//       });
//       setIsLoading(false);
//       setIsImageLoading(false);
//       return;
//     }

//     try {
//       const backendImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
//         prompt
//       )}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=${enhance}&model=${model}`;
//       const imageResponse = await fetch(backendImageUrl);

//       if (!imageResponse.ok) {
//         throw new Error("Failed to fetch image from the backend");
//       }

//       const imageBlob = await imageResponse.blob();
//       const localImageUrl = URL.createObjectURL(imageBlob);
//       setImageUrl(localImageUrl);
//       setDownloadUrl(localImageUrl);

//       // Step 1: Display the image locally
//       toast({
//         title: "Success!",
//         description: "Your image has been generated.",
//       });

//       // Step 2: Upload the image to ImgBB
//       const formData = new FormData();
//       formData.append("image", imageBlob);

//       const imgbbResponse = await fetch(
//         `https://api.imgbb.com/1/upload?key=78026bbefd12af05a47cbdfffe141f83`, // Your ImgBB API key
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const imgbbData = await imgbbResponse.json();

//       // Step 3: Check if the ImgBB upload was successful
//       if (!imgbbData.success) {
//         throw new Error("Failed to upload image to ImgBB");
//       }

//       // Step 4: Replace the local image URL with the ImgBB URL
//       const newImgbbUrl = imgbbData.data.url;
//       setImgbbUrl(newImgbbUrl);

//       const saveResponse = await fetch("https://raider.onrender.com/api/save-image-details", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           imgbbUrl: newImgbbUrl,
//           prompt,
//           model,
//           aspectRatio,
//           seed
//         }),
//       });

//       const saveData = await saveResponse.json();
//       if (!saveResponse.ok) {
//         throw new Error(saveData.error || "Failed to save image details.");
//       }
//     } catch (error) {
//       console.error("Failed to generate image:", error);
//       setError(error.message || "An unexpected error occurred.");
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to generate image. Please try again.",
//       });
//     } finally {
//       setIsLoading(false);
//       setIsImageLoading(false);
//       setPrompt(""); // Clear the prompt after image generation
//     }
//   };

//   const handleDownload = () => {
//     if (!downloadUrl) {
//       toast({
//         title: "Error",
//         description: "No image available to download.",
//         variant: "destructive",
//       });
//       return;
//     }

//     const link = document.createElement("a");
//     link.href = downloadUrl;
//     link.download = `generated-image-${Date.now()}.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     toast({
//       title: "Success!",
//       description: "Image downloaded successfully.",
//     });
//   };

//   const handleCopyUrl = () => {
//     if (!imgbbUrl && !imageUrl) {
//       toast({
//         title: "Error",
//         description: "No image available to copy.",
//         variant: "destructive",
//       });
//       return;
//     }

//     navigator.clipboard.writeText(imgbbUrl || imageUrl);
//     toast({
//       title: "Copied!",
//       description: "Image URL copied to clipboard.",
//     });
//   };

//   return (
//     <>
//     <Toaster/>
//       {/* Theme Toggle Button */}
//       <Button onClick={toggleTheme}>
//         {theme === "dark" ? <Sun /> : <Moon />}
//       </Button>

//       {/* Main Container */}
//       <div className="flex flex-col md:flex-row gap-4">
//         {/* Left Column: Form Section */}
//         <Card className="w-full md:w-1/2">
//           <CardHeader>
//             <CardTitle>Image Generator</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {/* Prompt Input */}
//             <Input
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               placeholder="Enter a prompt..."
//               className={`w-full ${
//                 theme === "dark"
//                   ? "bg-slate-800 text-slate-100 border-slate-700 focus-visible:ring-slate-500"
//                   : "bg-gray-100 text-gray-900 border-gray-300 focus-visible:ring-blue-500"
//               } pl-10`}
//             />

//             {/* Aspect Ratio Selector */}
//             <Select value={aspectRatio} onValueChange={setAspectRatio}>
//               <SelectTrigger 
//               className={`${
//                 theme === "dark"
//                   ? "bg-slate-800 text-slate-100 border-slate-700 focus:ring-slate-500"
//                   : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-500"
//               }`}>
//                 <SelectValue placeholder="Aspect Ratio" />
//               </SelectTrigger>
//               <SelectContent 
//               className={`${
//                 theme === "dark"
//                   ? "bg-slate-800 border-slate-700"
//                   : "bg-white border-gray-200"
//               }`}>
//                 <SelectItem value="1:1">1:1 (Square)</SelectItem>
//                 <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
//                 <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
//                 <SelectItem value="21:9">21:9 (Ultrawide)</SelectItem>
//                 <SelectItem value="9:21">9:21 (Tall)</SelectItem>
//                 <SelectItem value="1:2">1:2 (Portrait)</SelectItem>
//                 <SelectItem value="2:1">2:1 (Landscape)</SelectItem>
//               </SelectContent>
//             </Select>

//             {/* Model Selector */}
//             <Select value={model} onValueChange={setModel}>
//               <SelectTrigger 
//               className={`${
//                 theme === "dark"
//                   ? "bg-slate-800 text-slate-100 border-slate-700 focus:ring-slate-500"
//                   : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-500"
//               }`}>
//                 <SelectValue placeholder="Model" />
//               </SelectTrigger>
//               <SelectContent 
//               className={`${
//                 theme === "dark"
//                   ? "bg-slate-800 border-slate-700"
//                   : "bg-white border-gray-200"
//               }`}
//               >
//                 <SelectItem value="flux">Flux</SelectItem>
//                 <SelectItem value="turbo">Turbo</SelectItem>
//               </SelectContent>
//             </Select>

//             {/* Additional Parameters */}
//             <div className="flex flex-col gap-2 mt-4">
//               <Input
//                 type="number"
//                 value={seed}
//                 onChange={(e) => setSeed(Number(e.target.value))}
//                 placeholder="Seed (default: 4245)"
//               />
//               <Input
//                 type="number"
//                 value={width}
//                 onChange={(e) => setWidth(Number(e.target.value))}
//                 placeholder="Width (default: 1024)"
//               />
//               <Input
//                 type="number"
//                 value={height}
//                 onChange={(e) => setHeight(Number(e.target.value))}
//                 placeholder="Height (default: 900)"
//               />
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={enhance}
//                   onChange={(e) => setEnhance(e.target.checked)}
//                 />
//                 Enhance Image
//               </label>
//             </div>

//             {/* Generate Button */}
//             <Button
//               onClick={generateImage}
//               disabled={isLoading}
//               className="mt-4 w-full"
//             >
//               {isLoading ? <Loader2 className="animate-spin" /> : "Generate Image"}
//             </Button>

//             {/* Error Message */}
//             {error && <p className="text-red-500 mt-2">{error}</p>}
//           </CardContent>
//         </Card>

//         {/* Right Column: Image Display Section */}
//         <Card className="w-full md:w-1/2">
//           <CardContent>
//             {/* Loading Animation */}
//             {isImageLoading && (
//               <div className="flex justify-center items-center h-64">
//                 <Loader2 className="animate-spin text-primary" size={48} />
//               </div>
//             )}

//             {imageUrl && !isImageLoading && (
//               <img
//                 src={imageUrl}
//                 alt="Generated"
//                 className="w-full h-auto rounded-lg"
//                 onLoad={() => setIsImageLoading(false)}
//                 onError={() => {
//                   setIsImageLoading(false);
//                   setError("Failed to load image.");
//                 }}
//               />
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Buttons for Download and Copy */}
//       {imageUrl && !isImageLoading && (
//         <div className="flex gap-4 mt-4">
//           <Button onClick={handleDownload}>
//             <Download className="mr-2" />
//             Download Image
//           </Button>
//           <Button onClick={handleCopyUrl}>
//             <Copy className="mr-2" />
//             Copy Image URL
//           </Button>
//         </div>
//       )}
//     </>
//   );
// };

// export default Customize;