import { Card } from '@/components/ui/card';
import { PlatformIcon } from '@/components/common/PlatformIcon';
import { Eye, Heart, MessageCircle, Share2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { ContentPost } from '@/lib/types';
import { cn } from '@/components/ui/utils';

interface PostCardProps {
  post: ContentPost;
  onClick?: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-4 border-l-red-500';
      case 'high': return 'border-l-4 border-l-orange-500';
      default: return '';
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      return format(new Date(dateStr), 'MMM d');
    } catch {
      return dateStr;
    }
  };

  return (
    <Card 
      className={cn(
        "p-3 cursor-pointer hover:shadow-md transition-shadow",
        getPriorityColor(post.priority)
      )}
      onClick={onClick}
    >
      {/* Platform icon */}
      <div className="flex items-start justify-between mb-2">
        <PlatformIcon platform={post.platform} size={20} />
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium line-clamp-2 mb-2">
        {post.title || post.caption?.substring(0, 50) + '...' || 'Untitled Post'}
      </h4>

      {/* Date */}
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
        <Calendar className="w-3 h-3" />
        {post.posted_at ? (
          <span>✓ {formatDate(post.posted_at)}</span>
        ) : post.target_date ? (
          <span>{formatDate(post.target_date)}</span>
        ) : (
          <span>No date</span>
        )}
      </div>

      {/* Engagement metrics (if posted) */}
      {post.status === 'posted' && (
        <div className="flex items-center gap-3 text-xs text-gray-600 pt-2 border-t">
          {post.views ? (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.views}
            </span>
          ) : null}
          {post.likes ? (
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {post.likes}
            </span>
          ) : null}
          {post.comments ? (
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {post.comments}
            </span>
          ) : null}
        </div>
      )}
    </Card>
  );
}
