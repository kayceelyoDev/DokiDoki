import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import jsPDF from 'jspdf';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Upload, Download, Loader2, FileArchive, ArrowRight } from 'lucide-react';

// Configure PDF.js worker using Vite asset loading
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export function FileCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [qualityMode, setQualityMode] = useState<'high' | 'balanced' | 'small'>('balanced');
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setCompressedUrl(null);
      setCompressedSize(0);
    }
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    setCompressedUrl(null);

    try {
      if (file.type.startsWith('image/')) {
        await compressImage(file);
      } else if (file.type === 'application/pdf') {
        await compressPdf(file);
      } else {
        toast.error('Only Images and PDFs are currently supported for compression.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to compress the file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const compressImage = async (imageFile: File) => {
    let maxWidthOrHeight = 1920;
    let initialQuality = 0.8;
    let targetMB = 10;
    
    if (qualityMode === 'high') {
      maxWidthOrHeight = 3840; // Allow 4K processing for high quality
      initialQuality = 1.0;
      targetMB = 20;
    } else if (qualityMode === 'balanced') {
      maxWidthOrHeight = 2048;
      initialQuality = 0.85;
      targetMB = 10;
    } else if (qualityMode === 'small') {
      maxWidthOrHeight = 1920;
      initialQuality = 0.75; // Still great quality
      targetMB = 5;
    }

    const options = {
      maxSizeMB: targetMB,
      maxWidthOrHeight,
      initialQuality,
      useWebWorker: true,
      alwaysKeepResolution: qualityMode === 'high',
    };
    
    toast.info('Compressing image...');
    const compressed = await imageCompression(imageFile, options);
    
    const url = URL.createObjectURL(compressed);
    setCompressedUrl(url);
    setCompressedSize(compressed.size);
    toast.success('Image compressed successfully!');
  };

  const compressPdf = async (pdfFile: File) => {
    toast.info('Analyzing PDF...');
    
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const numPages = pdf.numPages;
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    });
    
    const targetMB = qualityMode === 'high' ? 20 : qualityMode === 'balanced' ? 10 : 5;
    const targetBytes = targetMB * 1024 * 1024;
    const currentBytes = pdfFile.size;
    
    let scale = 1.5;
    let quality = 0.8;
    
    if (currentBytes > targetBytes) {
      const ratio = targetBytes / currentBytes;
      scale = Math.max(0.7, 1.5 * Math.sqrt(ratio));
      quality = Math.max(0.4, 0.8 * ratio);
    }
    
    // Override restrictions based on quality mode
    if (qualityMode === 'high') {
       // Maintain very high scale so text doesn't blur
       scale = Math.max(2.5, scale);
       quality = Math.max(0.9, quality); 
    } else if (qualityMode === 'balanced') {
       scale = Math.max(1.8, scale);
       quality = Math.max(0.8, quality);
    } else if (qualityMode === 'small') {
       scale = Math.max(1.2, scale); // good readability
       quality = Math.max(0.7, quality); // still good image quality
    }

    toast.info(`Compressing ${numPages} pages... This might take a while.`);

    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        // Use a format that supports quality settings for compression
        const imgData = canvas.toDataURL('image/jpeg', quality);
        
        // Add page to jsPDF (first page is already created)
        if (i > 1) {
            doc.addPage([viewport.width, viewport.height], viewport.width > viewport.height ? 'landscape' : 'portrait');
        } else {
            // Set first page size correctly
            const isLandscape = viewport.width > viewport.height;
            doc.deletePage(1);
            doc.addPage([viewport.width, viewport.height], isLandscape ? 'landscape' : 'portrait');
        }
        
        doc.setPage(i);
        doc.addImage(imgData, 'JPEG', 0, 0, viewport.width, viewport.height);
    }
    
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    
    setCompressedUrl(url);
    setCompressedSize(pdfBlob.size);
    toast.success('PDF compressed successfully!');
  };

  const handleDownload = () => {
    if (!compressedUrl || !file) return;
    
    const a = document.createElement('a');
    a.href = compressedUrl;
    
    const parts = file.name.split('.');
    const ext = parts.pop();
    const name = parts.join('.');
    
    a.download = `${name}-compressed.${ext}`;
    a.click();
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="space-y-4">
        <Label>Upload File (Image or PDF)</Label>
        <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 transition-colors hover:border-primary/50 group text-center">
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            accept="image/*,application/pdf"
            onChange={onFileChange}
          />
          <div className="flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
            <Upload className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">Click or drag a file to compress</p>
          </div>
        </div>
      </div>

      {file && (
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
                <span className="truncate flex-1 pr-4 font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Compression Mode</Label>
                <Tabs value={qualityMode} onValueChange={(val: any) => setQualityMode(val)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="small">Smallest Size</TabsTrigger>
                    <TabsTrigger value="balanced">Balanced</TabsTrigger>
                    <TabsTrigger value="high">Preserve Quality</TabsTrigger>
                  </TabsList>
                </Tabs>
                <p className="text-xs text-muted-foreground mt-2">
                  {qualityMode === 'small' && 'Maximum compression (approx 5MB max) while maintaining great quality and readability.'}
                  {qualityMode === 'balanced' && 'Good balance between file size (approx 10MB max) and visual fidelity.'}
                  {qualityMode === 'high' && 'Attempts highest quality (approx 20MB max) without losing any detail.'}
                </p>
              </div>
            </div>

            <Button 
                className="w-full" 
                onClick={handleCompress} 
                disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileArchive className="w-4 h-4 mr-2" />}
              {isProcessing ? 'Compressing...' : 'Compress File'}
            </Button>

            {compressedUrl && (
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="text-sm">
                       <span className="text-muted-foreground">New Size: </span>
                       <span className="font-bold text-primary">{(compressedSize / 1024 / 1024).toFixed(2)} MB</span>
                   </div>
                   <div className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                     -{((1 - (compressedSize / file.size)) * 100).toFixed(1)}%
                   </div>
                </div>
                <Button variant="secondary" onClick={handleDownload}>
                   <Download className="w-4 h-4 mr-2" />
                   Download
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <p className="text-center text-xs text-muted-foreground">
        Processing happens entirely on your device. Your files are never uploaded.
      </p>
    </div>
  );
}
