import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@/components/ui/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VideoCard } from '@/components/videos/VideoCard';
import { VideoTypesBanner } from '@/components/videos/VideoTypesBanner';
import { LoadingState, CardSkeleton } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error';
import { AdvancedFilters, FilterValues } from '@/components/filters/AdvancedFilters';
import { TagSystemHelp } from '@/components/common/TagSystemHelp';
import { Search, Plus, Grid3x3, List } from 'lucide-react';
import { videosApi, programsApi } from '@/lib/api';

const VIDEO_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'editing', label: 'Editing' },
  { value: 'review', label: 'Review' },
  { value: 'published', label: 'Published' },
];

export function Videos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterValues>({});

  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: () => programsApi.getAll(),
  });

  const { data: videos, isLoading, isError, refetch } = useQuery({
    queryKey: ['videos', searchTerm, filters],
    queryFn: () => searchTerm ? videosApi.search(searchTerm) : videosApi.getAll(filters),
  });

  // Additional filtering for date range
  const filteredVideos = videos?.filter((video: any) => {
    if (filters.startDate) {
      const videoDate = new Date(video.created_at);
      if (videoDate < filters.startDate) return false;
    }
    if (filters.endDate) {
      const videoDate = new Date(video.created_at);
      if (videoDate > filters.endDate) return false;
    }
    return true;
  });

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Videos</h1>
          <p className="text-gray-600 mt-1">
            {filteredVideos ? `${filteredVideos.length} video${filteredVideos.length !== 1 ? 's' : ''}` : 'Loading...'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TagSystemHelp />
          <Button asChild>
            <Link to="/videos/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Link>
          </Button>
        </div>
      </div>

      {/* Video Types Info Banner */}
      <VideoTypesBanner />

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search videos by title, subject, or tags..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <AdvancedFilters
          filters={filters}
          onFiltersChange={setFilters}
          programs={programs || []}
          statusOptions={VIDEO_STATUS_OPTIONS}
          showDateRange
        />
        
        <div className="flex gap-1 border border-gray-200 rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Videos Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <CardSkeleton count={8} />
        </div>
      ) : filteredVideos && filteredVideos.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-4'
        }>
          {filteredVideos.map((video: any) => (
            <VideoCard key={video.id} video={video} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No videos found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filters.program_id || filters.status ? 'Try adjusting your search or filters' : 'Add your first video to get started'}
          </p>
          {!searchTerm && !filters.program_id && (
            <Button asChild>
              <Link to="/videos/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}