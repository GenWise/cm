import { Link } from '@/components/ui/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TagList } from '@/components/common/TagBadge';
import { GoogleDriveBadge } from '@/components/common/GoogleDriveButton';
import { Video as VideoIcon, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { VideoWithTags } from '@/lib/types';

interface VideoCardProps {
  video: VideoWithTags & { program?: { name: string; color?: string }; clips?: any[] };
  viewMode?: 'grid' | 'list';
}

export function VideoCard({ video, viewMode = 'grid' }: VideoCardProps) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const clipCount = video.clips?.length || 0;

  if (viewMode === 'list') {
    return (
      <Link to={`/videos/${video.id}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex flex-col sm:flex-row gap-4 p-4">
            {/* Thumbnail */}
            <div className="relative w-full sm:w-48 aspect-video bg-gray-100 flex items-center justify-center rounded flex-shrink-0">
              {video.thumbnail_url ? (
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title}
                  className="w-full h-full object-cover rounded"
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
              {video.raw_video_url && (
                <div className="absolute top-2 right-2">
                  <GoogleDriveBadge url={video.raw_video_url} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {video.title}
                </h3>
                {video.subject_name && (
                  <p className="text-sm text-gray-600">
                    {video.subject_name}
                    {video.subject_role && ` • ${video.subject_role}`}
                    {video.subject_org && ` • ${video.subject_org}`}
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
                <span className="text-xs text-gray-500">
                  {clipCount} clip{clipCount !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Tags */}
              <TagList video={video} limit={5} />

              {video.created_at && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(video.created_at), 'MMM d, yyyy')}
                </div>
              )}
            </div>
          </div>
        </Card>
      </Link>
    );
  }

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
          {video.raw_video_url && (
            <div className="absolute top-2 right-2">
              <GoogleDriveBadge url={video.raw_video_url} />
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

          {/* Tags */}
          <TagList video={video} limit={3} />

          <div className="text-xs text-gray-500">
            {clipCount} clip{clipCount !== 1 ? 's' : ''}
          </div>
        </div>
      </Card>
    </Link>
  );
}