import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function QrCodeGenerator() {
  const [value, setValue] = useState('https://omnitool.app');
  const qrRef = useRef<SVGSVGElement>(null);

  const download = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = 'qrcode.png';
      a.href = url;
      a.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(encodeURIComponent(svgData).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode(parseInt(p1, 16));
        }));
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="space-y-2">
        <Input 
          placeholder="Enter link or text..." 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="text-lg"
        />
      </div>

      <Card className="flex flex-col items-center justify-center py-12 px-6">
        <div className="bg-white p-4 rounded-xl shadow-inner mb-8">
          <QRCodeSVG 
            value={value || ' '}
            size={256}
            level="H"
            includeMargin={true}
            ref={qrRef}
          />
        </div>
        <Button onClick={download} className="w-full" disabled={!value}>
          <Download className="w-4 h-4 mr-2" />
          Download PNG
        </Button>
      </Card>
      <p className="text-center text-xs text-muted-foreground">
        Generated fully on your device. Privacy guaranteed.
      </p>
    </div>
  );
}
