import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';

export function CaseConverter() {
  const [text, setText] = useState('');

  const transform = (type: 'upper' | 'lower' | 'title' | 'camel' | 'sentence') => {
    let result = text;
    switch(type) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'title': 
        result = text.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' '); 
        break;
      case 'camel':
        result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        break;
      case 'sentence':
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
    }
    setText(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => transform('upper')}>UPPERCASE</Button>
        <Button variant="outline" onClick={() => transform('lower')}>lowercase</Button>
        <Button variant="outline" onClick={() => transform('title')}>Title Case</Button>
        <Button variant="outline" onClick={() => transform('sentence')}>Sentence case</Button>
        <Button variant="outline" onClick={() => transform('camel')}>camelCase</Button>
        <div className="ml-auto">
          <Button variant="secondary" size="icon" onClick={copyToClipboard}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <Textarea 
        placeholder="Paste your text here..." 
        className="min-h-[300px] resize-none text-lg leading-relaxed"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
