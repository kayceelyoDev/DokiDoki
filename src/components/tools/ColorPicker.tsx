import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Pipette, Copy, Palette } from 'lucide-react';

export function ColorPicker() {
  const [color, setColor] = useState('#059669');
  const [palette, setPalette] = useState<string[]>(['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0']);

  const copy = (c: string) => {
    navigator.clipboard.writeText(c);
    toast.success(`Copied ${c}`);
  };

  const generatePalette = () => {
    const newPalette = Array.from({ length: 5 }, () => {
      return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    });
    setPalette(newPalette);
    setColor(newPalette[0]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Select Color</Label>
            <div className="flex gap-4">
              <Input 
                type="color" 
                value={color} 
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-16 p-0 border-none cursor-pointer overflow-hidden rounded-xl"
              />
              <Input 
                value={color} 
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 font-mono text-xl h-16 uppercase"
              />
              <Button size="icon" className="h-16 w-16" variant="outline" onClick={() => copy(color)}>
                <Copy className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Card className="bg-muted/30 border-none">
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <span className="text-xs uppercase text-muted-foreground mb-1 font-semibold">RGB</span>
                  <span className="font-mono text-sm">
                    {parseInt(color.slice(1,3), 16)}, {parseInt(color.slice(3,5), 16)}, {parseInt(color.slice(5,7), 16)}
                  </span>
                </CardContent>
             </Card>
              <Card className="bg-muted/30 border-none">
                 <CardContent className="p-4 flex flex-col items-center justify-center">
                   <span className="text-xs uppercase text-muted-foreground mb-1 font-semibold">HSL</span>
                   <span className="font-mono text-sm">
                     {(() => {
                        const r = parseInt(color.slice(1,3) || '00', 16) / 255;
                        const g = parseInt(color.slice(3,5) || '00', 16) / 255;
                        const b = parseInt(color.slice(5,7) || '00', 16) / 255;
                        const max = Math.max(r, g, b), min = Math.min(r, g, b);
                        let h = 0, s, l = (max + min) / 2;
                        if(max === min){
                            h = s = 0; 
                        }else{
                            const d = max - min;
                            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                            switch(max){
                                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                                case g: h = (b - r) / d + 2; break;
                                case b: h = (r - g) / d + 4; break;
                            }
                            h /= 6;
                        }
                        return `${Math.round(h*360)}°, ${Math.round(s*100)}%, ${Math.round(l*100)}%`;
                     })()}
                   </span>
                 </CardContent>
              </Card>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Random Palette</Label>
            <Button variant="ghost" size="sm" onClick={generatePalette} className="gap-2">
              <Palette className="w-4 h-4" /> Generate
            </Button>
          </div>
          <div className="flex flex-col gap-3">
             {palette.map((c, i) => (
               <div 
                key={i} 
                onClick={() => { setColor(c); copy(c); }}
                className="group flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-muted transition-colors"
                >
                 <div className="w-12 h-12 rounded-lg shadow-sm" style={{ backgroundColor: c }} />
                 <span className="font-mono font-medium flex-1 uppercase">{c}</span>
                 <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="h-24 w-full rounded-2xl shadow-inner flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: color }}>
        <span className="z-10 text-white mix-blend-difference font-bold text-2xl uppercase tracking-widest">{color}</span>
      </div>
    </div>
  );
}
