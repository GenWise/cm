import { useQuery } from '@tanstack/react-query';
import { Link } from '@/components/ui/link';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/posts/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Lightbulb } from 'lucide-react';
import { postsApi } from '@/lib/api';

export function Ideas() {
  const { data: ideas, isLoading } = useQuery({
    queryKey: ['ideas'],
    queryFn: () => postsApi.getAll({ status: 'idea' }),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Post Ideas</h1>
          <p className="text-gray-600 mt-1">
            {ideas ? `${ideas.length} idea${ideas.length !== 1 ? 's' : ''}` : 'Loading...'}
          </p>
        </div>
        <Button asChild>
          <Link to="/posts/new">
            <Plus className="w-4 h-4 mr-2" />
            New Idea
          </Link>
        </Button>
      </div>

      {/* Ideas Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : ideas && ideas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map((idea: any) => (
            <PostCard
              key={idea.id}
              post={idea}
              onClick={() => console.log('Open idea:', idea.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <Lightbulb className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No ideas yet</h3>
          <p className="text-gray-600 mb-4">Capture your content ideas here</p>
          <Button asChild>
            <Link to="/posts/new">
              <Plus className="w-4 h-4 mr-2" />
              Add First Idea
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}