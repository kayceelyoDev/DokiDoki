import { 
  FileText, 
  Image, 
  Code, 
  Clock, 
  FileDown, 
  FilePlus, 
  Type, 
  Hash, 
  Eye, 
  Eraser, 
  Maximize, 
  RefreshCcw, 
  Pipette, 
  Crop, 
  Braces, 
  Binary, 
  QrCode, 
  ShieldCheck, 
  Timer, 
  CheckSquare,
  Sparkles,
  FileArchive
} from 'lucide-react';
import { Tool } from './types';
import { WordCounter } from './components/tools/WordCounter';
import { CaseConverter } from './components/tools/CaseConverter';
import { MarkdownPreviewer } from './components/tools/MarkdownPreviewer';
import { PasswordGenerator } from './components/tools/PasswordGenerator';
import { PomodoroTimer } from './components/tools/PomodoroTimer';
import { TodoList } from './components/tools/TodoList';
import { JsonFormatter } from './components/tools/JsonFormatter';
import { Base64Tool } from './components/tools/Base64Tool';
import { QrCodeGenerator } from './components/tools/QrCodeGenerator';
import { ImageResizer } from './components/tools/ImageResizer';
import { BackgroundRemover } from './components/tools/BackgroundRemover';

import { PdfTool } from './components/tools/PdfTool';
import { FileCompressor } from './components/tools/FileCompressor';
import { ColorPicker } from './components/tools/ColorPicker';

import { GrammarChecker } from './components/tools/GrammarChecker';

export const TOOLS: Tool[] = [
  // Document & Text
  {
    id: 'grammar-checker',
    name: 'Smart Grammar Fix',
    description: 'AI-powered grammar and spelling correction for your text.',
    category: 'document',
    icon: Sparkles,
    component: GrammarChecker,
  },
  {
    id: 'file-compressor',
    name: 'File Compressor',
    description: 'Compress images and PDFs to a smaller file size.',
    category: 'document',
    icon: FileArchive,
    component: FileCompressor,
  },
  {
    id: 'pdf-merge',
    name: 'PDF Merger',
    description: 'Combine multiple PDF documents into a single file.',
    category: 'document',
    icon: FilePlus,
    component: PdfTool,
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Real-time word and character counting with reading time.',
    category: 'document',
    icon: Type,
    component: WordCounter,
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Toggle between UPPER, lower, Title, and camelCase.',
    category: 'document',
    icon: RefreshCcw,
    component: CaseConverter,
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Live preview for your markdown documents.',
    category: 'document',
    icon: Eye,
    component: MarkdownPreviewer,
  },
  
  // Image & Visual
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize and compress images in your browser.',
    category: 'image',
    icon: Maximize,
    component: ImageResizer,
  },
  {
    id: 'bg-remover',
    name: 'Background Remover',
    description: 'Remove background from photos using smart color detection.',
    category: 'image',
    icon: Eraser,
    component: BackgroundRemover,
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Extract and pick colors, generate random palettes.',
    category: 'image',
    icon: Pipette,
    component: ColorPicker,
  },
  
  // Developer & Data
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Prettify, minify and validate JSON data.',
    category: 'developer',
    icon: Braces,
    component: JsonFormatter,
  },
  {
    id: 'base64',
    name: 'Base64 Converter',
    description: 'Encode and decode strings to Base64.',
    category: 'developer',
    icon: Binary,
    component: Base64Tool,
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate customizable QR codes for links or text.',
    category: 'developer',
    icon: QrCode,
    component: QrCodeGenerator,
  },
  {
    id: 'password-gen',
    name: 'Password Generator',
    description: 'Create strong, secure, customizable passwords.',
    category: 'developer',
    icon: ShieldCheck,
    component: PasswordGenerator,
  },

  // Focus & Productivity
  {
    id: 'pomodoro',
    name: 'Pomodoro Timer',
    description: 'Stay focused with 25/5 minute interval cycles.',
    category: 'productivity',
    icon: Timer,
    component: PomodoroTimer,
  },
  {
    id: 'todo',
    name: 'To-Do Scratchpad',
    description: 'Quick checklist that saves automatically to your browser.',
    category: 'productivity',
    icon: CheckSquare,
    component: TodoList,
  },
];
