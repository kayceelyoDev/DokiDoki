import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState('# Hello Markdown\n\nEdit this text to see the live preview!');

  return (
    <Tabs defaultValue="editor" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
        <TabsTrigger value="editor">Editor</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="hidden md:block h-full">
          <Textarea 
            placeholder="Markdown goes here..." 
            className="min-h-[500px] h-full resize-none font-mono text-sm"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
        </div>
        
        <TabsContent value="editor" className="md:hidden mt-0">
          <Textarea 
            placeholder="Markdown goes here..." 
            className="min-h-[500px] resize-none font-mono text-sm"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
        </TabsContent>

        <TabsContent value="preview" className="md:block mt-0 border-none h-full">
          <div className="min-h-[500px] h-full overflow-auto prose dark:prose-invert max-w-none border border-input rounded-lg px-6 py-6 bg-muted/50">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
