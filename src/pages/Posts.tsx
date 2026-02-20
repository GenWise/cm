import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/posts/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { postsApi } from '@/lib/api';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { ContentPost } from '@/lib/types';

const STATUS_COLUMNS = [
  { id: 'idea', label: 'Ideas', color: 'bg-gray-50' },
  { id: 'draft', label: 'Draft', color: 'bg-yellow-50' },
  { id: 'ready', label: 'Ready', color: 'bg-blue-50' },
  { id: 'posted', label: 'Posted', color: 'bg-green-50' },
];

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
      className={`flex-1 min-w-[280px] rounded-lg p-4 ${color} ${
        isOver ? 'ring-2 ring-blue-500' : ''
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

      <div className="space-y-3">
        {columnPosts.map((post) => (
          <DraggablePostCard
            key={post.id}
            post={post}
            onClick={() => onPostClick(post)}
          />
        ))}
      </div>
    </div>
  );
}

export function Posts() {
  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postsApi.getAll(),
  });

  const handleDrop = async (postId: string, newStatus: string) => {
    try {
      await postsApi.update(postId, { status: newStatus as any });
      refetch();
    } catch (error) {
      console.error('Failed to update post status:', error);
    }
  };

  const handlePostClick = (post: ContentPost) => {
    // TODO: Open post detail modal
    console.log('Open post:', post.id);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Content Calendar</h1>
            <p className="text-gray-600 mt-1">Manage your content workflow</p>
          </div>
          <Button asChild>
            <Link to="/posts/new">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>

        {/* Kanban Board */}
        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STATUS_COLUMNS.map((col) => (
              <div key={col.id} className="flex-1 min-w-[280px]">
                <Skeleton className="h-96" />
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
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
      </div>
    </DndProvider>
  );
}
