import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Upload, Download, Maximize, FileImage } from 'lucide-react';

export function ImageResizer() {
  const [image, setImage] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, originalWidth: 0, originalHeight: 0 });
  const [scale, setScale] = useState(100);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(event.target?.result as string);
        setDimensions({
          width: img.width,
          height: img.height,
          originalWidth: img.width,
          originalHeight: img.height
        });
        setScale(100);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleScaleChange = (val: number) => {
    if (isNaN(val)) return;
    setScale(val);
    const newWidth = Math.round(dimensions.originalWidth * (val / 100));
    const newHeight = Math.round(dimensions.originalHeight * (val / 100));
    setDimensions(prev => ({
      ...prev,
      width: newWidth || 0,
      height: newHeight || 0
    }));
  };

  const handleWidthChange = (val: string) => {
    const width = parseInt(val) || 0;
    if (lockAspectRatio) {
      const ratio = dimensions.originalHeight / dimensions.originalWidth;
      const height = Math.round(width * ratio);
      setDimensions(prev => ({ ...prev, width, height }));
      setScale(Math.round((width / dimensions.originalWidth) * 100));
    } else {
      setDimensions(prev => ({ ...prev, width }));
    }
  };

  const handleHeightChange = (val: string) => {
    const height = parseInt(val) || 0;
    if (lockAspectRatio) {
      const ratio = dimensions.originalWidth / dimensions.originalHeight;
      const width = Math.round(height * ratio);
      setDimensions(prev => ({ ...prev, width, height }));
      setScale(Math.round((height / dimensions.originalHeight) * 100));
    } else {
      setDimensions(prev => ({ ...prev, height }));
    }
  };

  const download = () => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.download = `resized-${dimensions.width}x${dimensions.height}.png`;
        a.href = url;
        a.click();
        toast.success('Image downloaded');
      }
    };
    img.src = image;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="space-y-4">
          <Label>Upload Image</Label>
          <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 transition-colors hover:border-primary/50 group">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              accept="image/*"
              onChange={onFileChange}
            />
            <div className="flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
              <Upload className="w-8 h-8 mb-2" />
              <p className="text-sm font-medium">Click or drag to upload</p>
            </div>
          </div>
        </div>

        {image && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Scale: {scale}%</Label>
              </div>
              <Slider 
                value={[scale]} 
                min={1} 
                max={200} 
                step={1} 
                onValueChange={(v: any) => {
                  const val = Array.isArray(v) ? v[0] : v;
                  if (val !== undefined) handleScaleChange(val);
                }} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Width (px)</Label>
                <Input 
                  type="number"
                  value={dimensions.width} 
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className="bg-background" 
                />
              </div>
              <div className="space-y-2">
                <Label>Height (px)</Label>
                <Input 
                  type="number"
                  value={dimensions.height} 
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="bg-background" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => handleScaleChange(50)}>
                0.5x
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleScaleChange(200)}>
                2x
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full" onClick={() => handleScaleChange(100)}>
                Reset to Original
              </Button>
            </div>

            <div className="flex items-center gap-2 py-2">
              <input 
                type="checkbox" 
                id="aspect-ratio" 
                checked={lockAspectRatio} 
                onChange={(e) => setLockAspectRatio(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <Label htmlFor="aspect-ratio" className="cursor-pointer">Lock Aspect Ratio</Label>
            </div>

            <Button className="w-full" onClick={download}>
              <Download className="w-4 h-4 mr-2" />
              Download Resized
            </Button>
          </div>
        )}
      </div>

      <div className="lg:col-span-2">
        <Card className="h-full flex items-center justify-center overflow-auto min-h-[400px] bg-muted/20">
          <CardContent className="p-4 flex items-center justify-center">
            {image ? (
              <img 
                src={image} 
                style={{ 
                  width: `${dimensions.width}px`, 
                  height: `${dimensions.height}px`,
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: lockAspectRatio ? 'contain' : 'fill'
                }} 
                className="shadow-lg rounded-sm transition-all duration-200"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <FileImage className="w-16 h-16 mb-4 opacity-10" />
                <p>Preview will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
