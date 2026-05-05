import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export function WordCounter() {
  const [text, setText] = useState('');
  
  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    charsNoSpaces: text.replace(/\s+/g, '').length,
    sentences: text.split(/[.?!]+/).filter(sentence => sentence.trim().length > 0).length,
    readingTime: Math.ceil((text.trim() ? text.trim().split(/\s+/).length : 0) / 200)
  };

  return (
    <div className="grid gap-6">
      <Textarea 
        placeholder="Paste your text here..." 
        className="min-h-[300px] resize-none text-lg leading-relaxed"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Words', value: stats.words },
          { label: 'Characters', value: stats.chars },
          { label: 'Chars (no space)', value: stats.charsNoSpaces },
          { label: 'Sentences', value: stats.sentences },
          { label: 'Reading Time', value: `${stats.readingTime} min` },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 flex flex-col items-center justify-center p-4">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
