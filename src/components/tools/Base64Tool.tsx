import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, ArrowRightLeft } from 'lucide-react';

export function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => {
    try {
      // Encode UTF-8 safely
      setOutput(btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g,
          function toSolidBytes(match, p1) {
              return String.fromCharCode(parseInt(p1, 16));
      })));
    } catch (e) {
      toast.error('Could not encode processing failed.');
    }
  };

  const decode = () => {
    try {
      // Decode UTF-8 safely
      setOutput(decodeURIComponent(atob(input).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')));
    } catch (e) {
      toast.error('Invalid Base64 string');
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(output);
    toast.success('Result copied');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Input</h3>
        <Textarea 
          placeholder="Enter text here..." 
          className="min-h-[300px] resize-none font-mono text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={encode} className="flex-1">Encode</Button>
          <Button onClick={decode} variant="outline" className="flex-1">Decode</Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
           <h3 className="text-lg font-medium">Output</h3>
           <Button variant="ghost" size="icon" onClick={copyResult} disabled={!output}>
              <Copy className="w-4 h-4" />
           </Button>
        </div>
        <Textarea 
          readOnly
          placeholder="Output will appear here..." 
          className="min-h-[300px] resize-none font-mono text-sm bg-transparent"
          value={output}
        />
      </div>
    </div>
  );
}
