import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Chip } from '../atoms/Chip';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range';
  options?: FilterOption[];
  min?: number;
  max?: number;
}

interface FiltersSidebarProps {
  filters: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (filterId: string, value: string, checked: boolean) => void;
  onClearAll: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function FiltersSidebar({
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
  onClose,
  isMobile = false
}: FiltersSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    filters.reduce((acc, filter) => ({ ...acc, [filter.id]: true }), {})
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const activeFiltersCount = Object.values(selectedFilters).flat().length;

  return (
    <div className={`bg-background ${isMobile ? 'h-full' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg">Filters</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-sm text-primary hover:underline"
            >
              Clear All
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold mb-2">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([filterId, values]) =>
              values.map((value) => {
                const filter = filters.find(f => f.id === filterId);
                const option = filter?.options?.find(o => o.id === value);
                return (
                  <Chip
                    key={`${filterId}-${value}`}
                    label={option?.label || value}
                    onRemove={() => onFilterChange(filterId, value, false)}
                  />
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Filter Groups */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {filters.map((filter) => (
          <div key={filter.id} className="border-b border-border">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(filter.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
            >
              <span className="font-semibold">{filter.label}</span>
              {expandedGroups[filter.id] ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {/* Group Content */}
            {expandedGroups[filter.id] && (
              <div className="px-4 pb-4">
                {filter.type === 'checkbox' && filter.options && (
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters[filter.id]?.includes(option.id) || false}
                          onChange={(e) => onFilterChange(filter.id, option.id, e.target.checked)}
                          className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                        />
                        <span className="flex-1 text-sm">{option.label}</span>
                        {option.count !== undefined && (
                          <span className="text-xs text-muted-foreground">({option.count})</span>
                        )}
                      </label>
                    ))}
                  </div>
                )}

                {filter.type === 'radio' && filter.options && (
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 rounded"
                      >
                        <input
                          type="radio"
                          name={filter.id}
                          checked={selectedFilters[filter.id]?.includes(option.id) || false}
                          onChange={(e) => {
                            if (selectedFilters[filter.id]) {
                              selectedFilters[filter.id].forEach(v => {
                                if (v !== option.id) onFilterChange(filter.id, v, false);
                              });
                            }
                            onFilterChange(filter.id, option.id, e.target.checked);
                          }}
                          className="w-4 h-4 text-primary border-border focus:ring-primary"
                        />
                        <span className="flex-1 text-sm">{option.label}</span>
                        {option.count !== undefined && (
                          <span className="text-xs text-muted-foreground">({option.count})</span>
                        )}
                      </label>
                    ))}
                  </div>
                )}

                {filter.type === 'range' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={filter.min}
                        max={filter.max}
                        placeholder="Min"
                        className="flex-1 px-3 py-2 border border-border rounded-lg text-sm"
                      />
                      <span className="text-muted-foreground">-</span>
                      <input
                        type="number"
                        min={filter.min}
                        max={filter.max}
                        placeholder="Max"
                        className="flex-1 px-3 py-2 border border-border rounded-lg text-sm"
                      />
                    </div>
                    <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90">
                      Apply
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
