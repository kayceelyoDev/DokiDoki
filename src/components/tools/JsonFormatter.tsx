import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, FileLock, Minimize, Maximize } from 'lucide-react';

export function JsonFormatter() {
  const [json, setJson] = useState('');

  const format = (type: 'pretty' | 'minify') => {
    try {
      const parsed = JSON.parse(json);
      const result = type === 'pretty' ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);
      setJson(result);
      toast.success(`JSON ${type === 'pretty' ? 'Formatted' : 'Minified'}`);
    } catch (e) {
      toast.error('Invalid JSON');
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(json);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => format('pretty')}>
          <Maximize className="w-4 h-4 mr-2" /> Prettify
        </Button>
        <Button variant="outline" onClick={() => format('minify')}>
          <Minimize className="w-4 h-4 mr-2" /> Minify
        </Button>
        <div className="ml-auto">
          <Button variant="secondary" size="icon" onClick={copy}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <Textarea 
        placeholder='Paste your JSON here... {"key": "value"}'
        className="min-h-[500px] resize-none font-mono text-sm"
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />
    </div>
  );
}
