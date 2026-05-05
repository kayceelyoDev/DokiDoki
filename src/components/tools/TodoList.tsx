import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('dokidoki-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    localStorage.setItem('dokidoki-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([{ id: crypto.randomUUID(), text: newTodo.trim(), completed: false }, ...todos]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <form onSubmit={addTodo} className="flex gap-2">
        <Input 
          placeholder="What needs to be done?" 
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-1"
        />
        <Button onClick={() => addTodo()} disabled={!newTodo.trim()}>
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </form>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
            >
              <Card className={`group ${todo.completed ? 'opacity-50' : ''}`}>
                <CardContent className="p-3 flex items-center gap-3">
                  <Checkbox 
                    id={todo.id} 
                    checked={todo.completed} 
                    onCheckedChange={() => toggleTodo(todo.id)} 
                  />
                  <label 
                    htmlFor={todo.id}
                    className={`flex-1 text-sm cursor-pointer ${todo.completed ? 'line-through' : ''}`}
                  >
                    {todo.text}
                  </label>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeTodo(todo.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {todos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground italic">
            Your to-do list is empty. Add something above!
          </div>
        )}
      </div>
    </div>
  );
}
