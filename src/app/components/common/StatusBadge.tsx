import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
      case 'idea':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
      case 'editing':
      case 'ready':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'review':
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'published':
      case 'posted':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'failed':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  return (
    <Badge className={cn(getStatusColor(status), className)}>
      {status}
    </Badge>
  );
}
