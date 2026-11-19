import { useId, type ReactNode } from 'react';

type A11yProps = { 
  id: string; 
  'aria-invalid': boolean; 
  'aria-describedby'?: string; 
  'aria-required'?: boolean 
};

export function Field({ label, error, hint, required, children }: {
  label: string; 
  error?: string; 
  hint?: string; 
  required?: boolean;
  children: (props: A11yProps) => ReactNode;
}) {
  const id = useId();
  const msgId = `${id}-msg`;
  
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-900">
        {label}{required && <span aria-hidden="true" className="text-red-600"> *</span>}
      </label>
      
      {children({ 
        id, 
        'aria-invalid': !!error, 
        'aria-describedby': error || hint ? msgId : undefined, 
        'aria-required': required 
      })}
      
      {error
        ? <p id={msgId} className="text-sm text-red-600">{error}</p>
        : hint && <p id={msgId} className="text-sm text-slate-500">{hint}</p>}
    </div>
  );
}