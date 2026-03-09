import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { TestimonialCardImproved, CardSize, CardTheme } from './TestimonialCardImproved';
import { sampleTestimonials as defaultTestimonials } from './testimonial-data-examples';

export interface TestimonialData {
  id?: string;
  quote: string;
  teacherName?: string;
  role?: string;
  subject?: string;
  schoolName?: string;
  teacherPhoto?: string;
  schoolLogo?: string;
  size?: CardSize;
  theme?: CardTheme;
  showPhoto?: boolean;
  showSchoolLogo?: boolean;
}

interface BatchGeneratorProps {
  testimonials?: TestimonialData[];
  defaultSize?: CardSize;
  defaultTheme?: CardTheme;
  autoExport?: boolean;
  onExportComplete?: (results: { id: string; success: boolean; filename: string }[]) => void;
}

export const TestimonialBatchGenerator: React.FC<BatchGeneratorProps> = ({
  testimonials,
  defaultSize = 'square',
  defaultTheme = 'crimson',
  autoExport = false,
  onExportComplete,
}) => {
  const [exportingIndex, setExportingIndex] = useState<number | null>(null);
  const [exportedCards, setExportedCards] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Import example data
  const actualTestimonials = testimonials || defaultTestimonials;

  // Export a single card as PNG at 2x resolution
  const exportCard = async (index: number, testimonial: TestimonialData) => {
    const cardElement = cardRefs.current[index];
    if (!cardElement) return { success: false, filename: '' };

    setExportingIndex(index);

    try {
      // Capture at 2x resolution for social media quality
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
      });

      // Convert to blob and download
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0);
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Generate filename: m3-testimonial-{name}-{size}-{theme}.png
      const safeName = (testimonial.teacherName || testimonial.id || `card-${index}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
      const size = testimonial.size || defaultSize;
      const theme = testimonial.theme || defaultTheme;
      const filename = `m3-testimonial-${safeName}-${size}-${theme}.png`;
      
      link.href = url;
      link.download = filename;
      link.click();
      
      URL.revokeObjectURL(url);
      
      setExportedCards(prev => new Set(prev).add(index));
      setExportingIndex(null);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Export failed:', error);
      setExportingIndex(null);
      return { success: false, filename: '' };
    }
  };

  // Export all cards in sequence
  const exportAll = async () => {
    const results: { id: string; success: boolean; filename: string }[] = [];
    
    for (let i = 0; i < actualTestimonials.length; i++) {
      const testimonial = actualTestimonials[i];
      const result = await exportCard(i, testimonial);
      results.push({
        id: testimonial.id || `card-${i}`,
        ...result,
      });
      
      // Small delay between exports to prevent browser hanging
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    onExportComplete?.(results);
  };

  // Auto-export on mount if requested
  React.useEffect(() => {
    if (autoExport && actualTestimonials.length > 0) {
      // Small delay to ensure cards are rendered
      setTimeout(() => exportAll(), 1000);
    }
  }, [autoExport]);

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-8 p-6 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">M3 Testimonial Batch Generator</h2>
            <p className="text-gray-600 mt-1">
              {actualTestimonials.length} card{actualTestimonials.length !== 1 ? 's' : ''} ready to export
            </p>
          </div>
          <div className="flex gap-3">
            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-white rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#1848A0] text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#1848A0] text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
            </div>
            
            <button
              onClick={exportAll}
              disabled={exportingIndex !== null}
              className="px-6 py-3 bg-[#A01E21] text-white font-semibold rounded-lg hover:bg-[#8a1a1d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {exportingIndex !== null ? `Exporting ${exportingIndex + 1}/${actualTestimonials.length}...` : 'Export All Cards'}
            </button>
          </div>
        </div>
        
        <div className="flex gap-2 text-sm text-gray-700">
          <span className="px-3 py-1 bg-white rounded">✓ 2x resolution for social media</span>
          <span className="px-3 py-1 bg-white rounded">✓ PNG with transparency</span>
          <span className="px-3 py-1 bg-white rounded">✓ Auto-generated filenames</span>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {actualTestimonials.map((testimonial, index) => {
            const size = testimonial.size || defaultSize;
            const theme = testimonial.theme || defaultTheme;
            const isExporting = exportingIndex === index;
            const isExported = exportedCards.has(index);
            
            // Calculate scale and dimensions for grid preview
            const scale = 0.4;
            const dimensions = {
              square: { width: 1080, height: 1080 },
              landscape: { width: 1200, height: 628 },
              story: { width: 1080, height: 1920 },
              compact: { width: 600, height: 400 },
            }[size];
            
            return (
              <div key={testimonial.id || index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Card preview with proper spacing */}
                <div 
                  className="relative overflow-hidden bg-gray-100"
                  style={{
                    height: `${dimensions.height * scale}px`,
                  }}
                >
                  <div
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: 'top left',
                      width: `${dimensions.width}px`,
                      height: `${dimensions.height}px`,
                    }}
                  >
                    <TestimonialCardImproved
                      ref={(el) => (cardRefs.current[index] = el)}
                      {...testimonial}
                      size={size}
                      theme={theme}
                    />
                  </div>
                  
                  {/* Export overlay */}
                  {(isExporting || isExported) && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-2xl font-bold">
                        {isExporting ? 'Exporting...' : '✓ Exported'}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Card info and actions */}
                <div className="p-4 border-t">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {testimonial.teacherName || `Card ${index + 1}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {size} • {theme}
                      </p>
                    </div>
                    <button
                      onClick={() => exportCard(index, testimonial)}
                      disabled={isExporting}
                      className="ml-4 px-4 py-2 bg-[#1848A0] hover:bg-[#143a85] text-white font-medium rounded disabled:opacity-50 text-sm transition-colors"
                    >
                      {isExported ? 'Re-export' : 'Export'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {actualTestimonials.map((testimonial, index) => {
            const size = testimonial.size || defaultSize;
            const theme = testimonial.theme || defaultTheme;
            const isExporting = exportingIndex === index;
            const isExported = exportedCards.has(index);
            
            // Smaller scale for list view
            const scale = 0.2;
            const dimensions = {
              square: { width: 1080, height: 1080 },
              landscape: { width: 1200, height: 628 },
              story: { width: 1080, height: 1920 },
              compact: { width: 600, height: 400 },
            }[size];
            
            return (
              <div key={testimonial.id || index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex gap-6 p-6">
                  {/* Thumbnail preview */}
                  <div 
                    className="relative flex-shrink-0 overflow-hidden bg-gray-100 rounded"
                    style={{
                      width: `${dimensions.width * scale}px`,
                      height: `${dimensions.height * scale}px`,
                    }}
                  >
                    <div
                      style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        width: `${dimensions.width}px`,
                        height: `${dimensions.height}px`,
                      }}
                    >
                      <TestimonialCardImproved
                        ref={(el) => (cardRefs.current[index] = el)}
                        {...testimonial}
                        size={size}
                        theme={theme}
                      />
                    </div>
                    
                    {/* Export overlay */}
                    {(isExporting || isExported) && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-white text-xs font-bold">
                          {isExporting ? 'Exporting...' : '✓'}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Card details */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {testimonial.teacherName || `Card ${index + 1}`}
                      </h3>
                      {testimonial.role && (
                        <p className="text-sm text-gray-600 mb-1">{testimonial.role}</p>
                      )}
                      {testimonial.schoolName && (
                        <p className="text-sm text-gray-600 mb-3">{testimonial.schoolName}</p>
                      )}
                      <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-gray-100 rounded font-medium">
                          {size}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded font-medium capitalize">
                          {theme}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => exportCard(index, testimonial)}
                        disabled={isExporting}
                        className="px-6 py-2 bg-[#1848A0] hover:bg-[#143a85] text-white font-semibold rounded disabled:opacity-50 transition-colors"
                      >
                        {isExported ? 'Re-export' : 'Export PNG'}
                      </button>
                      {isExported && (
                        <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                          ✓ Exported
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {actualTestimonials.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No testimonials to display. Pass an array of testimonials to the component.
        </div>
      )}
    </div>
  );
};