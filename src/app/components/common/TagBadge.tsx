import { Badge } from '@/components/ui/badge';
import { Tag, Layers } from 'lucide-react';
import type { VideoWithTags } from '@/lib/types';
import { getTagSource } from '@/lib/tagUtils';

interface TagBadgeProps {
  tag: string;
  video?: VideoWithTags;
  showSource?: boolean;
  variant?: 'default' | 'secondary' | 'outline';
}

export function TagBadge({ tag, video, showSource = false, variant = 'secondary' }: TagBadgeProps) {
  const source = video ? getTagSource(tag, video) : null;
  
  const getVariantClass = () => {
    if (!showSource || !source) return '';
    
    switch (source) {
      case 'manual':
        return 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100';
      case 'clips':
        return 'border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100';
      case 'both':
        return 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100';
      default:
        return '';
    }
  };
  
  const getIcon = () => {
    if (!showSource || !source) return <Tag className="w-3 h-3" />;
    
    switch (source) {
      case 'manual':
        return <Tag className="w-3 h-3" />;
      case 'clips':
        return <Layers className="w-3 h-3" />;
      case 'both':
        return <Tag className="w-3 h-3" />;
      default:
        return <Tag className="w-3 h-3" />;
    }
  };
  
  const getTooltip = () => {
    if (!showSource || !source) return tag;
    
    switch (source) {
      case 'manual':
        return `${tag} (Manual tag)`;
      case 'clips':
        return `${tag} (From clips)`;
      case 'both':
        return `${tag} (Manual + Clips)`;
      default:
        return tag;
    }
  };
  
  return (
    <Badge 
      variant={variant}
      className={`gap-1 ${getVariantClass()}`}
      title={getTooltip()}
    >
      {getIcon()}
      {tag}
    </Badge>
  );
}

interface TagListProps {
  video: VideoWithTags;
  limit?: number;
  showSource?: boolean;
}

export function TagList({ video, limit, showSource = false }: TagListProps) {
  const displayTags = limit ? video.all_tags.slice(0, limit) : video.all_tags;
  const remainingCount = limit && video.all_tags.length > limit 
    ? video.all_tags.length - limit 
    : 0;
  
  if (video.all_tags.length === 0) {
    return <span className="text-sm text-gray-400">No tags</span>;
  }
  
  return (
    <div className="flex flex-wrap gap-1.5">
      {displayTags.map((tag, index) => (
        <TagBadge 
          key={`${tag}-${index}`} 
          tag={tag} 
          video={video}
          showSource={showSource}
        />
      ))}
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-gray-500">
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
}

interface TagStatsProps {
  video: VideoWithTags;
}

export function TagStats({ video }: TagStatsProps) {
  const hasManualTags = video.manual_tags.length > 0;
  const hasClipTags = video.clip_tags.length > 0;
  
  return (
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <div className="flex items-center gap-1.5">
        <Tag className="w-4 h-4" />
        <span className="font-medium">{video.all_tags.length}</span>
        <span>total tags</span>
      </div>
      
      {hasManualTags && (
        <div className="flex items-center gap-1.5 text-blue-600">
          <span className="font-medium">{video.manual_tags.length}</span>
          <span>manual</span>
        </div>
      )}
      
      {hasClipTags && (
        <div className="flex items-center gap-1.5 text-purple-600">
          <Layers className="w-4 h-4" />
          <span className="font-medium">{video.clip_tags.length}</span>
          <span>from clips</span>
        </div>
      )}
    </div>
  );
}
