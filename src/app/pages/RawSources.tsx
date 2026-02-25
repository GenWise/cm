import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RawSourceCard } from '@/components/sources/RawSourceCard';
import { LoadingState, CardSkeleton } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/error';
import { Search, Plus, Grid3x3, List, Database } from 'lucide-react';
import { rawSourcesApi, programsApi } from '@/lib/api';
import type { RawSourceType, RawSourceStatus } from '@/lib/types';

const SOURCE_TYPE_OPTIONS: { value: RawSourceType; label: string }[] = [
  { value: 'feedback_sheet', label: 'Feedback Sheet' },
  { value: 'video_recording', label: 'Video Recording' },
  { value: 'session_recording', label: 'Session Recording' },
  { value: 'whatsapp_message', label: 'WhatsApp Message' },
  { value: 'email_thread', label: 'Email Thread' },
  { value: 'survey_response', label: 'Survey Response' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'other', label: 'Other' },
];

const STATUS_OPTIONS: { value: RawSourceStatus; label: string }[] = [
  { value: 'raw', label: 'Raw' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'curated', label: 'Curated' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export function RawSources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filters, setFilters] = useState<{
    program_id?: string;
    status?: RawSourceStatus;
    source_type?: RawSourceType;
  }>({});

  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: () => programsApi.getAll(),
  });

  const { data: sources, isLoading, isError, refetch } = useQuery({
    queryKey: ['raw_sources', searchTerm, filters],
    queryFn: () => searchTerm ? rawSourcesApi.search(searchTerm) : rawSourcesApi.getAll(filters),
  });

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  const handleFilterChange = (key: string, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="w-8 h-8" />
            Raw Sources
          </h1>
          <p className="text-gray-600 mt-1">
            {sources ? `${sources.length} source${sources.length !== 1 ? 's' : ''}` : 'Loading...'}
          </p>
        </div>
        <Button disabled>
          <Plus className="w-4 h-4 mr-2" />
          Add Source
        </Button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Raw Sources</strong> track the origin of content - feedback sheets, video recordings,
          WhatsApp messages, surveys, and more. Extract quotes, clips, and insights from these sources
          to create marketing materials.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
        <div className="relative flex-1 w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search sources..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={filters.source_type || 'all'}
            onValueChange={(v) => handleFilterChange('source_type', v)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Source Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {SOURCE_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status || 'all'}
            onValueChange={(v) => handleFilterChange('status', v)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.program_id || 'all'}
            onValueChange={(v) => handleFilterChange('program_id', v)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {programs?.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
      </div>

      {/* Sources Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <CardSkeleton count={8} />
        </div>
      ) : sources && sources.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-4'
        }>
          {sources.map((source: any) => (
            <RawSourceCard key={source.id} source={source} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Database className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No sources found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filters.program_id || filters.status || filters.source_type
              ? 'Try adjusting your search or filters'
              : 'Add your first raw source to get started'}
          </p>
        </div>
      )}
    </div>
  );
}
