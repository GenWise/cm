import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GoogleDriveButton } from '@/components/common/GoogleDriveButton';
import { 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PLATFORM_SPECS, formatDuration } from '@/lib/platformSpecs';
import type { VideoWithTags } from '@/lib/types';

interface PlatformVersion {
  platform: string;
  video_url?: string;
  drive_file_id?: string;
  uploaded_at?: string;
  file_size?: number;
  duration?: number;
  aspect_ratio?: string;
}

interface PlatformVideoVersionsProps {
  video: VideoWithTags;
  versions?: PlatformVersion[];
  onUpload?: (platform: string) => void;
}

export function PlatformVideoVersions({ 
  video, 
  versions = [],
  onUpload 
}: PlatformVideoVersionsProps) {
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  // Get platforms that penalize YouTube (need native uploads)
  const priorityPlatforms = Object.values(PLATFORM_SPECS).filter(p => p.penalizesYouTube);
  const otherPlatforms = Object.values(PLATFORM_SPECS).filter(p => !p.penalizesYouTube);

  const displayedPlatforms = showAllPlatforms 
    ? [...priorityPlatforms, ...otherPlatforms]
    : priorityPlatforms;

  const getVersionForPlatform = (platformKey: string) => {
    return versions.find(v => v.platform === platformKey);
  };

  const hasVersion = (platformKey: string) => {
    return !!getVersionForPlatform(platformKey);
  };

  const getCompletionPercentage = () => {
    const total = priorityPlatforms.length;
    const completed = priorityPlatforms.filter(p => hasVersion(p.key)).length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="space-y-4">
      {/* Header with Progress */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Platform Video Versions</h3>
          <Badge variant="outline" className="bg-white">
            {priorityPlatforms.filter(p => hasVersion(p.key)).length}/{priorityPlatforms.length}
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getCompletionPercentage()}%` }}
          />
        </div>
        
        <p className="text-xs text-gray-600">
          {getCompletionPercentage() === 100 
            ? '✅ All priority platforms ready!' 
            : '⚠️ Some platforms need native uploads for better reach'}
        </p>
      </Card>

      {/* Platform List */}
      <Card className="divide-y divide-gray-200">
        {displayedPlatforms.map((platform) => {
          const version = getVersionForPlatform(platform.key);
          const isExpanded = expandedPlatform === platform.key;
          const hasUpload = hasVersion(platform.key);

          return (
            <div key={platform.key} className="p-4">
              {/* Platform Header */}
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedPlatform(isExpanded ? null : platform.key)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${platform.color}15` }}
                  >
                    {platform.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{platform.name}</p>
                      {platform.penalizesYouTube && (
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                          Native Upload
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {platform.videoSpecs.aspectRatio[0]} • Max {formatDuration(platform.videoSpecs.maxDuration)} • {platform.videoSpecs.maxFileSize}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {hasUpload ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-300" />
                  )}
                  
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-4 space-y-3">
                  {/* Video Specs */}
                  <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                    <p className="text-xs font-medium text-gray-700">Recommended Specs:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Aspect Ratio:</span>
                        <p className="font-medium">{platform.videoSpecs.aspectRatio.join(', ')}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <p className="font-medium">
                          {platform.videoSpecs.minDuration ? `${formatDuration(platform.videoSpecs.minDuration)}-` : ''}
                          {formatDuration(platform.videoSpecs.maxDuration)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Resolution:</span>
                        <p className="font-medium">{platform.videoSpecs.resolution.join(', ')}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Max Size:</span>
                        <p className="font-medium">{platform.videoSpecs.maxFileSize}</p>
                      </div>
                    </div>
                  </div>

                  {/* Platform Notes */}
                  {platform.notes.length > 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs font-medium text-blue-900 mb-2 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Best Practices:
                      </p>
                      <ul className="text-xs text-blue-800 space-y-1">
                        {platform.notes.map((note, idx) => (
                          <li key={idx}>• {note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Version Status */}
                  {hasUpload && version ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
                      <p className="text-xs font-medium text-green-900 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Version Uploaded
                      </p>
                      {version.uploaded_at && (
                        <p className="text-xs text-green-700">
                          Uploaded: {new Date(version.uploaded_at).toLocaleDateString()}
                        </p>
                      )}
                      {version.video_url && (
                        <GoogleDriveButton
                          fileIdOrUrl={version.video_url}
                          size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          Open in Google Drive
                        </GoogleDriveButton>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-xs text-orange-800 mb-2">
                        {platform.penalizesYouTube 
                          ? '⚠️ This platform penalizes YouTube links. Upload native video for better reach.' 
                          : 'No platform-specific version uploaded yet.'}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => onUpload?.(platform.key)}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload {platform.name} Version
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </Card>

      {/* Show All Platforms Toggle */}
      {!showAllPlatforms && otherPlatforms.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setShowAllPlatforms(true)}
        >
          Show {otherPlatforms.length} More Platform{otherPlatforms.length !== 1 ? 's' : ''} (YouTube, etc.)
        </Button>
      )}

      {/* Info Card */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-yellow-800">
            <p className="font-medium mb-1">Why multiple versions?</p>
            <p>
              Platforms like Facebook, LinkedIn, and Instagram penalize posts with YouTube links. 
              Native video uploads get <strong>5-10x better reach</strong> and engagement. 
              Keep optimized versions for each platform in Google Drive.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
