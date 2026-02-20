import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PlatformIcon } from '@/components/common/PlatformIcon';
import { StatusBadge } from '@/components/common/StatusBadge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CalendarIcon, Trash2, Save, ExternalLink } from 'lucide-react';
import { postsApi } from '@/lib/api';
import type { ContentPost } from '@/lib/types';

// Safely parse hashtags - handles both JSON and plain text
function parseHashtags(hashtags: string | undefined): string[] {
  if (!hashtags) return [];
  try {
    const parsed = JSON.parse(hashtags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // If not valid JSON, split by comma or space
    return hashtags.split(/[,\s]+/).filter(t => t.length > 0);
  }
}

// Convert comma-separated tags to JSON array with # prefix
function hashtagsToJson(input: string): string {
  if (!input.trim()) return '[]';
  const tags = input.split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)
    .map(t => t.startsWith('#') ? t : `#${t}`);
  return JSON.stringify(tags);
}

// Convert JSON/string to comma-separated display (without #)
function hashtagsToDisplay(json: string | undefined): string {
  const tags = parseHashtags(json);
  return tags.map(t => t.replace(/^#/, '')).join(', ');
}

// Safely parse mentions
function parseMentions(mentions: string | undefined): string[] {
  if (!mentions) return [];
  try {
    const parsed = JSON.parse(mentions);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return mentions.split(/[,\s]+/).filter(t => t.length > 0);
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

// Convert JSON to comma-separated display (without @)
function mentionsToDisplay(json: string | undefined): string {
  const mentions = parseMentions(json);
  return mentions.map(t => t.replace(/^@/, '')).join(', ');
}

// Convert ISO date string to local datetime-local input format (YYYY-MM-DDTHH:MM)
function toLocalDatetimeString(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

interface PostDetailModalProps {
  post: ContentPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PostDetailModal({ post, isOpen, onClose }: PostDetailModalProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ContentPost>>({});
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Sync formData when post changes or modal opens
  useEffect(() => {
    if (post && isOpen) {
      setFormData({ ...post });
      setIsEditing(false);
    }
  }, [post, isOpen]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<ContentPost>) =>
      postsApi.update(post!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post updated successfully');
      setIsEditing(false);
      onClose();
    },
    onError: (error) => {
      console.error('Failed to update post:', error);
      toast.error('Failed to update post');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => postsApi.delete(post!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully');
      onClose();
    },
    onError: (error) => {
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete post');
    },
  });

  if (!post) return null;

  const handleSave = () => {
    // Only send updateable fields, not relations
    const { video, clip, created_at, updated_at, id, ...updateData } = formData as any;
    updateMutation.mutate(updateData);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate();
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <PlatformIcon platform={post.platform} />
            {isEditing ? (
              <Input
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Post title..."
                className="flex-1"
              />
            ) : (
              <span>{post.title || 'Untitled Post'}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              {isEditing ? (
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="posted">Posted</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div>
                  <StatusBadge status={post.status || 'idea'} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              {isEditing ? (
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  variant={
                    post.priority === 'urgent' || post.priority === 'high'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {post.priority || 'normal'}
                </Badge>
              )}
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label>Caption</Label>
            {isEditing ? (
              <Textarea
                value={formData.caption || ''}
                onChange={(e) => handleChange('caption', e.target.value)}
                placeholder="Write your caption..."
                rows={4}
              />
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {post.caption || 'No caption'}
              </p>
            )}
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label>Hashtags</Label>
            {isEditing ? (
              <div>
                <Input
                  value={hashtagsToDisplay(formData.hashtags)}
                  onChange={(e) => handleChange('hashtags', hashtagsToJson(e.target.value))}
                  placeholder="GiftedEducation, GenWise, M3"
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated (# added automatically)</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {parseHashtags(post.hashtags).length > 0 ? (
                  parseHashtags(post.hashtags).map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No hashtags</span>
                )}
              </div>
            )}
          </div>

          {/* Mentions / Tag People */}
          <div className="space-y-2">
            <Label>Tag People</Label>
            {isEditing ? (
              <div>
                <Input
                  value={mentionsToDisplay(formData.mentions)}
                  onChange={(e) => handleChange('mentions', mentionsToJson(e.target.value))}
                  placeholder="GenWise_, M3Program"
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated handles (@ added automatically)</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {parseMentions(post.mentions).length > 0 ? (
                  parseMentions(post.mentions).map((mention: string) => (
                    <Badge key={mention} variant="secondary">
                      {mention}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No mentions</span>
                )}
              </div>
            )}
          </div>

          {/* Target Date */}
          <div className="space-y-2">
            <Label>Target Date</Label>
            {isEditing ? (
              <Input
                type="date"
                value={formData.target_date
                  ? new Date(formData.target_date).toISOString().split('T')[0]
                  : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  handleChange('target_date', date?.toISOString() || null);
                }}
                className="w-full"
              />
            ) : (
              <p className="text-sm">
                {post.target_date
                  ? format(new Date(post.target_date), 'PPP')
                  : 'No target date'}
              </p>
            )}
          </div>

          {/* Scheduled Date/Time (for Twitter auto-posting) */}
          {(formData.status === 'scheduled' || post.status === 'scheduled') && (
            <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Label className="text-blue-800">Schedule Post (Auto-post to X/Twitter)</Label>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    type="datetime-local"
                    value={formData.scheduled_date
                      ? toLocalDatetimeString(formData.scheduled_date)
                      : ''}
                    onChange={(e) => {
                      // datetime-local gives local time, store as ISO with correct offset
                      if (e.target.value) {
                        const localDate = new Date(e.target.value);
                        handleChange('scheduled_date', localDate.toISOString());
                      } else {
                        handleChange('scheduled_date', null);
                      }
                    }}
                    className="flex-1"
                  />
                </div>
              ) : (
                <p className="text-sm text-blue-800 font-medium">
                  {post.scheduled_date
                    ? format(new Date(post.scheduled_date), 'PPP p')
                    : 'No scheduled time set (will post on next run)'}
                </p>
              )}
              <p className="text-xs text-blue-600">
                {post.platform === 'twitter'
                  ? '✓ Will auto-post to @Genwise_ at scheduled time (IST)'
                  : 'Auto-posting only available for Twitter/X'}
              </p>
            </div>
          )}

          {/* Assigned To */}
          <div className="space-y-2">
            <Label>Assigned To</Label>
            {isEditing ? (
              <Input
                value={formData.assigned_to || ''}
                onChange={(e) => handleChange('assigned_to', e.target.value)}
                placeholder="Name or email..."
              />
            ) : (
              <p className="text-sm">
                {post.assigned_to || 'Unassigned'}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            {isEditing ? (
              <Textarea
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Add notes..."
                rows={3}
              />
            ) : (
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {post.notes || 'No notes'}
              </p>
            )}
          </div>

          {/* Thread Info */}
          {(post.parent_post_id || post.thread_position !== undefined && post.thread_position > 0) && (
            <div className="space-y-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Label className="text-purple-800">Thread Reply</Label>
              <p className="text-sm text-purple-700">
                This is reply #{post.thread_position || 1} in a thread.
                {post.platform === 'twitter' && ' URLs in replies avoid Twitter engagement penalties.'}
              </p>
            </div>
          )}

          {/* Platform Link */}
          {post.platform_url && (
            <div className="space-y-2">
              <Label>Platform URL</Label>
              <a
                href={post.platform_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                {post.platform_url}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Engagement Stats */}
          {post.status === 'posted' && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500">Views</p>
                <p className="text-2xl font-semibold">{post.views || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Likes</p>
                <p className="text-2xl font-semibold">{post.likes || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Comments</p>
                <p className="text-2xl font-semibold">{post.comments || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Shares</p>
                <p className="text-2xl font-semibold">{post.shares || 0}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between border-t pt-4">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(post);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
