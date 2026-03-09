import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export const DesignReview: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Critical UI/UX Review</h2>
        
        {/* Critical Issues */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="text-red-600" size={24} />
            <h3 className="text-xl font-bold text-red-600">Critical Issues</h3>
          </div>
          <div className="space-y-4 ml-8">
            <div className="border-l-4 border-red-600 pl-4 py-2">
              <h4 className="font-semibold text-gray-900">1. Text Size Too Small for Social Media</h4>
              <p className="text-gray-700 mt-1">
                Quote text at 20px on a 1080×1080 canvas is only ~1.85% of canvas height. 
                On mobile Instagram (where most users view), this will be illegible. 
                <span className="font-semibold"> Recommended: 36-48px (3.3-4.4% of height)</span>
              </p>
            </div>

            <div className="border-l-4 border-red-600 pl-4 py-2">
              <h4 className="font-semibold text-gray-900">2. "Show More" Doesn't Work for Static Exports</h4>
              <p className="text-gray-700 mt-1">
                Social media posts are static images. The interactive expand/collapse is useless for the primary use case. 
                Long quotes should either be <span className="font-semibold">truncated intelligently or split into carousel slides</span>.
              </p>
            </div>

            <div className="border-l-4 border-red-600 pl-4 py-2">
              <h4 className="font-semibold text-gray-900">3. Demo Cards Are Unreadable</h4>
              <p className="text-gray-700 mt-1">
                Cards scaled to 0.35 (35%) make it impossible to evaluate actual readability and design. 
                Should show <span className="font-semibold">full-size preview with zoom/download</span> functionality.
              </p>
            </div>

            <div className="border-l-4 border-red-600 pl-4 py-2">
              <h4 className="font-semibold text-gray-900">4. Export Button is Fake</h4>
              <p className="text-gray-700 mt-1">
                The "Export" button doesn't actually export anything. Users need real functionality to 
                <span className="font-semibold"> download as PNG at 2x resolution</span> for retina displays.
              </p>
            </div>

            <div className="border-l-4 border-red-600 pl-4 py-2">
              <h4 className="font-semibold text-gray-900">5. Quote Marks Compete with Content</h4>
              <p className="text-gray-700 mt-1">
                Large filled quote icons (60px) with 40% opacity still dominate. They should be 
                <span className="font-semibold"> subtle decorative elements, not focal points</span>. Consider outline-only or smaller size.
              </p>
            </div>
          </div>
        </div>

        {/* Major Issues */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-orange-600" size={24} />
            <h3 className="text-xl font-bold text-orange-600">Major Issues</h3>
          </div>
          <div className="space-y-4 ml-8">
            <div className="border-l-4 border-orange-600 pl-4 py-2">
              <h4 className="font-semibold text-gray-900">6. Weak Visual Hierarchy</h4>
              <p className="text-gray-700 mt-1">
                Quote, teacher name, school name, and M3 badge all compete for attention. 
                <span className="font-semibold"> Quote should be dominant</span>, followed by attribution. 
                Currently, everything feels equal weight.
              </p>
            </div>

            <div className="border-l-4 border-orange-600 pl-4 py-2">
              <h4 className="font-semibold text-gray-900">7. Top Section is Cluttered</h4>
              <p className="text-gray-700 mt-1">
                Three elements (Ei logo, M3 badge, GenWise logo) in the header creates visual noise. 
                Consider <span className="font-semibold">consolidating or reducing logo sizes</span>.
              </p>
            </div>

            <div className="border-l-4 border-orange-600 pl-4 py-2">
              <h4 className="font-semibold text-gray-900">8. Attribution Section Too Small</h4>
              <p className="text-gray-700 mt-1">
                Teacher name at 18px and school at 16px feel like afterthoughts. 
                These are <span className="font-semibold">social proof elements and should be prominent</span>.
              </p>
            </div>

            <div className="border-l-4 border-orange-600 pl-4 py-2">
              <h4 className="font-semibold text-gray-900">9. Font Weights Not Following Brand</h4>
              <p className="text-gray-700 mt-1">
                Brief specified "Bold/Black for headlines" but using fontWeight 600 (SemiBold). 
                Should use <span className="font-semibold">700 (Bold) or 900 (Black)</span> for teacher names.
              </p>
            </div>

            <div className="border-l-4 border-orange-600 pl-4 py-2">
              <h4 className="font-semibold text-gray-900">10. Insufficient Padding for Large Format</h4>
              <p className="text-gray-700 mt-1">
                32px padding on a 1080px canvas is only 3%. Feels cramped. 
                <span className="font-semibold"> Recommended: 60-80px (5.5-7.4%)</span> for breathing room.
              </p>
            </div>
          </div>
        </div>

        {/* Minor Issues */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-yellow-600" size={24} />
            <h3 className="text-xl font-bold text-yellow-600">Minor Issues</h3>
          </div>
          <div className="space-y-4 ml-8">
            <div className="border-l-4 border-yellow-600 pl-4 py-2">
              <h4 className="font-semibold text-gray-900">11. Accessibility Concerns</h4>
              <p className="text-gray-700 mt-1">
                Yellow (#FFB700) on white background would fail WCAG AA contrast (2.08:1, needs 4.5:1). 
                OK for accents, but <span className="font-semibold">never use for critical text</span>.
              </p>
            </div>

            <div className="border-l-4 border-yellow-600 pl-4 py-2">
              <h4 className="font-semibold text-gray-900">12. Teacher Photo Size</h4>
              <p className="text-gray-700 mt-1">
                64px (6% of width) is small. Social proof increases with larger, more visible faces. 
                <span className="font-semibold">Consider 80-96px</span> for more impact.
              </p>
            </div>

            <div className="border-l-4 border-yellow-600 pl-4 py-2">
              <h4 className="font-semibold text-gray-900">13. M3 Badge Position</h4>
              <p className="text-gray-700 mt-1">
                Center-top placement interrupts natural F-pattern eye flow. 
                <span className="font-semibold">Consider top-right corner or integrated with one logo</span>.
              </p>
            </div>

            <div className="border-l-4 border-yellow-600 pl-4 py-2">
              <h4 className="font-semibold text-gray-900">14. Line Height Could Be Tighter</h4>
              <p className="text-gray-700 mt-1">
                1.6 line-height is good for body text, but for display/quote text, 
                <span className="font-semibold"> 1.4-1.5 creates better visual cohesion</span>.
              </p>
            </div>

            <div className="border-l-4 border-yellow-600 pl-4 py-2">
              <h4 className="font-semibold text-gray-900">15. No Loading States or Feedback</h4>
              <p className="text-gray-700 mt-1">
                When "exporting", users get no visual feedback. Need <span className="font-semibold">loading indicators and success messages</span>.
              </p>
            </div>
          </div>
        </div>

        {/* What Works Well */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-green-600" size={24} />
            <h3 className="text-xl font-bold text-green-600">What Works Well</h3>
          </div>
          <div className="space-y-2 ml-8">
            <p className="text-gray-700">✅ Brand colors accurately implemented</p>
            <p className="text-gray-700">✅ Poppins font properly loaded and applied</p>
            <p className="text-gray-700">✅ Multiple theme variants provide flexibility</p>
            <p className="text-gray-700">✅ Size presets match social media requirements</p>
            <p className="text-gray-700">✅ Component is properly typed with TypeScript</p>
            <p className="text-gray-700">✅ Clean separation of concerns (component vs demo)</p>
            <p className="text-gray-700">✅ Optional elements (photo, logo) work correctly</p>
            <p className="text-gray-700">✅ Motion animations are subtle and professional</p>
          </div>
        </div>
      </div>

      {/* Recommendations Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Priority Fixes</h3>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-lg mb-2">🔴 High Priority</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Increase quote text size to 36-48px for readability</li>
              <li>Implement actual PNG export with html2canvas or similar</li>
              <li>Add full-size preview mode with zoom capability</li>
              <li>Increase padding to 60-80px for proper breathing room</li>
              <li>Redesign quote marks to be more subtle</li>
            </ol>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-lg mb-2">🟡 Medium Priority</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Strengthen visual hierarchy (larger attribution section)</li>
              <li>Use correct font weights (Bold/Black for names)</li>
              <li>Simplify header logo arrangement</li>
              <li>Increase teacher photo size to 80-96px</li>
              <li>Tighten line-height to 1.4-1.5 for quote text</li>
            </ol>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-lg mb-2">🟢 Nice to Have</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Add carousel mode for multi-slide long quotes</li>
              <li>Implement smart quote truncation algorithm</li>
              <li>Add copy-to-clipboard for quote text</li>
              <li>Create dark mode variant</li>
              <li>Add animation presets for Instagram Stories</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
