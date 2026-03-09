import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GoogleDriveButton } from '@/components/common/GoogleDriveButton';
import {
  Video,
  FileVideo,
  Scissors,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import type { VideoWithTags } from '@/lib/types';
import { getDrivePreviewUrl, isGoogleDriveUrl } from '@/lib/googleDrive';
import type { VideoStage } from '@/pages/VideoDetail';

interface RawVideoSidebarProps {
  video: VideoWithTags;
  activeStage: VideoStage;
  onStageChange: (stage: VideoStage) => void;
}

export function RawVideoSidebar({ video, activeStage, onStageChange }: RawVideoSidebarProps) {
  const activeTab = activeStage;
  const setActiveTab = onStageChange;

  // Determine video editing status
  const hasRaw = !!video.raw_video_url;
  const hasPortrait = !!video.portrait_video_url;
  const hasLandscape = !!video.landscape_video_url;

  const getStatusIcon = (step: 'raw' | 'portrait' | 'landscape') => {
    switch (step) {
      case 'raw':
        return hasRaw ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-gray-400" />;
      case 'portrait':
        return hasPortrait ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Clock className="w-4 h-4 text-gray-400" />;
      case 'landscape':
        return hasLandscape ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (step: 'raw' | 'portrait' | 'landscape') => {
    switch (step) {
      case 'raw':
        return hasRaw ? 'Available' : 'Not uploaded';
      case 'portrait':
        return hasPortrait ? 'Available' : 'Pending';
      case 'landscape':
        return hasLandscape ? 'Available' : 'Pending';
    }
  };

  return (
    <div className="space-y-4">
      {/* Video Pipeline Status */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-3">Video Pipeline</h3>
        
        <div className="space-y-2">
          {/* Raw Video */}
          <button
            onClick={() => setActiveTab('raw')}
            className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
              activeTab === 'raw' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                hasRaw ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <FileVideo className={`w-4 h-4 ${hasRaw ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Raw Video</p>
                <p className="text-xs text-gray-500">{getStatusText('raw')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon('raw')}
              <ChevronRight className={`w-4 h-4 ${activeTab === 'raw' ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
          </button>

          {/* Portrait Video */}
          <button
            onClick={() => setActiveTab('portrait')}
            className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
              activeTab === 'portrait'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                hasPortrait ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                <Scissors className={`w-4 h-4 ${hasPortrait ? 'text-purple-600' : 'text-gray-400'}`} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Portrait (9:16)</p>
                <p className="text-xs text-gray-500">{getStatusText('portrait')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon('portrait')}
              <ChevronRight className={`w-4 h-4 ${activeTab === 'portrait' ? 'text-purple-600' : 'text-gray-400'}`} />
            </div>
          </button>

          {/* Landscape Video */}
          <button
            onClick={() => setActiveTab('landscape')}
            className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
              activeTab === 'landscape'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                hasLandscape ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Video className={`w-4 h-4 ${hasLandscape ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Landscape (16:9)</p>
                <p className="text-xs text-gray-500">{getStatusText('landscape')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon('landscape')}
              <ChevronRight className={`w-4 h-4 ${activeTab === 'landscape' ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
          </button>
        </div>
      </Card>

      {/* Video Details */}
      <Card className="p-4">
        {activeTab === 'raw' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <FileVideo className="w-4 h-4 text-blue-600" />
                Raw Video
              </h4>
              {hasRaw && isGoogleDriveUrl(video.raw_video_url!) && (
                <Badge variant="outline" className="text-xs gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.5 2.5l-6 10.5h4.5l6-10.5h-4.5zm7.5 0l6 10.5h-4.5l-6-10.5h4.5zm-11 12l3 5.5 6-10.5h-4.5l-4.5 7.5zm16 0h-9l-3 5.5h9l3-5.5z"/>
                  </svg>
                  Drive
                </Badge>
              )}
            </div>

            {hasRaw ? (
              <>
                <div className="text-xs text-gray-600">
                  <p className="mb-1">Source footage uploaded to Google Drive. This is your unedited recording.</p>
                </div>

                <div className="space-y-2">
                  <GoogleDriveButton
                    fileIdOrUrl={video.raw_video_url}
                    variant="default"
                    size="sm"
                    className="w-full"
                  >
                    Open in Google Drive
                  </GoogleDriveButton>

                  {video.raw_video_drive_id && (
                    <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded border">
                      ID: {video.raw_video_drive_id}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t space-y-2">
                  <p className="text-xs font-medium text-gray-700">Typical uses:</p>
                  <ul className="text-xs text-gray-600 space-y-1 ml-3">
                    <li>• Reference for editors</li>
                    <li>• Creating clips</li>
                    <li>• Backup copy</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <FileVideo className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs mb-3">No raw video uploaded yet</p>
                <Button size="sm" variant="outline">
                  Upload to Drive
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'portrait' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Scissors className="w-4 h-4 text-purple-600" />
                Portrait Video (9:16)
              </h4>
              {hasPortrait && isGoogleDriveUrl(video.portrait_video_url!) && (
                <Badge variant="outline" className="text-xs gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.5 2.5l-6 10.5h4.5l6-10.5h-4.5zm7.5 0l6 10.5h-4.5l-6-10.5h4.5zm-11 12l3 5.5 6-10.5h-4.5l-4.5 7.5zm16 0h-9l-3 5.5h9l3-5.5z"/>
                  </svg>
                  Drive
                </Badge>
              )}
            </div>

            {hasPortrait ? (
              <>
                <div className="text-xs text-gray-600">
                  <p className="mb-1">Vertical format for WhatsApp, Reels, and Shorts.</p>
                </div>
                <div className="space-y-2">
                  <GoogleDriveButton
                    fileIdOrUrl={video.portrait_video_url}
                    variant="default"
                    size="sm"
                    className="w-full"
                  >
                    Open in Google Drive
                  </GoogleDriveButton>
                </div>
                <div className="pt-3 border-t space-y-2">
                  <p className="text-xs font-medium text-gray-700">Platforms:</p>
                  <ul className="text-xs text-gray-600 space-y-1 ml-3">
                    <li>• WhatsApp</li>
                    <li>• Instagram Reels</li>
                    <li>• YouTube Shorts</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <Scissors className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs mb-3">Portrait version not yet generated</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'landscape' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Video className="w-4 h-4 text-green-600" />
                Landscape Video (16:9)
              </h4>
              {hasLandscape && (
                <Badge className="bg-green-100 text-green-700 text-xs">
                  Available
                </Badge>
              )}
            </div>

            {hasLandscape ? (
              <>
                <div className="text-xs text-gray-600">
                  <p className="mb-1">Widescreen format for YouTube, LinkedIn, and website embedding.</p>
                </div>
                <div className="space-y-2">
                  {isGoogleDriveUrl(video.landscape_video_url!) ? (
                    <GoogleDriveButton
                      fileIdOrUrl={video.landscape_video_url}
                      variant="default"
                      size="sm"
                      className="w-full"
                    >
                      Open in Google Drive
                    </GoogleDriveButton>
                  ) : (
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full"
                      onClick={() => window.open(video.landscape_video_url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Landscape Video
                    </Button>
                  )}
                </div>
                <div className="pt-3 border-t space-y-2">
                  <p className="text-xs font-medium text-gray-700">Platforms:</p>
                  <ul className="text-xs text-gray-600 space-y-1 ml-3">
                    <li>• YouTube</li>
                    <li>• LinkedIn</li>
                    <li>• Website</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs mb-3">Final version not ready</p>
                <Button size="sm" variant="outline">
                  Upload Final Version
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-4">
        <h4 className="font-semibold text-sm mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Scissors className="w-4 h-4 mr-2" />
            Create Clips from Raw
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Drive Folder
          </Button>
        </div>
      </Card>
    </div>
  );
}
