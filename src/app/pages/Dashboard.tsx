import { useQuery } from '@tanstack/react-query';
import { Link } from '@/components/ui/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error';
import { Video, Scissors } from 'lucide-react';
import { statsApi } from '@/lib/api';

export function Dashboard() {
  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => statsApi.getCounts(),
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
  ];

  if (statsError) {
    return <ErrorState onRetry={refetchStats} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to GenWise Content Management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statsLoading ? (
          <CardSkeleton count={2} />
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