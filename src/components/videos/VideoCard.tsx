import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Video as VideoIcon, Clock } from 'lucide-react';
import type { Video } from '@/lib/types';

interface VideoCardProps {
  video: Video & { program?: { name: string; color?: string } };
}

export function VideoCard({ video }: VideoCardProps) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const clipCount = 0; // Will be populated from actual data

  return (
    <Link to={`/videos/${video.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
          {video.thumbnail_url ? (
            <img 
              src={video.thumbnail_url} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <VideoIcon className="w-12 h-12 text-gray-400" />
          )}
          {video.duration_seconds && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(video.duration_seconds)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">
              {video.title}
            </h3>
            {video.subject_name && (
              <p className="text-xs text-gray-600">
                {video.subject_name}
                {video.subject_role && ` • ${video.subject_role}`}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {video.program && (
              <Badge 
                style={{ backgroundColor: video.program.color || '#6366f1' }}
                className="text-white text-xs"
              >
                {video.program.name}
              </Badge>
            )}
            <StatusBadge status={video.status || 'draft'} />
          </div>

          <div className="text-xs text-gray-500">
            {clipCount} clip{clipCount !== 1 ? 's' : ''}
          </div>
        </div>
      </Card>
    </Link>
  );
}
