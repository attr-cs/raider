import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // Assuming Shadcn provides a Button component
import { Loader2 } from 'lucide-react'; // Spinner icon

const Fastest = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:4000/generate-fast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, aspectRatio }),
            });

            const data = await response.json();
            if (data.imageUrl) {
                setImageUrl(data.imageUrl); //  image URL
                setLoading(false);
            } else {
                alert('Failed to generate image');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while generating the image');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Generate Image</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                <input
                    type="text"
                    placeholder="Enter a prompt (e.g., cute cat)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Aspect ratio (e.g., 1:1)"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        'Generate Image'
                    )}
                </Button>
                {imageUrl && (
                <div className="mt-6">
                    <img src={imageUrl} alt="Generated" className="rounded-lg w-full shadow-lg" />
                </div>
            )}
            </form>

           
        </div>
    );
};

export default Fastest;