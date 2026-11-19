'use client';
import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/form-controls';
import { X } from 'lucide-react';

export function TagInput({ value, onChange, error }: { value: string[], onChange: (tags: string[]) => void, error?: boolean }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = input.trim();
      if (newTag && !value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a tag and press Enter..."
        aria-invalid={error}
      />
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-foreground/[0.05] px-2 py-1 text-sm text-foreground">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-muted hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}