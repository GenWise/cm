import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { PLATFORM_SPECS } from '@/lib/platformSpecs';
import type { VideoWithTags } from '@/lib/types';

interface PlatformVersion {
  platform: string;
  video_url?: string;
  uploaded_at?: string;
}

interface PlatformVersionsMatrixProps {
  video: VideoWithTags;
  versions?: PlatformVersion[];
  onUpload?: (platform: string) => void;
  onView?: (platform: string, url: string) => void;
}

export function PlatformVersionsMatrix({ 
  video, 
  versions = [],
  onUpload,
  onView 
}: PlatformVersionsMatrixProps) {
  const platforms = Object.values(PLATFORM_SPECS);
  
  const getVersionForPlatform = (platformKey: string) => {
    return versions.find(v => v.platform === platformKey);
  };

  const hasVersion = (platformKey: string) => {
    return !!getVersionForPlatform(platformKey);
  };

  const getCellStatus = (platformKey: string) => {
    const platform = PLATFORM_SPECS[platformKey];
    const hasUpload = hasVersion(platformKey);
    
    if (hasUpload) {
      return { status: 'complete', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Ready' };
    } else if (platform.penalizesYouTube) {
      return { status: 'warning', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Needed' };
    } else {
      return { status: 'optional', icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-50', label: 'Optional' };
    }
  };

  const stats = {
    total: platforms.length,
    complete: platforms.filter(p => hasVersion(p.key)).length,
    needed: platforms.filter(p => p.penalizesYouTube && !hasVersion(p.key)).length,
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Platform Coverage</h3>
            <p className="text-sm text-gray-600">
              {stats.complete} of {stats.total} platforms ready
              {stats.needed > 0 && (
                <span className="text-orange-600 font-medium"> • {stats.needed} need attention</span>
              )}
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
              <span className="text-gray-600">Ready</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-orange-600" />
              <span className="text-gray-600">Needed</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600">Optional</span>
            </div>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {platforms.map((platform) => {
            const version = getVersionForPlatform(platform.key);
            const cellStatus = getCellStatus(platform.key);
            const StatusIcon = cellStatus.icon;

            return (
              <div
                key={platform.key}
                className={`${cellStatus.bg} border rounded-lg p-3 transition-all hover:shadow-md cursor-pointer ${
                  version ? 'border-green-300' : platform.penalizesYouTube ? 'border-orange-200' : 'border-gray-200'
                }`}
                onClick={() => {
                  if (version?.video_url) {
                    onView?.(platform.key, version.video_url);
                  } else {
                    onUpload?.(platform.key);
                  }
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-2xl">{platform.icon}</div>
                  <StatusIcon className={`w-4 h-4 ${cellStatus.color}`} />
                </div>
                
                <p className="font-medium text-sm mb-1">{platform.name}</p>
                
                <div className="flex items-center gap-1 mb-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${cellStatus.color} border-current`}
                  >
                    {cellStatus.label}
                  </Badge>
                  {platform.penalizesYouTube && (
                    <Badge variant="outline" className="text-xs bg-white">
                      Native
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-gray-600">
                  {platform.videoSpecs.aspectRatio[0]}
                </p>

                {version && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      {version.uploaded_at ? new Date(version.uploaded_at).toLocaleDateString() : 'Uploaded'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        {stats.needed > 0 && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <p className="text-sm font-medium text-orange-900">
                  {stats.needed} platform{stats.needed !== 1 ? 's' : ''} need native uploads
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => window.open('https://drive.google.com/drive/my-drive', '_blank')}>
                Upload to Drive
              </Button>
            </div>
            <p className="text-xs text-orange-700 mt-2 ml-6">
              Native uploads get 5-10x better reach than YouTube links on these platforms
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs space-y-1.5">
          <p className="font-medium text-blue-900">Platform Notes:</p>
          <p className="text-blue-800">
            <strong>Native Required:</strong> Facebook, LinkedIn, Instagram strongly penalize external video links
          </p>
          <p className="text-blue-800">
            <strong>YouTube Friendly:</strong> YouTube, WhatsApp don't penalize external links
          </p>
          <p className="text-blue-800">
            <strong>Tip:</strong> Store all platform-specific versions in Google Drive with clear naming
          </p>
        </div>
      </div>
    </Card>
  );
}
