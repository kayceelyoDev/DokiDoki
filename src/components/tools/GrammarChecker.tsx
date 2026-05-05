import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Check, Copy } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { toast } from 'sonner';

export function GrammarChecker() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const checkGrammar = async () => {
    if (!text.trim()) return;
    setIsChecking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const prompt = `Act as a professional editor. Correct the following text for grammar, spelling, and clarity. Only return the corrected text, nothing else.\n\nText: ${text}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      setResult(response.text || '');
      toast.success('Check complete');
    } catch (error) {
      console.error(error);
      toast.error('Failed to check grammar. Please check your API key.');
    } finally {
      setIsChecking(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Original Text</h3>
        <Textarea 
          placeholder="Paste text with errors here..." 
          className="min-h-[400px] resize-none text-lg leading-relaxed"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={checkGrammar} className="w-full h-12 text-lg font-medium" disabled={isChecking || !text.trim()}>
          {isChecking ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
          {isChecking ? 'Checking...' : 'Fix Grammar & Spelling'}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
           <h3 className="text-lg font-medium">Corrected Text</h3>
           <Button variant="ghost" size="icon" onClick={copyResult} disabled={!result}>
              <Copy className="w-4 h-4" />
           </Button>
        </div>
        <div className="min-h-[400px] text-lg leading-relaxed whitespace-pre-wrap border border-input rounded-lg px-3 py-3 bg-muted/50">
          {result || <span className="text-muted-foreground italic">Correction will appear here...</span>}
        </div>
      </div>
    </div>
  );
}
