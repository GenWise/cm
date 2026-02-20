import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ClipRow } from '@/components/clips/ClipRow';
import { LoadingState, TableSkeleton } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error';
import { AdvancedFilters, FilterValues } from '@/components/filters/AdvancedFilters';
import { Search } from 'lucide-react';
import { clipsApi, programsApi } from '@/lib/api';

const POPULAR_TAGS = [
  'questioning',
  'mental-models',
  'misconceptions',
  'multiple-approaches',
  'student-thinking',
  'assessment',
];

export function Clips() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterValues>({});

  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: () => programsApi.getAll(),
  });

  const { data: clips, isLoading, isError, refetch } = useQuery({
    queryKey: ['clips', searchTerm, selectedTag, filters],
    queryFn: () => {
      if (selectedTag) return clipsApi.getByTag(selectedTag);
      if (searchTerm) return clipsApi.search(searchTerm);
      return clipsApi.getAll();
    },
  });

  // Filter clips based on advanced filters
  const filteredClips = clips?.filter((clip: any) => {
    if (filters.program_id && filters.program_id !== 'all') {
      if (clip.video?.program_id !== filters.program_id) return false;
    }
    if (filters.tags && filters.tags.length > 0) {
      const clipTags = clip.tags ? JSON.parse(clip.tags) : [];
      const hasAllTags = filters.tags.every((tag) => clipTags.includes(tag));
      if (!hasAllTags) return false;
    }
    return true;
  });

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
      setSearchTerm('');
    }
  };

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Clips</h1>
        <p className="text-gray-600 mt-1">
          {filteredClips ? `${filteredClips.length} clip${filteredClips.length !== 1 ? 's' : ''}` : 'Loading...'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search clips by description, transcript, or tags..."
            className="pl-10 py-6 text-base"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedTag(null);
            }}
          />
        </div>
        <AdvancedFilters
          filters={filters}
          onFiltersChange={setFilters}
          programs={programs || []}
          showTags
        />
      </div>

      {/* Popular Tags */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Popular Tags:</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleTagClick(tag)}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Clips List */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : filteredClips && filteredClips.length > 0 ? (
        <div className="space-y-3">
          {filteredClips.map((clip: any) => (
            <ClipRow
              key={clip.id}
              clip={clip}
              showVideo
              videoTitle={clip.video?.title}
              onPlay={() => {
                // TODO: Open video and seek to timestamp
                console.log('Play clip:', clip.id);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No clips found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedTag || filters.program_id
              ? 'Try adjusting your search or filters'
              : 'Add videos with clips to see them here'}
          </p>
        </div>
      )}
    </div>
  );
}