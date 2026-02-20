import { useQuery } from '@tanstack/react-query';
import { Link } from '@/components/ui/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingState, CardSkeleton } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error';
import { 
  Video, 
  Scissors, 
  Calendar as CalendarIcon, 
  Lightbulb,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { statsApi, postsApi } from '@/lib/api';

export function Dashboard() {
  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => statsApi.getCounts(),
  });

  const { data: upcomingPosts, isLoading: postsLoading, isError: postsError } = useQuery({
    queryKey: ['upcoming-posts'],
    queryFn: () => postsApi.getUpcoming(5),
  });

  const statCards = [
    {
      label: 'Videos',
      value: stats?.videos || 0,
      icon: Video,
      color: 'bg-blue-500',
      href: '/videos',
      subtitle: 'Total videos',
    },
    {
      label: 'Clips',
      value: stats?.clips || 0,
      icon: Scissors,
      color: 'bg-purple-500',
      href: '/clips',
      subtitle: 'Tagged segments',
    },
    {
      label: 'Posts',
      value: stats?.posts || 0,
      icon: CalendarIcon,
      color: 'bg-green-500',
      href: '/posts',
      subtitle: 'Published',
    },
    {
      label: 'Ideas',
      value: stats?.ideas || 0,
      icon: Lightbulb,
      color: 'bg-yellow-500',
      href: '/ideas',
      subtitle: 'Pending',
    },
  ];

  if (statsError) {
    return <ErrorState onRetry={refetchStats} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to GenWise Content Management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          <CardSkeleton count={4} />
        ) : (
          statCards.map((stat) => (
            <Link key={stat.label} to={stat.href}>
              <Card className="p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* Upcoming Posts */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upcoming Posts</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/posts" className="flex items-center gap-1">
              View Calendar
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {postsLoading ? (
          <div className="space-y-3">
            <CardSkeleton count={3} />
          </div>
        ) : postsError ? (
          <div className="text-center py-8 text-red-500">
            Failed to load upcoming posts
          </div>
        ) : upcomingPosts && upcomingPosts.length > 0 ? (
          <div className="space-y-3">
            {upcomingPosts.map((post: any) => (
              <Link 
                key={post.id} 
                to="/posts"
                className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {post.title || post.caption?.substring(0, 60) + '...' || 'Untitled'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {post.platform} • {post.target_date ? format(new Date(post.target_date), 'MMM d, yyyy') : 'No date'}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No upcoming posts scheduled</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link to="/posts/new">Schedule a Post</Link>
            </Button>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/videos/new">
              <Video className="w-4 h-4 mr-2" />
              Add Video
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/posts/new">
              <CalendarIcon className="w-4 h-4 mr-2" />
              New Post
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/clips">
              <Scissors className="w-4 h-4 mr-2" />
              Search Clips
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}