import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Filter, X, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { Program } from '@/lib/types';

export interface FilterValues {
  program_id?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
}

interface AdvancedFiltersProps {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
  programs?: Program[];
  statusOptions?: { value: string; label: string }[];
  showDateRange?: boolean;
  showTags?: boolean;
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  programs = [],
  statusOptions = [],
  showDateRange = false,
  showTags = false,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterValues>(filters);

  const activeFilterCount = [
    localFilters.program_id,
    localFilters.status,
    localFilters.startDate,
    localFilters.endDate,
    localFilters.tags?.length,
  ].filter(Boolean).length;

  const handleApply = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = (localFilters.tags || []).filter((t) => t !== tag);
    setLocalFilters({ ...localFilters, tags: newTags });
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Filters</h4>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-auto p-1 text-xs"
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* Program Filter */}
            {programs.length > 0 && (
              <div className="space-y-2">
                <Label>Program</Label>
                <Select
                  value={localFilters.program_id}
                  onValueChange={(value) =>
                    setLocalFilters({ ...localFilters, program_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All programs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All programs</SelectItem>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Status Filter */}
            {statusOptions.length > 0 && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={localFilters.status}
                  onValueChange={(value) =>
                    setLocalFilters({ ...localFilters, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Date Range Filter */}
            {showDateRange && (
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {localFilters.startDate
                          ? format(localFilters.startDate, 'MMM d, yyyy')
                          : 'Start date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={localFilters.startDate}
                        onSelect={(date) =>
                          setLocalFilters({ ...localFilters, startDate: date })
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {localFilters.endDate
                          ? format(localFilters.endDate, 'MMM d, yyyy')
                          : 'End date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={localFilters.endDate}
                        onSelect={(date) =>
                          setLocalFilters({ ...localFilters, endDate: date })
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            {/* Tags Filter */}
            {showTags && (
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input
                  placeholder="Add tag and press Enter..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const value = e.currentTarget.value.trim();
                      if (value && !(localFilters.tags || []).includes(value)) {
                        setLocalFilters({
                          ...localFilters,
                          tags: [...(localFilters.tags || []), value],
                        });
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
                {localFilters.tags && localFilters.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {localFilters.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1 pr-1"
                      >
                        #{tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t">
              <Button onClick={handleApply} className="flex-1">
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {localFilters.program_id && localFilters.program_id !== 'all' && (
            <Badge variant="secondary" className="gap-1 pr-1">
              Program:{' '}
              {programs.find((p) => p.id === localFilters.program_id)?.name}
              <button
                onClick={() => {
                  const newFilters = { ...localFilters };
                  delete newFilters.program_id;
                  setLocalFilters(newFilters);
                  onFiltersChange(newFilters);
                }}
                className="hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {localFilters.status && localFilters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1 pr-1">
              Status:{' '}
              {statusOptions.find((s) => s.value === localFilters.status)?.label}
              <button
                onClick={() => {
                  const newFilters = { ...localFilters };
                  delete newFilters.status;
                  setLocalFilters(newFilters);
                  onFiltersChange(newFilters);
                }}
                className="hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
