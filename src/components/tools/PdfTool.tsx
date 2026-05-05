import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FilePlus, FileMinus, Upload, Download, Loader2 } from 'lucide-react';

export function PdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      toast.error('Select at least 2 PDF files to merge');
      return;
    }

    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      a.click();
      toast.success('PDFs merged successfully');
    } catch (e) {
      toast.error('Error merging PDFs');
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="space-y-4">
        <Label>Upload PDF Files</Label>
        <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 transition-colors hover:border-primary/50 group text-center">
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            accept="application/pdf"
            multiple
            onChange={onFileChange}
          />
          <div className="flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
            <Upload className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">Select multiple PDF files to merge</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-medium">Selected Files ({files.length})</h3>
            <div className="space-y-2 max-h-[200px] overflow-auto">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-sm">
                  <span className="truncate flex-1 pr-4">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ))}
            </div>
            <Button 
                className="w-full" 
                onClick={mergePdfs} 
                disabled={isProcessing || files.length < 2}
            >
              {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FilePlus className="w-4 h-4 mr-2" />}
              Merge PDFs
            </Button>
          </CardContent>
        </Card>
      )}
      
      <p className="text-center text-xs text-muted-foreground">
        PDF processing happens entirely on your device using WebAssembly. Your documents are never uploaded.
      </p>
    </div>
  );
}
