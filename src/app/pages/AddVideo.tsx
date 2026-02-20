import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GoogleDrivePicker } from '@/components/common/GoogleDrivePicker';
import { ArrowLeft, Plus, X, Info } from 'lucide-react';
import { programsApi, videosApi, clipsApi } from '@/lib/api';
import { toast } from 'sonner';

interface ClipInput {
  id: string;
  start_time: string;
  end_time: string;
  description: string;
  tags: string[];
}

export function AddVideo() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: programsApi.getAll,
  });

  const [formData, setFormData] = useState({
    title: '',
    program_id: '',
    subject_name: '',
    subject_role: '',
    subject_org: '',
    raw_video_url: '',
    recorded_date: '',
    status: 'draft' as const,
  });

  const [clipText, setClipText] = useState('');
  const [parsedClips, setParsedClips] = useState<ClipInput[]>([]);

  const createVideoMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const videoId = `video_${Date.now()}`;
      const video = await videosApi.create({
        id: videoId,
        ...data,
      });
      
      // Create clips if any
      if (parsedClips.length > 0) {
        const clipsToCreate = parsedClips.map((clip) => ({
          id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          video_id: videoId,
          start_time: clip.start_time,
          end_time: clip.end_time,
          description: clip.description,
          tags: JSON.stringify(clip.tags),
          start_seconds: parseTimeToSeconds(clip.start_time),
          end_seconds: parseTimeToSeconds(clip.end_time),
          duration_seconds: parseTimeToSeconds(clip.end_time) - parseTimeToSeconds(clip.start_time),
        }));
        await clipsApi.createMany(clipsToCreate);
      }
      
      return video;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Video added successfully!');
      navigate('/videos');
    },
    onError: (error) => {
      toast.error('Failed to add video: ' + error.message);
    },
  });

  const parseClips = () => {
    const lines = clipText.split('\n').filter((line) => line.trim());
    const clips: ClipInput[] = [];

    lines.forEach((line) => {
      // Format: MM:SS-MM:SS Description #tag1 #tag2
      const match = line.match(/^(\d{1,2}:\d{2})-(\d{1,2}:\d{2})\s+(.+)$/);
      if (match) {
        const [, startTime, endTime, rest] = match;
        const tags = rest.match(/#[\w-]+/g)?.map((tag) => tag.slice(1)) || [];
        const description = rest.replace(/#[\w-]+/g, '').trim();

        clips.push({
          id: `temp_${clips.length}`,
          start_time: startTime,
          end_time: endTime,
          description,
          tags,
        });
      }
    });

    setParsedClips(clips);
    if (clips.length > 0) {
      toast.success(`Parsed ${clips.length} clip${clips.length !== 1 ? 's' : ''}`);
    } else {
      toast.error('No valid clips found. Format: MM:SS-MM:SS Description #tags');
    }
  };

  const parseTimeToSeconds = (time: string): number => {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  const removeClip = (id: string) => {
    setParsedClips(parsedClips.filter((clip) => clip.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Please enter a video title');
      return;
    }
    createVideoMutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/videos')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Video</h1>
          <p className="text-gray-600 mt-1">Add a source video with clips</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="p-6 space-y-4">
          <div>
            <Label htmlFor="program">Program *</Label>
            <Select
              value={formData.program_id}
              onValueChange={(value) =>
                setFormData({ ...formData, program_id: value })
              }
            >
              <SelectTrigger id="program">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {programs?.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.full_name || program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Video Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Shyamala Devi M - M3 Testimonial"
            />
          </div>
        </Card>

        {/* Subject Info */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Subject / Speaker</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subject_name">Name</Label>
              <Input
                id="subject_name"
                value={formData.subject_name}
                onChange={(e) =>
                  setFormData({ ...formData, subject_name: e.target.value })
                }
                placeholder="e.g. Shyamala Devi M"
              />
            </div>

            <div>
              <Label htmlFor="subject_role">Role</Label>
              <Input
                id="subject_role"
                value={formData.subject_role}
                onChange={(e) =>
                  setFormData({ ...formData, subject_role: e.target.value })
                }
                placeholder="e.g. Primary Math Teacher"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subject_org">Organization</Label>
            <Input
              id="subject_org"
              value={formData.subject_org}
              onChange={(e) =>
                setFormData({ ...formData, subject_org: e.target.value })
              }
              placeholder="e.g. Sri Kumaran Children's Home - CBSE"
            />
          </div>
        </Card>

        {/* Video Files */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Video Files (Google Drive)</h3>
            <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.5 2.5l-6 10.5h4.5l6-10.5h-4.5zm7.5 0l6 10.5h-4.5l-6-10.5h4.5zm-11 12l3 5.5 6-10.5h-4.5l-4.5 7.5zm16 0h-9l-3 5.5h9l3-5.5z"/>
              </svg>
              <span>Google Drive</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="raw_video_url">Raw Video URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="raw_video_url"
                  type="url"
                  value={formData.raw_video_url}
                  onChange={(e) =>
                    setFormData({ ...formData, raw_video_url: e.target.value })
                  }
                  placeholder="https://drive.google.com/file/d/..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.open('https://drive.google.com/drive/my-drive', '_blank')}
                >
                  Browse
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Click Browse to open Google Drive, then copy and paste the share link here
              </p>
            </div>

            {/* Google Drive Instructions */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">📋 How to get the link:</p>
              <ol className="text-xs text-blue-800 space-y-1 ml-4 list-decimal">
                <li>Click "Browse" to open Google Drive</li>
                <li>Find your video file</li>
                <li>Right-click → "Get link" or "Share"</li>
                <li>Set to "Anyone with the link can view"</li>
                <li>Copy the link and paste it above</li>
              </ol>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recorded_date">Recorded Date</Label>
              <Input
                id="recorded_date"
                type="date"
                value={formData.recorded_date}
                onChange={(e) =>
                  setFormData({ ...formData, recorded_date: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="editing">Editing</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Clips */}
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold">Clips</h3>
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Smart Tag Aggregation</p>
                <p className="text-blue-700">
                  Tags from your clips will automatically be aggregated to the video level. 
                  You can also add manual video tags later, and the system will show you which tags come from clips vs. manual tagging.
                </p>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="clipText">Quick Add (paste timestamps)</Label>
            <Textarea
              id="clipText"
              value={clipText}
              onChange={(e) => setClipText(e.target.value)}
              placeholder="00:45-1:37 Asking 'why' instead of 'wrong' #questioning&#10;02:21-2:45 How to make 7 multiple approaches #addition"
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: MM:SS-MM:SS Description #tag1 #tag2
            </p>
          </div>

          <Button type="button" onClick={parseClips} variant="outline">
            Parse Clips
          </Button>

          {parsedClips.length > 0 && (
            <div className="space-y-2">
              <Label>Parsed Clips ({parsedClips.length})</Label>
              {parsedClips.map((clip) => (
                <div
                  key={clip.id}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-mono text-gray-600 mb-1">
                      {clip.start_time} - {clip.end_time}
                    </p>
                    <p className="text-sm mb-2">{clip.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {clip.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeClip(clip.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/videos')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createVideoMutation.isPending}>
            {createVideoMutation.isPending ? 'Saving...' : 'Save Video'}
          </Button>
        </div>
      </form>
    </div>
  );
}