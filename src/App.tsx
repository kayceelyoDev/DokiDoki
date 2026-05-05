import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Moon, 
  Sun, 
  LayoutGrid, 
  FileText, 
  Image as ImageIcon, 
  Code, 
  Clock,
  Menu,
  Github,
  Heart,
  Leaf
} from 'lucide-react';
import { TOOLS } from './constants';
import { Tool, ToolCategory } from './types';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/card';
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './components/ui/sidebar';
import { Sheet, SheetTrigger, SheetContent, SheetHeader as SheetHeaderComponent, SheetTitle, SheetDescription } from './components/ui/sheet';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all' | 'favorites' | 'recent'>('all');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('kasangkapan-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [recentTools, setRecentTools] = useState<string[]>(() => {
    const saved = localStorage.getItem('kasangkapan-recent');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (e: React.MouseEvent, toolId: string) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId];
    setFavorites(newFavorites);
    localStorage.setItem('kasangkapan-favorites', JSON.stringify(newFavorites));
    toast.success(favorites.includes(toolId) ? 'Removed from favorites' : 'Added to favorites');
  };

  const addToRecent = (toolId: string) => {
    const newRecent = [toolId, ...recentTools.filter(id => id !== toolId)].slice(0, 8);
    setRecentTools(newRecent);
    localStorage.setItem('kasangkapan-recent', JSON.stringify(newRecent));
  };

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCategory = true;
      if (selectedCategory === 'all') matchesCategory = true;
      else if (selectedCategory === 'favorites') matchesCategory = favorites.includes(tool.id);
      else if (selectedCategory === 'recent') matchesCategory = recentTools.includes(tool.id);
      else matchesCategory = tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, favorites, recentTools]);

  const activeTool = useMemo(() => {
    return TOOLS.find(t => t.id === activeToolId);
  }, [activeToolId]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { id: 'all' as const, label: 'All Tools', icon: LayoutGrid },
    { id: 'recent' as const, label: 'Recent', icon: Clock },
    { id: 'favorites' as const, label: 'Favorites', icon: Heart }, 
  ];

  const categories: { id: ToolCategory; name: string; icon: any; color: string; badge: string }[] = [
    { id: 'document', name: 'Document', icon: FileText, color: 'bg-muted text-foreground', badge: 'bg-background border border-border text-muted-foreground' },
    { id: 'image', name: 'Visual', icon: ImageIcon, color: 'bg-muted text-foreground', badge: 'bg-background border border-border text-muted-foreground' },
    { id: 'developer', name: 'Developer', icon: Code, color: 'bg-muted text-foreground', badge: 'bg-background border border-border text-muted-foreground' },
    { id: 'productivity', name: 'Productivity', icon: Clock, color: 'bg-muted text-foreground', badge: 'bg-background border border-border text-muted-foreground' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDark ? 'dark bg-background text-foreground' : 'bg-background text-foreground'}`}>
      <Toaster position="top-center" />
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
        
        {/* Sidebar */}
        <aside className="hidden lg:flex w-[240px] bg-card border-r border-border flex-col p-6 shrink-0 z-10 relative">
          <div 
            className="flex items-center gap-3 mb-10 cursor-pointer" 
            onClick={() => { setActiveToolId(null); setSelectedCategory('all'); }}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-lg">
              <Leaf className="w-5 h-5 drop-shadow-sm" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">Doki Doki</span>
          </div>

          <nav className="space-y-8">
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Navigation</p>
              {navItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => { setSelectedCategory(item.id); setActiveToolId(null); }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${selectedCategory === item.id && !activeToolId ? 'bg-muted text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                >
                  <item.icon className="w-[18px] h-[18px] stroke-[2px]" />
                  {item.label}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Categories</p>
              {categories.map((cat) => (
                <div 
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setActiveToolId(null); }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${selectedCategory === cat.id && !activeToolId ? 'bg-muted text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <header className="h-[72px] bg-card border-b border-border flex items-center justify-between px-4 sm:px-8 shrink-0 z-10 relative gap-4">
            <div className="flex items-center gap-3 w-full max-w-[400px]">
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger render={<Button variant="ghost" size="icon" className="shrink-0 -ml-2" />}>
                    <Menu className="w-5 h-5" />
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px] p-6">
                    <SheetHeaderComponent className="mb-8">
                       <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                       <SheetDescription className="sr-only">Mobile navigation menu</SheetDescription>
                       <div 
                          className="flex items-center gap-3 cursor-pointer" 
                          onClick={() => { setActiveToolId(null); setSelectedCategory('all'); }}
                        >
                          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-lg">
                            <Leaf className="w-5 h-5 drop-shadow-sm" />
                          </div>
                          <span className="font-bold text-xl tracking-tight text-foreground">Doki Doki</span>
                        </div>
                    </SheetHeaderComponent>

                    <nav className="space-y-8">
                      <div className="space-y-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Navigation</p>
                        {navItems.map((item) => (
                          <SheetTrigger key={item.id} render={
                            <div 
                              onClick={() => { setSelectedCategory(item.id); setActiveToolId(null); }}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${selectedCategory === item.id && !activeToolId ? 'bg-muted text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                            />
                          }>
                            <item.icon className="w-[18px] h-[18px] stroke-[2px]" />
                            {item.label}
                          </SheetTrigger>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Categories</p>
                        {categories.map((cat) => (
                           <SheetTrigger key={cat.id} render={
                            <div 
                              onClick={() => { setSelectedCategory(cat.id); setActiveToolId(null); }}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${selectedCategory === cat.id && !activeToolId ? 'bg-muted text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                            />
                           }>
                              {cat.name}
                          </SheetTrigger>
                        ))}
                      </div>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex items-center gap-3 bg-muted px-4 py-2.5 rounded-xl w-full">
                <Search className="w-[18px] h-[18px] text-muted-foreground shrink-0" />
                <input 
                  placeholder='Search tools...' 
                  className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground min-w-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden sm:inline">{isDark ? 'Dark' : 'Light'} Mode</span>
                <div 
                  className={`w-11 h-6 rounded-full relative cursor-pointer p-1 transition-colors shrink-0 ${isDark ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  onClick={toggleTheme}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isDark ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${isDark ? 'dark' : 'light'}`} alt="avatar" />
              </div>
            </div>
          </header>

          {/* Scrolling Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-background">
            <div className="max-w-[1200px] mx-auto">
              <AnimatePresence mode="wait">
                {!activeToolId ? (
                  <motion.div 
                    key="dashboard"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-foreground">Workspace Tools</h1>
                        <p className="text-sm text-muted-foreground">{filteredTools.length} client-side utilities ready for use.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      <AnimatePresence mode="popLayout">
                        {filteredTools.map((tool) => {
                          const categoryInfo = categories.find(c => c.id === tool.category);
                          return (
                            <motion.div
                              key={tool.id}
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="group bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 cursor-pointer transition-all hover:border-primary hover:shadow-sm active:scale-[0.98]"
                              onClick={() => { setActiveToolId(tool.id); addToRecent(tool.id); }}
                            >
                              <div className="flex items-center justify-between">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${categoryInfo?.color || 'bg-muted text-muted-foreground'}`}>
                                  <tool.icon className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className={`h-8 w-8 rounded-full ${favorites.includes(tool.id) ? 'text-foreground bg-muted' : 'text-muted-foreground'}`}
                                    onClick={(e) => toggleFavorite(e, tool.id)}
                                  >
                                    <Heart className={`w-4 h-4 ${favorites.includes(tool.id) ? 'fill-current' : ''}`} />
                                  </Button>
                                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase ${categoryInfo?.badge || 'bg-muted text-muted-foreground'}`}>
                                    {tool.category}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <h3 className="text-base font-semibold text-foreground">{tool.name}</h3>
                                <p className="text-sm text-muted-foreground leading-normal line-clamp-2">{tool.description}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="active-tool"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        onClick={() => setActiveToolId(null)}
                        className="text-muted-foreground hover:text-primary hover:bg-muted gap-2"
                      >
                        <Menu className="w-4 h-4 rotate-90" />
                        Dashboard
                      </Button>
                      <div className="w-[1px] h-6 bg-border" />
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${categories.find(c => c.id === activeTool?.category)?.color}`}>
                          {activeTool && <activeTool.icon className="w-4 h-4" />}
                        </div>
                        <h2 className="text-xl font-bold text-foreground sm:truncate">{activeTool?.name}</h2>
                      </div>
                    </div>
                    
                    <div className="bg-card rounded-2xl border border-border p-4 sm:p-8 shadow-sm">
                      {activeTool && <activeTool.component />}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

