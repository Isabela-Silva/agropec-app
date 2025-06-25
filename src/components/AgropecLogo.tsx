import agropecLogo from '../assets/logo_agropec.webp';
import { cn } from '../utils/cn';

interface AgropecLogoProps {
  className?: string;
}

export function AgropecLogo({ className }: AgropecLogoProps) {
  return <img src={agropecLogo} alt="Logo Agropec" className={cn('w-full max-w-xs object-contain', className)} />;
}
