import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Upload, Download, Loader2, RefreshCcw, Wand2, ImageIcon
} from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';

export function BackgroundRemover() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setImage(null);
    setProcessedImage(null);
    setProgress(0);
    setSliderPosition(50);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImage(result);
      processImage(result);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const response = await fetch(imageData);
      const blob = await response.blob();
      
      const config = {
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            setProgress(Math.round((current / total) * 100));
          }
        }
      };

      const resultBlob = await removeBackground(blob, config);
      const url = URL.createObjectURL(resultBlob);
      
      setProcessedImage(url);
      toast.success("Background removed successfully");
    } catch (err: any) {
      console.error("Background removal failed:", err);
      toast.error("Failed to remove background. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = `removed-bg-${Date.now()}.png`;
    link.href = processedImage;
    link.click();
  };

  const reset = () => {
    setImage(null);
    setProcessedImage(null);
    setIsProcessing(false);
    setProgress(0);
    setSliderPosition(50);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    // Check if pointer is down
    if (e.buttons !== 1) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-2">
        {processedImage ? (
          <>
            <Button variant="outline" onClick={reset}>
              <RefreshCcw className="w-4 h-4 mr-2" /> Start Over
            </Button>
            <div className="ml-auto">
              <Button onClick={download}>
                <Download className="w-4 h-4 mr-2" /> Download PNG
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mr-auto select-none">
            <Wand2 className="w-4 h-4" />
            <span>AI Background Remover via WebAssembly</span>
          </div>
        )}
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {!image ? (
            <label className="w-full flex flex-col items-center justify-center gap-4 min-h-[400px] border-2 border-dashed border-muted rounded-xl hover:bg-muted/50 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                accept="image/*"
              />
              <div className="p-4 bg-background rounded-full shadow-sm border">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Click or drag image here</p>
                <p className="text-sm text-muted-foreground mt-1">Supports PNG, JPG, WEBP</p>
              </div>
            </label>
          ) : (
            <div className="relative min-h-[400px] flex items-center justify-center bg-muted/20 rounded-xl overflow-hidden">
               {isProcessing && !processedImage ? (
                 <div className="flex flex-col items-center gap-4 py-12">
                   <Loader2 className="w-12 h-12 animate-spin text-primary" />
                   <div className="text-center space-y-1">
                     <h3 className="font-medium text-lg">Removing Background...</h3>
                     <p className="text-muted-foreground">{progress}% complete</p>
                   </div>
                 </div>
               ) : processedImage ? (
                 <div 
                   ref={containerRef}
                   className="relative w-full max-w-2xl mx-auto touch-none select-none cursor-ew-resize group"
                   onPointerMove={handlePointerMove}
                   onClick={handleClick}
                 >
                   {/* Checkerboard background for processed image */}
                   <div 
                     className="absolute inset-0 pointer-events-none rounded-lg"
                     style={{ 
                       backgroundImage: 'conic-gradient(#0000001a 0.25turn, #00000000 0.25turn 0.5turn, #0000001a 0.5turn 0.75turn, #00000000 0.75turn)', 
                       backgroundSize: '20px 20px',
                       backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                     }} 
                   />
                   
                   {/* Processed Image (Background) */}
                   <img 
                     src={processedImage} 
                     alt="Processed" 
                     className="block w-full h-auto pointer-events-none rounded-lg shadow-md"
                     draggable={false}
                   />

                   {/* Original Image (Foreground, Clipped) */}
                   <img 
                     src={image} 
                     alt="Original" 
                     className="absolute inset-0 block w-full h-auto pointer-events-none rounded-lg"
                     style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                     draggable={false}
                   />

                   {/* Slider Line & Handle */}
                   <div 
                     className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none transition-transform duration-75"
                     style={{ left: `calc(${sliderPosition}% - 2px)` }}
                   >
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-card border-2 border-border rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                       <div className="flex gap-1">
                         <div className="w-0.5 h-3 bg-muted-foreground rounded-full" />
                         <div className="w-0.5 h-3 bg-muted-foreground rounded-full" />
                       </div>
                     </div>
                   </div>

                   {/* Labels */}
                   <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium pointer-events-none select-none shadow-sm">
                     Original
                   </div>
                   <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium pointer-events-none select-none shadow-sm">
                     Removed
                   </div>
                 </div>
               ) : (
                 <img src={image} alt="Uploading..." className="max-h-[600px] w-auto object-contain rounded-lg opacity-50" />
               )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
