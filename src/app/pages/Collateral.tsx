import React, { useState, useRef } from 'react';
import { TestimonialCardImproved, CardSize, CardTheme, TestimonialCardProps } from '../components/collateral/TestimonialCardImproved';
import { TestimonialBatchGenerator } from '../components/collateral/TestimonialBatchGenerator';
import { sampleTestimonials as exampleTestimonials } from '../components/collateral/testimonial-data-examples';
import { DesignReview } from '../components/collateral/DesignReview';
import { M3LogoShowcase } from '../components/collateral/M3LogoShowcase';
import { BrandLogoShowcase } from '../components/collateral/BrandLogoShowcase';
import { SlideTemplateBrowser } from '../components/collateral/VideoSlideTemplates';
import { LogoCropper } from '../components/collateral/LogoCropper';
import { Download, ZoomIn, Eye, FileText, CheckCircle, Loader2, Palette, Image, Grid3x3, Video, ArrowLeft, Sparkles, Scissors } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';

type ViewMode = 'hub' | 'testimonialCards' | 'videoSlides' | 'm3Logos' | 'brandLogos' | 'review' | 'batch' | 'logoCropper' | 'fullPreview';

export function Collateral() {
  const [viewMode, setViewMode] = useState<ViewMode>('hub');
  const [selectedSize, setSelectedSize] = useState<CardSize>('square');
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('crimson');
  const [showPhoto, setShowPhoto] = useState(true);
  const [showSchoolLogo, setShowSchoolLogo] = useState(true);
  const [selectedCard, setSelectedCard] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const eiAssetLogoUrl = 'data:image/svg+xml,' + encodeURIComponent(`
    <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="40" rx="6" fill="#A01E21"/>
      <text x="12" y="27" fill="white" font-size="18" font-weight="800" font-family="Poppins">Ei ASSET</text>
    </svg>
  `);

  const genwiseLogoUrl = 'data:image/svg+xml,' + encodeURIComponent(`
    <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="40" rx="6" fill="#1848A0"/>
      <text x="12" y="27" fill="white" font-size="18" font-weight="800" font-family="Poppins">GenWise</text>
    </svg>
  `);

  const schoolLogoUrl = 'data:image/svg+xml,' + encodeURIComponent(`
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#FFB700" stroke="#A01E21" stroke-width="3"/>
      <text x="40" y="48" fill="#A01E21" font-size="18" font-weight="900" font-family="Poppins" text-anchor="middle">PSBB</text>
    </svg>
  `);

  const sampleTestimonials: (TestimonialCardProps & { id: number })[] = [
    {
      id: 0,
      quote: "I have started enjoying the wrong answers given by our students as they help us identify misconceptions and immediately remediate them.",
      teacherName: "Priya Sharma",
      role: "Math Teacher",
      subject: "Middle School Math",
      schoolName: "PSBB",
      teacherPhoto: "https://images.unsplash.com/photo-1528082414335-adbd64f18d12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      schoolLogo: schoolLogoUrl,
      eiAssetLogo: eiAssetLogoUrl,
      genwiseLogo: genwiseLogoUrl,
      size: selectedSize,
      theme: selectedTheme,
      showPhoto,
      showSchoolLogo,
    },
    {
      id: 1,
      quote: "The M3 program has transformed how I approach teaching. Understanding student misconceptions early has helped me design better lesson plans.",
      teacherName: "Rajesh Kumar",
      role: "Science Teacher",
      subject: "High School Physics",
      schoolName: "Delhi Public School",
      teacherPhoto: "https://images.unsplash.com/photo-1598975546110-65ec9e59e690?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      schoolLogo: schoolLogoUrl,
      eiAssetLogo: eiAssetLogoUrl,
      genwiseLogo: genwiseLogoUrl,
      size: selectedSize,
      theme: 'blue',
      showPhoto,
      showSchoolLogo,
    },
    {
      id: 2,
      quote: "M3 has given me the tools to turn mistakes into learning opportunities. My students are now more confident sharing their thinking process.",
      teacherName: "Anita Desai",
      role: "English Teacher",
      subject: "Primary School",
      schoolName: "Vidya Mandir",
      teacherPhoto: "https://images.unsplash.com/photo-1667035533110-7964092f44a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      schoolLogo: schoolLogoUrl,
      eiAssetLogo: eiAssetLogoUrl,
      genwiseLogo: genwiseLogoUrl,
      size: selectedSize,
      theme: 'white',
      showPhoto,
      showSchoolLogo,
    },
    {
      id: 3,
      quote: "This approach has revolutionized my classroom dynamics. Students engage more deeply with content when they know their misconceptions are valued.",
      role: "Senior Teacher",
      subject: "Mathematics",
      schoolName: "International School",
      eiAssetLogo: eiAssetLogoUrl,
      genwiseLogo: genwiseLogoUrl,
      size: selectedSize,
      theme: 'gradient',
      showPhoto: false,
      showSchoolLogo: false,
    },
  ];

  const handleExportCard = async (index: number) => {
    const cardElement = cardRefs.current[index];
    if (!cardElement) { toast.error('Card not found'); return; }
    setIsExporting(true);
    toast.loading('Generating high-resolution image…');
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(cardElement, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null, logging: false });
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const testimonial = sampleTestimonials[index];
          const fileName = `m3_testimonial_${testimonial.schoolName || 'card'}_${selectedSize}_${testimonial.theme}.png`.toLowerCase().replace(/\s+/g, '_');
          link.download = fileName;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          toast.dismiss();
          toast.success('Card exported!', { description: fileName, icon: <CheckCircle className="text-green-600" /> });
        }
      }, 'image/png');
    } catch {
      toast.dismiss();
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const BackButton = () => (
    <button onClick={() => setViewMode('hub')} className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-110 text-gray-700" title="Back to Hub">
      <ArrowLeft size={20} />
    </button>
  );

  if (viewMode === 'review') return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"><Toaster /><div className="py-12"><div className="max-w-7xl mx-auto px-6 mb-6"><BackButton /></div><DesignReview /></div></div>
  );

  if (viewMode === 'fullPreview') {
    const testimonial = sampleTestimonials[selectedCard];
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <Toaster />
        <div className="fixed top-6 left-6 z-50 flex gap-4">
          <BackButton />
          <button onClick={() => handleExportCard(selectedCard)} disabled={isExporting} className="flex items-center gap-2 px-6 py-3 bg-[#A01E21] text-white rounded-xl shadow-xl hover:shadow-2xl transition-all font-semibold disabled:opacity-50">
            {isExporting ? <><Loader2 size={20} className="animate-spin" />Exporting…</> : <><Download size={20} />Export PNG (2x)</>}
          </button>
        </div>
        <div className="shadow-2xl">
          <TestimonialCardImproved ref={(el) => (cardRefs.current[selectedCard] = el)} {...testimonial} />
        </div>
      </div>
    );
  }

  if (viewMode === 'm3Logos') return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"><Toaster /><div className="py-12"><div className="max-w-7xl mx-auto px-6 mb-6"><BackButton /></div><M3LogoShowcase /></div></div>
  );

  if (viewMode === 'brandLogos') return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"><Toaster /><div className="py-12"><div className="max-w-7xl mx-auto px-6 mb-6"><BackButton /></div><BrandLogoShowcase /></div></div>
  );

  if (viewMode === 'batch') return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"><Toaster /><div className="py-12"><div className="max-w-7xl mx-auto px-6 mb-6"><BackButton /></div><TestimonialBatchGenerator testimonials={exampleTestimonials} /></div></div>
  );

  if (viewMode === 'videoSlides') return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"><Toaster /><div className="py-12"><div className="max-w-7xl mx-auto px-6 mb-6"><BackButton /></div><SlideTemplateBrowser /></div></div>
  );

  if (viewMode === 'logoCropper') return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"><Toaster /><div className="py-12"><div className="max-w-7xl mx-auto px-6 mb-6"><BackButton /></div><LogoCropper /></div></div>
  );

  // HUB VIEW
  if (viewMode === 'hub') return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-red-900 to-gray-900 py-16 px-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <Sparkles className="w-12 h-12 text-yellow-400" />
            <h1 className="text-7xl font-black text-white">M3 Collateral Kit</h1>
            <Sparkles className="w-12 h-12 text-yellow-400" />
          </div>
          <p className="text-2xl text-gray-200 max-w-3xl mx-auto font-medium">Professional marketing materials for My Misconception Mentor</p>
          <p className="text-lg text-gray-300 mt-3">Create testimonial cards, video slides, and access brand assets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[
            { mode: 'testimonialCards' as ViewMode, label: 'Testimonial Cards', desc: 'Social media cards showcasing teacher feedback', icon: FileText, color: 'from-red-700 to-red-900', bullets: ['Multiple size variants', 'Custom themes', 'Export PNG (2x)'] },
            { mode: 'videoSlides' as ViewMode, label: 'Video Slides', desc: 'Professional slide templates for testimonial videos', icon: Video, color: 'from-blue-700 to-blue-900', bullets: ['16:9 & 9:16 formats', 'Intro, trust, contact slides', 'Batch ZIP export'] },
            { mode: 'm3Logos' as ViewMode, label: 'M3 Logos', desc: 'Official M3 logo variants and usage guidelines', icon: Palette, color: 'from-yellow-600 to-orange-600', bullets: ['Badge & lockup styles', 'Multiple themes', 'SVG downloads'] },
            { mode: 'brandLogos' as ViewMode, label: 'Brand Logos', desc: 'Ei ASSET and GenWise brand assets', icon: Image, color: 'from-red-700 to-blue-700', bullets: ['Both brand logos', 'Color variants', 'Brand guidelines'] },
            { mode: 'batch' as ViewMode, label: 'Batch Generator', desc: 'Generate multiple testimonial cards at once', icon: Grid3x3, color: 'from-green-600 to-emerald-700', bullets: ['Bulk creation', 'CSV import', 'Mass export'] },
            { mode: 'review' as ViewMode, label: 'Design Review', desc: 'Critical UX analysis and design decisions', icon: Eye, color: 'from-purple-600 to-pink-600', bullets: ['Best practices', 'Accessibility', 'Readability'] },
            { mode: 'logoCropper' as ViewMode, label: 'Logo Cropper', desc: 'Crop and resize logos for consistent branding', icon: Scissors, color: 'from-gray-500 to-gray-800', bullets: ['Multiple formats', 'High resolution', 'Brand compliance'] },
          ].map(({ mode, label, desc, icon: Icon, color, bullets }) => (
            <button key={mode} onClick={() => setViewMode(mode)} className="group bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-10 hover:bg-white/15 hover:border-white/30 hover:scale-105 transition-all shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white mb-4">{label}</h2>
                <p className="text-gray-300 font-medium mb-4">{desc}</p>
                <div className="text-sm text-gray-400 space-y-1">{bullets.map(b => <div key={b}>✓ {b}</div>)}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 inline-block">
            <p className="text-gray-300 text-lg font-medium mb-2">
              <strong className="text-white">Brand Colors:</strong> Crimson #A01E21 · Blue #1848A0 · Yellow #FFB700
            </p>
            <p className="text-gray-400 text-sm">All materials follow Ei and GenWise brand guidelines with Poppins font</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Testimonial Cards view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="mb-6"><BackButton /></div>
          <DesignReview />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customize Your Card</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Size</label>
              <div className="space-y-2">
                {(['square', 'landscape', 'story', 'compact'] as CardSize[]).map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedSize === size ? 'bg-[#A01E21] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                    <span className="block text-xs opacity-80">
                      {size === 'square' && '1080×1080'}{size === 'landscape' && '1200×628'}{size === 'story' && '1080×1920'}{size === 'compact' && '600×400'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Theme</label>
              <div className="space-y-2">
                {(['crimson', 'white', 'blue', 'gradient'] as CardTheme[]).map(theme => (
                  <button key={theme} onClick={() => setSelectedTheme(theme)} className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTheme === theme ? 'bg-[#A01E21] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Options</label>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showPhoto} onChange={e => setShowPhoto(e.target.checked)} className="w-5 h-5 accent-[#A01E21]" />
                  <span className="text-sm text-gray-700 font-medium">Show Teacher Photo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showSchoolLogo} onChange={e => setShowSchoolLogo(e.target.checked)} className="w-5 h-5 accent-[#A01E21]" />
                  <span className="text-sm text-gray-700 font-medium">Show School Logo</span>
                </label>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-4 text-white">
              <h3 className="font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} />Key Improvements</h3>
              <div className="space-y-1 text-sm">
                <div>✓ 42px quote text (readable!)</div>
                <div>✓ 70px padding (breathing room)</div>
                <div>✓ Smart quote truncation</div>
                <div>✓ Real PNG export (2x)</div>
                <div>✓ Prominent attribution</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {sampleTestimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{testimonial.teacherName || 'Sample Card'} - {testimonial.theme}</h3>
                <div className="flex gap-2">
                  <button onClick={() => { setSelectedCard(index); setViewMode('fullPreview'); }} className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                    <ZoomIn size={16} />Preview
                  </button>
                  <button onClick={() => handleExportCard(index)} disabled={isExporting} className="flex items-center gap-2 px-4 py-2 bg-[#1848A0] text-white rounded-lg hover:bg-[#143a85] transition-colors text-sm font-medium disabled:opacity-50">
                    {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}Export
                  </button>
                </div>
              </div>
              <div className="overflow-hidden bg-gray-100 rounded-lg">
                <div style={{ transform: 'scale(0.38)', transformOrigin: 'top left', width: '263%', height: '263%' }}>
                  <TestimonialCardImproved ref={(el) => (cardRefs.current[index] = el)} {...testimonial} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
