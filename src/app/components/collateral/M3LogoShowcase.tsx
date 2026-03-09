import React from 'react';
import { M3Logo } from './M3Logo';

export const M3LogoShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          M³ Logo Variations
        </h1>
        <p className="text-gray-600 mb-12 text-lg">
          My Misconception Mentor - Professional Development Program
        </p>

        {/* Full Logo Variants */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Full Logo (with name)
          </h2>
          <div className="grid gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 mb-4">Crimson Theme</p>
              <M3Logo variant="full" theme="crimson" height={80} />
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 mb-4">Blue Theme</p>
              <M3Logo variant="full" theme="blue" height={80} />
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 mb-4">Gradient Theme</p>
              <M3Logo variant="full" theme="gradient" height={80} />
            </div>
            <div className="bg-gray-900 p-8 rounded-xl shadow-sm">
              <p className="text-sm font-semibold text-gray-400 mb-4">White Theme (for dark backgrounds)</p>
              <M3Logo variant="full" theme="white" height={80} />
            </div>
          </div>
        </section>

        {/* Stacked Logo Variants */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Stacked Logo (vertical layout)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex justify-center">
              <M3Logo variant="stacked" theme="crimson" height={120} />
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex justify-center">
              <M3Logo variant="stacked" theme="gradient" height={120} />
            </div>
          </div>
        </section>

        {/* Badge Variants */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Badge Version (compact, for social media)
          </h2>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="flex gap-8 items-center justify-center flex-wrap">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 text-center">Crimson</p>
                <M3Logo variant="badge" theme="crimson" height={100} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 text-center">Blue</p>
                <M3Logo variant="badge" theme="blue" height={100} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 text-center">Yellow</p>
                <M3Logo variant="badge" theme="yellow" height={100} />
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <p className="text-xs font-semibold text-gray-400 mb-2 text-center">White</p>
                <M3Logo variant="badge" theme="white" height={100} />
              </div>
            </div>
          </div>
        </section>

        {/* Icon Variants */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Icon Only (app icons, small spaces)
          </h2>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="flex gap-8 items-center justify-center flex-wrap">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 text-center">Crimson</p>
                <M3Logo variant="icon" theme="crimson" height={80} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 text-center">Blue</p>
                <M3Logo variant="icon" theme="blue" height={80} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 text-center">Yellow</p>
                <M3Logo variant="icon" theme="yellow" height={80} />
              </div>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Recommended Usage
          </h2>
          <div className="grid gap-4 text-gray-700">
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">🎯 Full Logo</h3>
              <p>Use for: Website headers, presentations, official documents, letterheads</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
              <h3 className="font-bold text-purple-900 mb-2">📱 Stacked Logo</h3>
              <p>Use for: Mobile headers, narrow spaces, promotional materials, posters</p>
            </div>
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <h3 className="font-bold text-green-900 mb-2">⭐ Badge</h3>
              <p>Use for: Social media profile pictures, testimonial cards (current use!), certificates, stickers</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
              <h3 className="font-bold text-amber-900 mb-2">💡 Icon</h3>
              <p>Use for: App icons, favicons, very small spaces, loading spinners</p>
            </div>
          </div>
        </section>

        {/* Design Concept */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Design Concept
          </h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>💡 Lightbulb Symbol:</strong> Represents the "aha moment" when misconceptions are cleared and understanding is achieved</p>
            <p><strong>✓ Checkmark:</strong> Symbolizes correct understanding and the removal of errors in thinking</p>
            <p><strong>M³:</strong> Clean, bold typography emphasizing the three M's (My Misconception Mentor)</p>
            <p><strong>Color Palette:</strong> Uses Ei ASSET brand colors - Crimson (#A01E21), Blue (#1848A0), Yellow (#FFB700)</p>
            <p><strong>Professional & Educational:</strong> Designed to convey trust, clarity, and expertise in professional development</p>
          </div>
        </section>
      </div>
    </div>
  );
};
