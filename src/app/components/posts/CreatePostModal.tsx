import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { postsApi, videosApi } from '@/lib/api';
import type { ContentPost } from '@/lib/types';

// Convert comma-separated tags to JSON array with # prefix
function hashtagsToJson(input: string): string {
  if (!input.trim()) return '[]';
  const tags = input.split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)
    .map(t => t.startsWith('#') ? t : `#${t}`);
  return JSON.stringify(tags);
}

// Convert JSON array to comma-separated display (without #)
function hashtagsToDisplay(json: string | undefined): string {
  if (!json) return '';
  try {
    const tags = JSON.parse(json);
    if (Array.isArray(tags)) {
      return tags.map((t: string) => t.replace(/^#/, '')).join(', ');
    }
    return '';
  } catch {
    // If not valid JSON, return as-is without #
    return json.replace(/[#\[\]"]/g, '').trim();
  }
}

// Convert comma-separated mentions to JSON array with @ prefix
function mentionsToJson(input: string): string {
  if (!input.trim()) return '[]';
  const mentions = input.split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)
    .map(t => t.startsWith('@') ? t : `@${t}`);
  return JSON.stringify(mentions);
}

// Convert JSON array to comma-separated display (without @)
function mentionsToDisplay(json: string | undefined): string {
  if (!json) return '';
  try {
    const mentions = JSON.parse(json);
    if (Array.isArray(mentions)) {
      return mentions.map((t: string) => t.replace(/^@/, '')).join(', ');
    }
    return '';
  } catch {
    return json.replace(/[@\[\]"]/g, '').trim();
  }
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLATFORMS = [
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

const STATUSES = [
  { value: 'idea', label: 'Idea' },
  { value: 'draft', label: 'Draft' },
  { value: 'ready', label: 'Ready' },
  { value: 'scheduled', label: 'Scheduled' },
];

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<ContentPost>>({
    status: 'idea',
    platform: 'twitter',
    priority: 'normal',
  });

  const { data: videos } = useQuery({
    queryKey: ['videos'],
    queryFn: () => videosApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<ContentPost>) => postsApi.create(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      toast.success('Post created successfully');
      setFormData({ status: 'idea', platform: 'twitter', priority: 'normal' });
      onClose();
    },
    onError: (error) => {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post');
    },
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    if (!formData.platform) {
      toast.error('Please select a platform');
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Platform & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Platform *</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => handleChange('platform', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Post title or idea name..."
            />
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label>Caption / Content</Label>
            <Textarea
              value={formData.caption || ''}
              onChange={(e) => handleChange('caption', e.target.value)}
              placeholder="Write your post content..."
              rows={4}
            />
            {formData.platform === 'twitter' && (
              <p className="text-xs text-gray-500">
                {(formData.caption || '').length}/280 characters
              </p>
            )}
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label>Hashtags</Label>
            <Input
              value={hashtagsToDisplay(formData.hashtags)}
              onChange={(e) => handleChange('hashtags', hashtagsToJson(e.target.value))}
              placeholder='GiftedEducation, GenWise, M3'
            />
            <p className="text-xs text-gray-500">Comma-separated (# added automatically)</p>
          </div>

          {/* Mentions */}
          <div className="space-y-2">
            <Label>Tag People</Label>
            <Input
              value={mentionsToDisplay(formData.mentions)}
              onChange={(e) => handleChange('mentions', mentionsToJson(e.target.value))}
              placeholder='GenWise_, M3Program, RajeshP'
            />
            <p className="text-xs text-gray-500">Comma-separated handles (@ added automatically)</p>
          </div>

          {/* Link to Video (optional) */}
          <div className="space-y-2">
            <Label>Link to Video (optional)</Label>
            <Select
              value={formData.video_id || 'none'}
              onValueChange={(value) => handleChange('video_id', value === 'none' ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a video..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {videos?.map((v: any) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Scheduled Date (if status is scheduled) */}
          {formData.status === 'scheduled' && (
            <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Label className="text-blue-800">Schedule Date/Time</Label>
              <Input
                type="datetime-local"
                value={formData.scheduled_date
                  ? new Date(formData.scheduled_date).toISOString().slice(0, 16)
                  : ''}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  handleChange('scheduled_date', date.toISOString());
                }}
              />
              {formData.platform === 'twitter' && (
                <p className="text-xs text-blue-600">
                  Will auto-post to @Genwise_ at this time
                </p>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (internal)</Label>
            <Textarea
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Internal notes..."
              rows={2}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create Post'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
