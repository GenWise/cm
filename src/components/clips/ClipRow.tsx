import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Edit, Trash2 } from 'lucide-react';
import type { Clip } from '@/lib/types';

interface ClipRowProps {
  clip: Clip;
  onPlay?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showVideo?: boolean;
  videoTitle?: string;
}

export function ClipRow({ 
  clip, 
  onPlay, 
  onEdit, 
  onDelete,
  showVideo,
  videoTitle 
}: ClipRowProps) {
  const tags = clip.tags ? JSON.parse(clip.tags) : [];

  return (
    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
      {/* Play button */}
      <Button
        variant="ghost"
        size="icon"
        className="flex-shrink-0 mt-1"
        onClick={(e) => {
          e.stopPropagation();
          onPlay?.();
        }}
      >
        <Play className="w-4 h-4" />
      </Button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <span className="font-mono">{clip.start_time} - {clip.end_time}</span>
              {showVideo && videoTitle && (
                <>
                  <span>•</span>
                  <span className="truncate">{videoTitle}</span>
                </>
              )}
            </div>
            
            {clip.title && (
              <h4 className="font-medium text-sm mb-1">{clip.title}</h4>
            )}
            
            <p className="text-sm text-gray-700 mb-2">{clip.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {tags.map((tag: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs"
                >
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Transcript snippet if available */}
            {clip.transcript_snippet && (
              <p className="text-xs text-gray-500 mt-2 italic line-clamp-2">
                "{clip.transcript_snippet}"
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
