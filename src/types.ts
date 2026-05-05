import { LucideIcon } from 'lucide-react';

export type ToolCategory = 'document' | 'image' | 'developer' | 'productivity';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  component: React.ComponentType;
}
