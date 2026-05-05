import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Copy, RefreshCw } from 'lucide-react';

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [hasUpper, setHasUpper] = useState(true);
  const [hasLower, setHasLower] = useState(true);
  const [hasNumbers, setHasNumbers] = useState(true);
  const [hasSymbols, setHasSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const generate = () => {
    const uc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lc = 'abcdefghijklmnopqrstuvwxyz';
    const num = '0123456789';
    const sym = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let charset = '';
    if (hasUpper) charset += uc;
    if (hasLower) charset += lc;
    if (hasNumbers) charset += num;
    if (hasSymbols) charset += sym;

    if (!charset) {
      toast.error('Please select at least one option');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  const copy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast.success('Password copied');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center mb-6">
            <div className="flex-1 bg-muted p-4 rounded-lg font-mono text-xl break-all text-center min-h-[64px] flex items-center justify-center">
              {password || 'Click Generate'}
            </div>
            <div className="flex flex-col gap-2">
              <Button size="icon" onClick={generate}><RefreshCw className="w-5 h-5" /></Button>
              <Button size="icon" variant="outline" onClick={copy} disabled={!password}><Copy className="w-5 h-5" /></Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Length: {length}</Label>
              </div>
              <Slider 
                min={8} 
                max={50} 
                step={1} 
                value={[length]} 
                onValueChange={(v: any) => {
                  const val = Array.isArray(v) ? v[0] : v;
                  if (val !== undefined) setLength(val);
                }} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch id="upper" checked={hasUpper} onCheckedChange={setHasUpper} />
                <Label htmlFor="upper">Uppercase</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="lower" checked={hasLower} onCheckedChange={setHasLower} />
                <Label htmlFor="lower">Lowercase</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="number" checked={hasNumbers} onCheckedChange={setHasNumbers} />
                <Label htmlFor="number">Numbers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="symbol" checked={hasSymbols} onCheckedChange={setHasSymbols} />
                <Label htmlFor="symbol">Symbols</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
