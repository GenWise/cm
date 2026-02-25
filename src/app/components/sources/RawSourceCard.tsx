import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileSpreadsheet,
  Video,
  MessageSquare,
  Mail,
  ClipboardList,
  Share2,
  MoreHorizontal,
  ExternalLink,
  Calendar,
  User,
  Quote
} from 'lucide-react';
import { format } from 'date-fns';
import type { RawSourceWithProgram, RawSourceType, RawSourceStatus } from '@/lib/types';

interface RawSourceCardProps {
  source: RawSourceWithProgram;
  viewMode?: 'grid' | 'list';
  onEdit?: (source: RawSourceWithProgram) => void;
}

const sourceTypeConfig: Record<RawSourceType, { icon: typeof FileSpreadsheet; label: string; color: string }> = {
  feedback_sheet: { icon: FileSpreadsheet, label: 'Feedback Sheet', color: 'bg-green-100 text-green-800' },
  video_recording: { icon: Video, label: 'Video Recording', color: 'bg-blue-100 text-blue-800' },
  session_recording: { icon: Video, label: 'Session Recording', color: 'bg-purple-100 text-purple-800' },
  whatsapp_message: { icon: MessageSquare, label: 'WhatsApp', color: 'bg-emerald-100 text-emerald-800' },
  email_thread: { icon: Mail, label: 'Email', color: 'bg-orange-100 text-orange-800' },
  survey_response: { icon: ClipboardList, label: 'Survey', color: 'bg-yellow-100 text-yellow-800' },
  social_media: { icon: Share2, label: 'Social Media', color: 'bg-pink-100 text-pink-800' },
  other: { icon: MoreHorizontal, label: 'Other', color: 'bg-gray-100 text-gray-800' },
};

const statusConfig: Record<RawSourceStatus, { label: string; color: string }> = {
  raw: { label: 'Raw', color: 'bg-gray-100 text-gray-700' },
  reviewing: { label: 'Reviewing', color: 'bg-yellow-100 text-yellow-800' },
  curated: { label: 'Curated', color: 'bg-blue-100 text-blue-800' },
  published: { label: 'Published', color: 'bg-green-100 text-green-800' },
  archived: { label: 'Archived', color: 'bg-gray-200 text-gray-600' },
};

export function RawSourceCard({ source, viewMode = 'grid', onEdit }: RawSourceCardProps) {
  const typeConfig = sourceTypeConfig[source.source_type];
  const StatusIcon = typeConfig.icon;
  const status = statusConfig[source.status];

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          {/* Icon/Type indicator */}
          <div className={`w-full sm:w-24 h-24 rounded-lg flex items-center justify-center flex-shrink-0 ${typeConfig.color}`}>
            <StatusIcon className="w-10 h-10" />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg">{source.title}</h3>
                {source.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{source.description}</p>
                )}
              </div>
              {source.source_url && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={source.source_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={typeConfig.color}>{typeConfig.label}</Badge>
              <Badge className={status.color}>{status.label}</Badge>
              {source.program && (
                <Badge
                  style={{ backgroundColor: source.program.color || '#6366f1' }}
                  className="text-white text-xs"
                >
                  {source.program.name}
                </Badge>
              )}
              {source.testimonial_count > 0 && (
                <Badge variant="outline" className="gap-1">
                  <Quote className="w-3 h-3" />
                  {source.testimonial_count} quotes
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              {source.date_collected && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(source.date_collected), 'MMM d, yyyy')}
                </span>
              )}
              {source.collected_by && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {source.collected_by}
                </span>
              )}
            </div>

            {/* Tags */}
            {source.tags && source.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {source.tags.slice(0, 5).map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {source.tags.length > 5 && (
                  <Badge variant="secondary" className="text-xs">+{source.tags.length - 5}</Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onEdit?.(source)}>
      {/* Header with type icon */}
      <div className={`h-24 flex items-center justify-center ${typeConfig.color}`}>
        <StatusIcon className="w-12 h-12" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-sm line-clamp-2">{source.title}</h3>
          {source.description && (
            <p className="text-xs text-gray-600 line-clamp-2 mt-1">{source.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={`${typeConfig.color} text-xs`}>{typeConfig.label}</Badge>
          <Badge className={`${status.color} text-xs`}>{status.label}</Badge>
        </div>

        {source.program && (
          <Badge
            style={{ backgroundColor: source.program.color || '#6366f1' }}
            className="text-white text-xs"
          >
            {source.program.name}
          </Badge>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          {source.testimonial_count > 0 ? (
            <span className="flex items-center gap-1">
              <Quote className="w-3 h-3" />
              {source.testimonial_count} quotes
            </span>
          ) : (
            <span></span>
          )}
          {source.source_url && (
            <Button variant="ghost" size="sm" className="h-6 px-2" asChild onClick={(e) => e.stopPropagation()}>
              <a href={source.source_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          )}
        </div>

        {source.date_collected && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            {format(new Date(source.date_collected), 'MMM d, yyyy')}
          </div>
        )}
      </div>
    </Card>
  );
}

export function RawSourceTypeBadge({ type }: { type: RawSourceType }) {
  const config = sourceTypeConfig[type];
  const Icon = config.icon;
  return (
    <Badge className={config.color}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}

export function RawSourceStatusBadge({ status }: { status: RawSourceStatus }) {
  const config = statusConfig[status];
  return <Badge className={config.color}>{config.label}</Badge>;
}
