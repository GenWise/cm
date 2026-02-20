import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@/components/ui/link';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/posts/PostCard';
import { PostDetailModal } from '@/components/posts/PostDetailModal';
import { CreatePostModal } from '@/components/posts/CreatePostModal';
import { LoadingState } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error';
import { PlatformIcon } from '@/components/common/PlatformIcon';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Plus, LayoutGrid, Calendar as CalendarIcon, List, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { postsApi } from '@/lib/api';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { ContentPost } from '@/lib/types';

const STATUS_COLUMNS = [
  { id: 'idea', label: 'Ideas', color: 'bg-gray-50' },
  { id: 'draft', label: 'Draft', color: 'bg-yellow-50' },
  { id: 'ready', label: 'Ready', color: 'bg-blue-50' },
  { id: 'scheduled', label: 'Scheduled', color: 'bg-purple-50' },
  { id: 'posted', label: 'Posted', color: 'bg-green-50' },
];

// Detect if touch device
const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

interface DraggablePostCardProps {
  post: ContentPost;
  onClick: () => void;
}

function DraggablePostCard({ post, onClick }: DraggablePostCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'post',
    item: { id: post.id, currentStatus: post.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <PostCard post={post} onClick={onClick} />
    </div>
  );
}

interface ColumnProps {
  status: string;
  label: string;
  color: string;
  posts: ContentPost[];
  onPostClick: (post: ContentPost) => void;
  onDrop: (postId: string, newStatus: string) => void;
}

function Column({ status, label, color, posts, onPostClick, onDrop }: ColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'post',
    drop: (item: any) => {
      if (item.currentStatus !== status) {
        onDrop(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const columnPosts = posts.filter((p) => p.status === status);

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[280px] rounded-lg p-4 transition-all ${color} ${
        isOver ? 'ring-2 ring-blue-500 scale-[1.02]' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-700">
          {label}
        </h3>
        <span className="bg-white px-2 py-1 rounded-full text-xs font-medium">
          {columnPosts.length}
        </span>
      </div>

      <div className="space-y-3 min-h-[200px]">
        {columnPosts.map((post) => (
          <DraggablePostCard
            key={post.id}
            post={post}
            onClick={() => onPostClick(post)}
          />
        ))}
        {columnPosts.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Drag posts here
          </div>
        )}
      </div>
    </div>
  );
}

export function Posts() {
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [view, setView] = useState<'kanban' | 'list'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  const { data: posts, isLoading, isError, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postsApi.getAll(),
  });

  // Filter posts for list view
  const filteredPosts = posts?.filter(post => {
    if (statusFilter !== 'all' && post.status !== statusFilter) return false;
    if (platformFilter !== 'all' && post.platform !== platformFilter) return false;
    return true;
  }) || [];

  const handleDrop = async (postId: string, newStatus: string) => {
    try {
      await postsApi.update(postId, { status: newStatus as any });
      toast.success('Post status updated');
      refetch();
    } catch (error) {
      console.error('Failed to update post status:', error);
      toast.error('Failed to update post status');
    }
  };

  const handlePostClick = (post: ContentPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  // Use touch backend on mobile, HTML5 on desktop
  const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backendForDND}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Content Calendar</h1>
            <p className="text-gray-600 mt-1">Manage your content workflow</p>
          </div>
          <div className="flex gap-2">
            {/* View Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setView('kanban')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  view === 'kanban'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title="Kanban Board"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  view === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* List View Filters */}
        {view === 'list' && (
          <div className="flex gap-4 flex-wrap">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="idea">Ideas</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="posted">Posted</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500 self-center">
              {filteredPosts.length} posts
            </span>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <LoadingState message="Loading posts..." />
        ) : posts && posts.length > 0 ? (
          view === 'kanban' ? (
            // Kanban Board
            <div className="flex gap-4 overflow-x-auto pb-4 touch-pan-x">
              {STATUS_COLUMNS.map((col) => (
                <Column
                  key={col.id}
                  status={col.id}
                  label={col.label}
                  color={col.color}
                  posts={posts}
                  onPostClick={handlePostClick}
                  onDrop={handleDrop}
                />
              ))}
            </div>
          ) : (
            // List View
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title / Caption</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handlePostClick(post)}
                    >
                      <td className="px-4 py-3">
                        <PlatformIcon platform={post.platform} className="w-5 h-5" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-md">
                          <p className="font-medium text-gray-900 truncate">
                            {post.title || 'Untitled'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {post.caption?.slice(0, 80) || 'No caption'}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={post.status || 'idea'} />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {post.scheduled_date ? (
                          <div className="flex items-center gap-1 text-blue-600">
                            <Clock className="w-4 h-4" />
                            {format(new Date(post.scheduled_date), 'MMM d, h:mm a')}
                          </div>
                        ) : post.target_date ? (
                          <span className="text-gray-500">
                            Target: {format(new Date(post.target_date), 'MMM d')}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {post.status === 'posted' ? (
                          <span>
                            {post.views || 0} views · {post.likes || 0} likes
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPosts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No posts match your filters
                </div>
              )}
            </div>
          )
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No posts yet</h3>
            <p className="text-gray-600 mb-4">Create your first content post to get started</p>
            <Button asChild>
              <Link to="/posts/new">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Link>
            </Button>
          </div>
        )}

        {/* Post Detail Modal */}
        <PostDetailModal
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </DndProvider>
  );
}