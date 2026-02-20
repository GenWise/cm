import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Link } from '@/components/ui/link';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TagList, TagStats } from '@/components/common/TagBadge';
import { GoogleDriveButton, GoogleDriveBadge } from '@/components/common/GoogleDriveButton';
import { RawVideoSidebar } from '@/components/videos/RawVideoSidebar';
import { PlatformVersionsMatrix } from '@/components/videos/PlatformVersionsMatrix';
import { ClipRow } from '@/components/clips/ClipRow';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Edit, Plus, ExternalLink, FileText, Image, Info, FolderOpen } from 'lucide-react';
import { videosApi } from '@/lib/api';
import { getDrivePreviewUrl, isGoogleDriveUrl } from '@/lib/googleDrive';
import { format } from 'date-fns';

export type VideoStage = 'raw' | 'edited' | 'final';

export function VideoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeStage, setActiveStage] = useState<VideoStage>('final');

  const { data: video, isLoading } = useQuery({
    queryKey: ['video', id],
    queryFn: () => videosApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-video" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Video not found</h2>
        <Button onClick={() => navigate('/videos')}>Back to Videos</Button>
      </div>
    );
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/videos')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{video.title}</h1>
            {video.subject_name && (
              <p className="text-gray-600 mt-1">
                {video.subject_name}
                {video.subject_role && ` • ${video.subject_role}`}
              </p>
            )}
          </div>
        </div>
        <Button size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Main Content - Now with sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Raw Video Pipeline */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <RawVideoSidebar video={video} activeStage={activeStage} onStageChange={setActiveStage} />
        </div>

        {/* Center: Video Player and Content */}
        <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
          <Card className="overflow-hidden">
            {/* Google Drive indicator */}
            {video.raw_video_url && isGoogleDriveUrl(video.raw_video_url) && (
              <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GoogleDriveBadge url={video.raw_video_url} />
                  <span className="text-xs text-blue-700">Raw Video</span>
                </div>
                <GoogleDriveButton 
                  fileIdOrUrl={video.raw_video_url} 
                  size="sm"
                  variant="ghost"
                >
                  Open in Drive
                </GoogleDriveButton>
              </div>
            )}
            
            <div className="aspect-video bg-gray-900 flex items-center justify-center text-white">
              {(() => {
                // Get the URL for the active stage
                const stageUrl = activeStage === 'final' ? video.final_video_url
                  : activeStage === 'edited' ? video.edited_video_url
                  : video.raw_video_url;

                // For final stage, prefer YouTube embed if available
                if (activeStage === 'final' && video.youtube_url) {
                  return (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtube_id || video.youtube_url.split('v=')[1]?.split('&')[0]}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }

                // Show Drive preview if URL exists
                if (stageUrl) {
                  return (
                    <iframe
                      src={getDrivePreviewUrl(stageUrl)}
                      className="w-full h-full"
                      allow="autoplay"
                    />
                  );
                }

                // No URL available for this stage
                return (
                  <div className="text-center">
                    <p className="text-lg mb-2">No {activeStage} video URL available</p>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Add Video URL
                    </Button>
                  </div>
                );
              })()}
            </div>
          </Card>

          {/* Clips Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Clips ({video.clips?.length || 0})
              </h2>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Clip
              </Button>
            </div>

            {video.clips && video.clips.length > 0 ? (
              <div className="space-y-3">
                {video.clips.map((clip: any) => (
                  <ClipRow
                    key={clip.id}
                    clip={clip}
                    onPlay={() => {
                      console.log('Seek to', clip.start_time);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No clips yet</p>
                <Button variant="outline" size="sm" className="mt-3">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Clip
                </Button>
              </div>
            )}
          </Card>

          {/* Posts Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Posts ({video.posts?.length || 0})
              </h2>
              <Button size="sm" asChild>
                <Link to={`/posts/new?video=${video.id}`}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Link>
              </Button>
            </div>

            {video.posts && video.posts.length > 0 ? (
              <div className="space-y-3">
                {video.posts.map((post: any) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {post.platform} • {post.status}
                      </p>
                      <p className="text-xs text-gray-500">{post.title}</p>
                    </div>
                    {post.platform_url && (
                      <Button variant="ghost" size="icon" asChild>
                        <a
                          href={post.platform_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No posts created from this video yet</p>
              </div>
            )}
          </Card>

          {/* Platform Versions Section - NEW */}
          <PlatformVersionsMatrix
            video={video}
            versions={[]}
            onUpload={(platform) => {
              console.log('Upload for platform:', platform);
              // TODO: Open upload dialog
            }}
            onView={(platform, url) => {
              window.open(url, '_blank');
            }}
          />
        </div>

        {/* Right: Video Info */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="font-semibold text-lg">Video Info</h2>

            {video.program && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Program</p>
                <Badge
                  style={{ backgroundColor: video.program.color || '#6366f1' }}
                  className="text-white"
                >
                  {video.program.name}
                </Badge>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <StatusBadge status={video.status || 'draft'} />
            </div>

            {video.subject_org && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Organization</p>
                <p className="text-sm">{video.subject_org}</p>
              </div>
            )}

            {video.recorded_date && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Recorded Date</p>
                <p className="text-sm">
                  {format(new Date(video.recorded_date), 'MMM d, yyyy')}
                </p>
              </div>
            )}

            {video.duration_seconds && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Duration</p>
                <p className="text-sm">{formatDuration(video.duration_seconds)}</p>
              </div>
            )}

            {/* Enhanced Tags Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Tags</p>
                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              </div>
              
              {video.all_tags && video.all_tags.length > 0 ? (
                <div className="space-y-3">
                  <TagList video={video} showSource={true} />
                  
                  <div className="pt-3 border-t">
                    <TagStats video={video} />
                  </div>
                  
                  {/* Tag Legend */}
                  <div className="pt-2 space-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div>
                      <span>Manual tags</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-300"></div>
                      <span>From clips</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></div>
                      <span>Both sources</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 px-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Info className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">No tags yet</p>
                  <p className="text-xs text-gray-500">Add tags manually or tag clips to auto-populate</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Tags
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Assets */}
          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4">Assets</h2>
            <div className="space-y-2">
              {video.transcript_text && (
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Transcript
                </Button>
              )}
              {video.captions_srt_url && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={video.captions_srt_url} target="_blank" rel="noopener noreferrer">
                    <FileText className="w-4 h-4 mr-2" />
                    Captions (SRT)
                  </a>
                </Button>
              )}
              {video.thumbnail_url && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={video.thumbnail_url} target="_blank" rel="noopener noreferrer">
                    <Image className="w-4 h-4 mr-2" />
                    Thumbnail
                  </a>
                </Button>
              )}
              {!video.transcript_text && !video.captions_srt_url && !video.thumbnail_url && (
                <p className="text-sm text-gray-500 text-center py-4">No assets uploaded</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}