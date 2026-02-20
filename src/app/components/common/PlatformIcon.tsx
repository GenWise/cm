import { Youtube, Linkedin, MessageCircle, Instagram, Twitter } from 'lucide-react';
import { cn } from '@/components/ui/utils';

interface PlatformIconProps {
  platform: 'youtube' | 'linkedin' | 'whatsapp' | 'instagram' | 'twitter';
  className?: string;
  size?: number;
}

export function PlatformIcon({ platform, className, size = 16 }: PlatformIconProps) {
  const iconProps = { className: cn(className), style: { width: size, height: size } };

  switch (platform) {
    case 'youtube':
      return <Youtube {...iconProps} className={cn(iconProps.className, 'text-red-600')} />;
    case 'linkedin':
      return <Linkedin {...iconProps} className={cn(iconProps.className, 'text-blue-700')} />;
    case 'whatsapp':
      return <MessageCircle {...iconProps} className={cn(iconProps.className, 'text-green-600')} />;
    case 'instagram':
      return <Instagram {...iconProps} className={cn(iconProps.className, 'text-pink-600')} />;
    case 'twitter':
      return <Twitter {...iconProps} className={cn(iconProps.className, 'text-sky-500')} />;
    default:
      return null;
  }
}

export function getPlatformColor(platform: string): string {
  switch (platform) {
    case 'youtube': return 'bg-red-50 text-red-700 border-red-200';
    case 'linkedin': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'whatsapp': return 'bg-green-50 text-green-700 border-green-200';
    case 'instagram': return 'bg-pink-50 text-pink-700 border-pink-200';
    case 'twitter': return 'bg-sky-50 text-sky-700 border-sky-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}
