import { Eye, EyeOff } from 'lucide-react';
import { useState, type InputHTMLAttributes } from 'react';

import { cn } from '../../utils/cn';
import { Button } from './button';
import { Input } from './input';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input type={showPassword ? 'text' : 'password'} className={cn('pr-10', className)} {...props} />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff className="h-4 w-4 text-base-black" /> : <Eye className="h-4 w-4 text-base-black" />}
        <span className="sr-only">{showPassword ? 'Ocultar senha' : 'Mostrar senha'}</span>
      </Button>
    </div>
  );
}
