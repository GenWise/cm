import React from 'react';
import { EiAssetLogo, GenWiseLogo } from './LogoAssets';

export const BrandLogoShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Brand Logo Showcase
        </h1>
        <p className="text-gray-600 mb-12 text-lg">
          Ei ASSET (original on all backgrounds) & GenWise (with white variant for dark backgrounds)
        </p>

        {/* Ei ASSET Logos */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Ei ASSET Logo
          </h2>
          <p className="text-gray-600 mb-6">Original logo with built-in background - works on all surfaces</p>
          
          <div className="grid gap-8">
            {/* On White Background */}
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 mb-6">On White Background</p>
              <div className="flex gap-8 items-center flex-wrap">
                <EiAssetLogo height={40} />
                <EiAssetLogo height={60} />
                <EiAssetLogo height={80} />
              </div>
            </div>

            {/* On Crimson Background */}
            <div className="bg-[#A01E21] p-12 rounded-xl shadow-sm">
              <p className="text-sm font-semibold text-white/80 mb-6">On Crimson Background</p>
              <div className="flex gap-8 items-center flex-wrap">
                <EiAssetLogo height={40} />
                <EiAssetLogo height={60} />
                <EiAssetLogo height={80} />
              </div>
            </div>

            {/* On Blue Background */}
            <div className="bg-[#1848A0] p-12 rounded-xl shadow-sm">
              <p className="text-sm font-semibold text-white/80 mb-6">On Blue Background</p>
              <div className="flex gap-8 items-center flex-wrap">
                <EiAssetLogo height={40} />
                <EiAssetLogo height={60} />
                <EiAssetLogo height={80} />
              </div>
            </div>

            {/* On Gradient Background */}
            <div className="bg-gradient-to-r from-[#A01E21] to-[#1848A0] p-12 rounded-xl shadow-sm">
              <p className="text-sm font-semibold text-white/80 mb-6">On Gradient Background</p>
              <div className="flex gap-8 items-center flex-wrap">
                <EiAssetLogo height={40} />
                <EiAssetLogo height={60} />
                <EiAssetLogo height={80} />
              </div>
            </div>
          </div>
        </section>

        {/* GenWise Logos */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            GenWise Logo with Variants
          </h2>
          <p className="text-gray-600 mb-6">Default variant for light backgrounds, White variant for dark backgrounds (preserving the orange circle)</p>
          
          <div className="grid gap-8">
            {/* Default - On White Background */}
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 mb-6">Default Variant - On White Background</p>
              <div className="flex gap-8 items-center flex-wrap">
                <GenWiseLogo variant="default" height={40} />
                <GenWiseLogo variant="default" height={60} />
                <GenWiseLogo variant="default" height={80} />
              </div>
            </div>

            {/* White variant - On Crimson Background */}
            <div className="bg-[#A01E21] p-12 rounded-xl shadow-sm">
              <p className="text-sm font-semibold text-white/80 mb-6">White Variant - On Crimson Background (Orange circle preserved)</p>
              <div className="flex gap-8 items-center flex-wrap">
                <GenWiseLogo variant="white" height={40} />
                <GenWiseLogo variant="white" height={60} />
                <GenWiseLogo variant="white" height={80} />
              </div>
            </div>

            {/* White variant - On Blue Background */}
            <div className="bg-[#1848A0] p-12 rounded-xl shadow-sm">
              <p className="text-sm font-semibold text-white/80 mb-6">White Variant - On Blue Background (Orange circle preserved)</p>
              <div className="flex gap-8 items-center flex-wrap">
                <GenWiseLogo variant="white" height={40} />
                <GenWiseLogo variant="white" height={60} />
                <GenWiseLogo variant="white" height={80} />
              </div>
            </div>

            {/* White variant - On Gradient Background */}
            <div className="bg-gradient-to-r from-[#A01E21] to-[#1848A0] p-12 rounded-xl shadow-sm">
              <p className="text-sm font-semibold text-white/80 mb-6">White Variant - On Gradient Background (Orange circle preserved)</p>
              <div className="flex gap-8 items-center flex-wrap">
                <GenWiseLogo variant="white" height={40} />
                <GenWiseLogo variant="white" height={60} />
                <GenWiseLogo variant="white" height={80} />
              </div>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Usage Guidelines
          </h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>🎨 Ei ASSET:</strong> Original logo with built-in background - use as-is on all backgrounds</p>
            <p><strong>✨ GenWise Default:</strong> Use on white or light backgrounds</p>
            <p><strong>⚪ GenWise White:</strong> Use on dark backgrounds (Crimson, Blue, Gradient) - orange circle always preserved</p>
            <p><strong>📏 Sizing:</strong> Both logos automatically scale while maintaining aspect ratio</p>
            <p><strong>🔄 Auto-switching:</strong> Testimonial cards automatically use the correct variant based on theme</p>
          </div>
        </section>
      </div>
    </div>
  );
};