
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { generationState, userState } from '@/store/atoms';
import { Button } from '@/components/ui/button';

import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

function Generate() {
  const [prompt, setPrompt] = useState('');
  const [generation, setGeneration] = useRecoilState(generationState);
  const user = useRecoilValue(userState);

  const handleGenerate = async () => {
    if (!prompt.trim() || generation.isGenerating) return;
    
    setGeneration(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sample images array
      const sampleImages = [
        'https://picsum.photos/seed/1/512/512',
        'https://picsum.photos/seed/2/512/512',
        'https://picsum.photos/seed/3/512/512'
      ];
      
      const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
      
      setGeneration(prev => ({
        ...prev,
        isGenerating: false,
        result: randomImage,
        error: null
      }));
      
    } catch (error) {
      setGeneration(prev => ({
        ...prev,
        isGenerating: false,
        error: 'Failed to generate image'
      }));
    }
  };

  return (
    
    <div className="container max-w-2xl py-8 mt-16 animate-fade-in">
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Generate Image</h1>
          <span className="text-sm text-muted-foreground">
            Credits: {user.credits}
          </span>
        </div>
        
        <div className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="min-h-[100px] resize-none"
          />

          <Button 
            onClick={handleGenerate}
            disabled={generation.isGenerating || !prompt.trim()}
            className="w-full relative"
          >
            {generation.isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              'Generate Image'
            )}
          </Button>
        </div>

        {generation.error && (
          <p className="mt-4 text-sm text-red-500 bg-red-500/10 p-3 rounded-md">
            {generation.error}
          </p>
        )}

        {generation.result && (
          <div className="mt-6 animate-slide-up">
            <img 
              src={generation.result} 
              alt="Generated image"
              className="w-full rounded-lg shadow-lg gpu" 
              loading="lazy"
            />
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="w-full" onClick={() => window.open(generation.result, '_blank')}>
                Open Original
              </Button>
              <Button variant="outline" className="w-full" onClick={() => {/* Add save to gallery logic */}}>
                Save to Gallery
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
    
  );
}

export default Generate;
