import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { Download, Grid3x3, List, Archive, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { EiAssetLogo, GenWiseLogo } from './LogoAssets';
import { M3Logo } from './M3Logo';
import { getCroppedLogoStyle } from './CroppedSchoolLogos';

// Import school logos
import gemsLogo from '../../../assets/5847ffa798b8c146c3c221156acaec26115d3fb5.png';
import millenniumLogo from '../../../assets/1f07f3d5c31bce9975933f7cbfed7f50a0f03a05.png';
import pictLogo from '../../../assets/e3d0f8f7b7290d061ede9f517b44121bf9846d95.png';
import psbbLogo from '../../../assets/958bf515bfbaa4b45ac954b2a92c874737508d15.png';
import sanskritiLogo from '../../../assets/d24d25bf1536ea98bae4b99e75b31ad817df55b7.png';
import shivNadarLogo from '../../../assets/1ff4f1851d120f35945f30bef59a7c31a7a13778.png';
import gearLogo from '../../../assets/4ace1a3eca57e491bdfbc4434550d4c95bd2b5a3.png';
import sriKumaranLogo from '../../../assets/5cf8e7c03368e1f1f780f5ba0e618e049183ff68.png';
import tvsLogo from '../../../assets/941fdc1771d7c7bcfb9bdaa4ea07189007cbde6c.png';

// Brand Colors
const COLORS = {
  crimson: '#A01E21',
  blue: '#1848A0',
  yellow: '#FFB700',
  cream: '#FFF8ED',
  white: '#FFFFFF',
  darkGray: '#2C2C2C',
  lightGray: '#F5F5F5',
};

// Logo Components - using actual imported logos
const LogoComponents = {
  EiAsset: ({ height = 48, variant = 'default' as 'default' | 'white' }: { height?: number; variant?: 'default' | 'white' }) => (
    <div style={{ height: `${height}px` }} className="flex items-center">
      <EiAssetLogo height={height} variant={variant === 'white' ? 'white' : 'default'} />
    </div>
  ),
  GenWise: ({ height = 48, variant = 'default' as 'default' | 'white' }: { height?: number; variant?: 'default' | 'white' }) => (
    <div style={{ height: `${height}px` }} className="flex items-center">
      <GenWiseLogo height={height} variant={variant} />
    </div>
  ),
  M3Badge: ({ height = 80, theme = 'blue' as any }: { height?: number; theme?: any }) => (
    <div style={{ height: `${height}px` }} className="flex items-center">
      <M3Logo variant="badge" theme={theme} height={height} />
    </div>
  ),
};

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type SlideType = 'intro' | 'trust' | 'transition' | 'contact' | 'testimonialProfile';
export type SlideVariant = 'default' | 'cinematic';

export interface IntroSlideData {
  type: 'intro';
  title: string;
  subtitle?: string;
  assetPoints?: string[];
  genWisePoints?: string[];
  tagline?: string;
}

export interface TrustSlideData {
  type: 'trust';
  title: string;
  subtitle?: string;
  schoolLogos?: string[];
  stats?: { label: string; value: string }[];
}

export interface TransitionSlideData {
  type: 'transition';
  title: string;
  description?: string;
}

export interface ContactSlideData {
  type: 'contact';
  title?: string;
  contacts: Array<{
    name: string;
    email: string;
    phone: string;
  }>;
  footer?: string;
  websiteUrl?: string;
}

export interface TestimonialProfileSlideData {
  type: 'testimonialProfile';
  teacherName: string;
  teacherRole: string;
  schoolName: string;
  thumbnailImage?: string;
  title?: string;
}

export type SlideData = 
  | IntroSlideData 
  | TrustSlideData 
  | TransitionSlideData 
  | ContactSlideData
  | TestimonialProfileSlideData;

export interface VideoSlideProps {
  data: SlideData;
  variant?: SlideVariant;
  showLogos?: boolean;
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:3';
}

// ============================================================================
// INTRO SLIDE TEMPLATES
// ============================================================================

const IntroSlideDefault: React.FC<{ data: IntroSlideData; isPortrait?: boolean }> = ({ data, isPortrait }) => {
  if (isPortrait) {
    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${COLORS.cream} 0%, ${COLORS.white} 100%)` }}>
        {/* Header Logos */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
          <LogoComponents.EiAsset height={36} />
          <LogoComponents.GenWise height={36} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center h-full px-10 py-24">
          {/* M3 Badge */}
          <div className="mb-8">
            <LogoComponents.M3Badge height={100} theme="blue" />
          </div>

          <h1 className="text-5xl font-black text-blue mb-4 text-center leading-tight tracking-tight">
            {data.title}
          </h1>
          {data.subtitle && (
            <p className="text-xl text-darkGray mb-12 text-center max-w-md font-medium">
              {data.subtitle}
            </p>
          )}

          {/* Feature Sections - Stacked */}
          <div className="w-full space-y-6 mt-8">
            {data.assetPoints && (
              <div className="bg-gradient-to-br from-crimson to-red-800 text-white rounded-3xl p-6 shadow-2xl">
                <h3 className="text-2xl font-bold mb-4">Ei ASSET</h3>
                <div className="space-y-2">
                  {data.assetPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-1.5 flex-shrink-0" />
                      <p className="text-sm leading-snug">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.genWisePoints && (
              <div className="text-white rounded-3xl p-6 shadow-2xl" style={{ background: 'linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%)' }}>
                <h3 className="text-2xl font-bold mb-4">GenWise</h3>
                <div className="space-y-2">
                  {data.genWisePoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-1.5 flex-shrink-0" />
                      <p className="text-sm leading-snug">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {data.tagline && (
            <p className="text-lg font-bold text-blue mt-10 text-center">
              {data.tagline}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Landscape Version
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${COLORS.cream} 0%, ${COLORS.white} 100%)` }}>
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue opacity-5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-crimson opacity-5 rounded-full blur-3xl" />

      {/* Header Logos */}
      <div className="absolute top-6 left-12 right-12 flex justify-between items-center z-20">
        <LogoComponents.EiAsset height={36} />
        <LogoComponents.GenWise height={36} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-full px-16 pt-16 pb-6 relative z-10">
        {/* M3 Badge */}
        <div className="mb-4 flex-shrink-0">
          <LogoComponents.M3Badge height={85} theme="blue" />
        </div>

        <h1 className="text-5xl font-black text-blue mb-3 text-center leading-tight tracking-tight">
          {data.title}
        </h1>
        {data.subtitle && (
          <p className="text-xl text-darkGray mb-6 text-center max-w-3xl font-medium">
            {data.subtitle}
          </p>
        )}

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-5xl flex-shrink-0">
          {data.assetPoints && (
            <div className="bg-gradient-to-br from-crimson to-red-800 text-white rounded-3xl p-6 shadow-2xl">
              <h3 className="text-2xl font-bold mb-4">Ei ASSET</h3>
              <div className="space-y-2.5">
                {data.assetPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.genWisePoints && (
            <div className="text-white rounded-3xl p-6 shadow-2xl" style={{ background: 'linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%)' }}>
              <h3 className="text-2xl font-bold mb-4">GenWise</h3>
              <div className="space-y-2.5">
                {data.genWisePoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {data.tagline && (
          <p className="text-xl font-bold text-blue mt-5 text-center flex-shrink-0">
            {data.tagline}
          </p>
        )}
      </div>
    </div>
  );
};

const IntroSlideCinematic: React.FC<{ data: IntroSlideData; isPortrait?: boolean }> = ({ data, isPortrait }) => {
  return (
    <div 
      className="w-full h-full relative overflow-hidden flex flex-col"
      style={{
        background: `linear-gradient(135deg, ${COLORS.crimson} 0%, ${COLORS.blue} 50%, #FF8C00 100%)`
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Content - Centered with proper spacing */}
      <div className="flex-1 flex items-center justify-center text-center text-white z-10 px-16 pb-20">
        <div className="max-w-5xl">
          <div className="mb-6">
            <LogoComponents.M3Badge height={isPortrait ? 100 : 120} theme="white" />
          </div>
          
          <h1 className={`font-black mb-6 leading-tight ${isPortrait ? 'text-5xl' : 'text-7xl'}`}>
            {data.title}
          </h1>
          
          {data.subtitle && (
            <p className={`mb-10 font-semibold opacity-95 ${isPortrait ? 'text-xl' : 'text-3xl'}`}>
              {data.subtitle}
            </p>
          )}

          {data.tagline && (
            <div className="bg-white/15 backdrop-blur-xl rounded-full px-10 py-5 inline-block border-2 border-white/30">
              <p className={`font-bold ${isPortrait ? 'text-xl' : 'text-2xl'} leading-tight`}>
                Evidence-led PD.<br />
                Outcome-led teaching.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Logos */}
      <div className={`absolute ${isPortrait ? 'bottom-8' : 'bottom-10'} left-16 right-16 flex justify-between items-center z-20`}>
        <LogoComponents.EiAsset height={isPortrait ? 32 : 40} />
        <LogoComponents.GenWise height={isPortrait ? 32 : 40} variant="white" />
      </div>
    </div>
  );
};

// ============================================================================
// TRUST/SOCIAL PROOF SLIDE TEMPLATES WITH ANIMATIONS
// ============================================================================

const TrustSlideDefault: React.FC<{ data: TrustSlideData; isPortrait?: boolean }> = ({ data, isPortrait }) => {
  if (isPortrait) {
    return (
      <div className="w-full h-full bg-white flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
          <LogoComponents.EiAsset height={32} />
          <LogoComponents.GenWise height={32} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-8 py-10">
          <h1 className="text-4xl font-black text-blue text-center mb-3 leading-tight">{data.title}</h1>
          {data.subtitle && (
            <p className="text-base text-darkGray text-center mb-8 font-medium">{data.subtitle}</p>
          )}

          {/* Accent Banner */}
          <div className="text-white text-center py-4 mb-8 rounded-xl shadow-lg" style={{ background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.crimson} 100%)` }}>
            <h2 className="text-xl font-bold">Trusted by Leading Schools</h2>
          </div>

          {/* School Logos Grid - 3x3 for 9 logos - Increased height by 1/3 */}
          {data.schoolLogos && data.schoolLogos.length > 0 && (
            <div className="space-y-3 mb-4">
              {/* Row 1: Horizontal logos - GEMS, Millennium */}
              <div className="grid grid-cols-2 gap-3">
                {[0, 1].map((idx) => {
                  const cropStyle = getCroppedLogoStyle(idx);
                  return (
                    <div 
                      key={idx} 
                      className="bg-cream rounded-xl p-2 flex items-center justify-center h-24 border border-gray-200 animate-fadeInUp overflow-hidden"
                      style={{ 
                        animationDelay: `${idx * 0.1}s`,
                        animationFillMode: 'backwards'
                      }}
                    >
                      <img 
                        src={data.schoolLogos[idx]} 
                        alt={`School ${idx + 1}`} 
                        style={{
                          objectFit: cropStyle.objectFit,
                          objectPosition: cropStyle.objectPosition,
                          transform: `scale(${cropStyle.scale})`,
                          padding: cropStyle.padding,
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Row 2: Horizontal logos - GEAR, Sri Kumaran */}
              <div className="grid grid-cols-2 gap-3">
                {[6, 7].map((idx) => {
                  const cropStyle = getCroppedLogoStyle(idx);
                  return (
                    <div 
                      key={idx} 
                      className="bg-cream rounded-xl p-2 flex items-center justify-center h-24 border border-gray-200 animate-fadeInUp overflow-hidden"
                      style={{ 
                        animationDelay: `${idx * 0.1}s`,
                        animationFillMode: 'backwards'
                      }}
                    >
                      <img 
                        src={data.schoolLogos[idx]} 
                        alt={`School ${idx + 1}`} 
                        style={{
                          objectFit: cropStyle.objectFit,
                          objectPosition: cropStyle.objectPosition,
                          transform: `scale(${cropStyle.scale})`,
                          padding: cropStyle.padding,
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Row 3: Square logos - PICT, PSBB, Sanskriti */}
              <div className="grid grid-cols-3 gap-3">
                {[2, 3, 4].map((idx) => {
                  const cropStyle = getCroppedLogoStyle(idx);
                  return (
                    <div 
                      key={idx} 
                      className="bg-cream rounded-xl p-2 flex items-center justify-center h-24 border border-gray-200 animate-fadeInUp overflow-hidden"
                      style={{ 
                        animationDelay: `${idx * 0.1}s`,
                        animationFillMode: 'backwards'
                      }}
                    >
                      <img 
                        src={data.schoolLogos[idx]} 
                        alt={`School ${idx + 1}`} 
                        style={{
                          objectFit: cropStyle.objectFit,
                          objectPosition: cropStyle.objectPosition,
                          transform: `scale(${cropStyle.scale})`,
                          padding: cropStyle.padding,
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Row 4: Square logos - Shiv Nadar, TVS (centered) */}
              <div className="flex justify-center gap-3">
                {[5, 8].map((idx) => {
                  const cropStyle = getCroppedLogoStyle(idx);
                  return (
                    <div 
                      key={idx} 
                      className="bg-cream rounded-xl p-2 flex items-center justify-center h-24 border border-gray-200 animate-fadeInUp overflow-hidden"
                      style={{ 
                        width: 'calc(33.333% - 0.5rem)', // Match the width of items in 3-column grid
                        animationDelay: `${idx * 0.1}s`,
                        animationFillMode: 'backwards'
                      }}
                    >
                      <img 
                        src={data.schoolLogos[idx]} 
                        alt={`School ${idx + 1}`} 
                        style={{
                          objectFit: cropStyle.objectFit,
                          objectPosition: cropStyle.objectPosition,
                          transform: `scale(${cropStyle.scale})`,
                          padding: cropStyle.padding,
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stats - Fixed positioning with more top margin */}
          {data.stats && data.stats.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-6">
              {data.stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="text-center bg-gradient-to-br from-blue/10 to-crimson/10 rounded-xl py-4 animate-fadeInUp"
                  style={{ 
                    animationDelay: `${0.5 + (idx * 0.1)}s`,
                    animationFillMode: 'backwards'
                  }}
                >
                  <div className="text-3xl font-black mb-1" style={{ color: COLORS.crimson }}>{stat.value}</div>
                  <div className="text-xs font-semibold" style={{ color: COLORS.darkGray }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Landscape Version
  return (
    <div className="w-full h-full bg-white flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue/5 rounded-full blur-3xl" />

      {/* Header: EI + GW logos */}
      <div className="flex justify-between items-center px-10 pt-4 pb-2 relative z-10">
        <LogoComponents.EiAsset height={34} />
        <LogoComponents.GenWise height={34} />
      </div>

      {/* Title + subtitle */}
      <div className="text-center px-10 pb-2 relative z-10">
        <h1 className="text-2xl font-black leading-tight" style={{ color: COLORS.blue }}>{data.title}</h1>
        {data.subtitle && <p className="text-sm font-medium mt-1" style={{ color: COLORS.darkGray }}>{data.subtitle}</p>}
      </div>

      {/* Accent Banner */}
      <div className="text-white text-center py-2 mx-10 mb-3 rounded-xl shadow-lg relative z-10" style={{ background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.crimson} 100%)` }}>
        <h2 className="text-sm font-bold tracking-wide">Trusted by Leading Schools</h2>
      </div>

      {/* School Logos Grid — 3×3 full width, large cells */}
      {data.schoolLogos && data.schoolLogos.length > 0 && (
        <div className="flex-1 grid grid-cols-3 gap-3 px-10 min-h-0 relative z-10">
          {data.schoolLogos.slice(0, 9).map((logo, idx) => {
            const cropStyle = getCroppedLogoStyle(idx, true);
            return (
              <div
                key={idx}
                className="flex items-center justify-center bg-cream rounded-xl p-2 border border-gray-100 shadow-sm overflow-hidden"
              >
                <img
                  src={logo}
                  alt={`School ${idx + 1}`}
                  style={{
                    objectFit: cropStyle.objectFit,
                    objectPosition: cropStyle.objectPosition,
                    transform: `scale(${cropStyle.scale})`,
                    padding: cropStyle.padding,
                    width: '100%',
                    height: '100%'
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      {data.stats && data.stats.length > 0 && (
        <div className="grid grid-cols-3 gap-4 px-10 py-3 relative z-10">
          {data.stats.map((stat, idx) => (
            <div
              key={idx}
              className="text-center bg-gradient-to-br from-blue/10 to-crimson/10 rounded-xl py-3 px-3"
            >
              <div className="text-3xl font-black mb-1" style={{ color: COLORS.crimson }}>{stat.value}</div>
              <div className="text-xs font-semibold" style={{ color: COLORS.darkGray }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// TRANSITION SLIDE TEMPLATES (SIMPLIFIED)
// ============================================================================

const TransitionSlideDefault: React.FC<{ data: TransitionSlideData; isPortrait?: boolean }> = ({ data, isPortrait }) => {
  return (
    <div 
      className="w-full h-full flex flex-col justify-center items-center text-white relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.crimson} 100%)`
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-yellow/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

      {/* Logos */}
      <div className={`absolute ${isPortrait ? 'top-6 left-6 right-6' : 'top-8 left-12 right-12'} flex justify-between`}>
        <LogoComponents.EiAsset height={isPortrait ? 32 : 40} />
        <LogoComponents.GenWise height={isPortrait ? 32 : 40} variant="white" />
      </div>

      {/* Content */}
      <div className={`text-center ${isPortrait ? 'px-8 max-w-md' : 'px-16 max-w-4xl'} relative z-10`}>
        <h1 className={`font-black mb-6 leading-tight ${isPortrait ? 'text-5xl' : 'text-6xl'}`}>
          {data.title}
        </h1>
        
        {data.description && (
          <p className={`font-medium opacity-95 leading-relaxed ${isPortrait ? 'text-xl' : 'text-2xl'}`}>
            {data.description}
          </p>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// CONTACT SLIDE TEMPLATES
// ============================================================================

const ContactSlideCinematic: React.FC<{ data: ContactSlideData; isPortrait?: boolean }> = ({ data, isPortrait }) => {
  if (isPortrait) {
    return (
      <div 
        className="w-full h-full flex flex-col relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${COLORS.crimson} 0%, ${COLORS.blue} 100%)`
        }}
      >
        {/* M3 Badge at Top */}
        <div className="pt-12 pb-6 flex justify-center">
          <LogoComponents.M3Badge height={90} theme="white" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center px-8 pb-16">
          <h1 className="text-5xl font-black mb-4 text-white text-center leading-tight">
            Get in Touch
          </h1>
          <p className="text-xl mb-3 text-white/90 text-center font-medium">
            {data.title || "My Misconception Mentor"}
          </p>
          
          {/* Website URL */}
          {data.websiteUrl && (
            <p className="text-base mb-10 text-white/80 text-center font-medium">
              {data.websiteUrl}
            </p>
          )}

          {/* Contact Cards */}
          <div className="space-y-4">
            {data.contacts.map((contact, idx) => (
              <div key={idx} className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/20 shadow-xl">
                <h3 className="text-2xl font-black text-white mb-3">{contact.name}</h3>
                <p className="text-base text-white/90 mb-1 font-medium">{contact.email}</p>
                <p className="text-base text-white/90 font-medium">{contact.phone}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Logos - Increased spacing */}
        <div className="pb-8 px-8 flex justify-center gap-16">
          <LogoComponents.EiAsset height={36} />
          <LogoComponents.GenWise height={36} variant="white" />
        </div>
      </div>
    );
  }

  // Landscape Version
  return (
    <div 
      className="w-full h-full flex flex-col relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${COLORS.crimson} 0%, ${COLORS.blue} 100%)`
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow/20 rounded-full blur-3xl" />
      
      {/* M3 Badge at Top Center */}
      <div className="pt-5 pb-2 flex justify-center relative z-10">
        <LogoComponents.M3Badge height={70} theme="white" />
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col justify-center items-center px-16 pb-2 relative z-10">
        <h1 className="text-5xl font-black mb-3 text-white text-center">
          Get in Touch
        </h1>
        <p className="text-xl mb-2 text-white/90 text-center font-medium">
          {data.title || "My Misconception Mentor"}
        </p>

        {/* Website URL */}
        {data.websiteUrl && (
          <p className="text-lg mb-5 text-white/80 text-center font-medium">
            {data.websiteUrl}
          </p>
        )}

        {/* Contact Info Cards */}
        <div className="flex gap-6 max-w-4xl">
          {data.contacts.map((contact, idx) => (
            <div key={idx} className="flex-1 bg-white/15 backdrop-blur-xl rounded-3xl p-6 text-center border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-black text-white mb-3">{contact.name}</h3>
              <p className="text-base text-white/90 mb-2 font-medium">{contact.email}</p>
              <p className="text-base text-white/90 font-medium">{contact.phone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Logos */}
      <div className="pb-4 px-12 flex justify-center gap-16 relative z-10">
        <LogoComponents.EiAsset height={32} />
        <LogoComponents.GenWise height={32} variant="white" />
      </div>
    </div>
  );
};

// ============================================================================
// TESTIMONIAL PROFILE SLIDE TEMPLATE
// ============================================================================

const TestimonialProfileSlide: React.FC<{ data: TestimonialProfileSlideData; isPortrait?: boolean }> = ({ data, isPortrait }) => {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Background Image/Thumbnail */}
      {data.thumbnailImage ? (
        <img
          src={data.thumbnailImage}
          alt={data.teacherName}
          className={`absolute inset-0 w-full h-full object-cover object-center`}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600" />
      )}
      
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />

      {/* Top Logos */}
      <div className={`absolute z-20 flex justify-between items-center ${isPortrait ? 'top-6 left-6 right-6' : 'top-8 left-10 right-10'}`}>
        <LogoComponents.EiAsset height={isPortrait ? 40 : 48} />
        <LogoComponents.GenWise height={isPortrait ? 40 : 48} variant="default" />
      </div>

      {/* Bottom Text Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 z-10 text-white text-center ${isPortrait ? 'px-8 pb-12' : 'px-12 pb-12'}`}>
        <h2 className={`font-bold mb-3 leading-tight ${isPortrait ? 'text-2xl' : 'text-2xl'}`}>
          {data.title || "A Teacher's Perspective on\nMy Misconception Mentor (M3)"}
        </h2>
        
        <h1 className={`font-black mb-2 ${isPortrait ? 'text-4xl' : 'text-5xl'}`} style={{ color: '#FF8C00' }}>
          {data.teacherName}
        </h1>
        
        <p className={`font-semibold mb-1 ${isPortrait ? 'text-lg' : 'text-xl'}`}>
          {data.teacherRole}
        </p>
        
        <p className={`font-medium ${isPortrait ? 'text-base' : 'text-lg'}`}>
          {data.schoolName}
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN SLIDE RENDERER
// ============================================================================

export const VideoSlide: React.FC<VideoSlideProps> = ({ 
  data, 
  variant = 'default',
  aspectRatio = '16:9' 
}) => {
  const aspectRatioClasses = {
    '16:9': 'aspect-[16/9]',
    '9:16': 'aspect-[9/16]',
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
  };

  const isPortrait = aspectRatio === '9:16';

  const renderSlideContent = () => {
    switch (data.type) {
      case 'intro':
        if (variant === 'cinematic') return <IntroSlideCinematic data={data} isPortrait={isPortrait} />;
        return <IntroSlideDefault data={data} isPortrait={isPortrait} />;
      
      case 'trust':
        return <TrustSlideDefault data={data} isPortrait={isPortrait} />;
      
      case 'transition':
        return <TransitionSlideDefault data={data} isPortrait={isPortrait} />;
      
      case 'contact':
        return <ContactSlideCinematic data={data} isPortrait={isPortrait} />;
      
      case 'testimonialProfile':
        return <TestimonialProfileSlide data={data} isPortrait={isPortrait} />;
    }
  };

  return (
    <div className={`w-full ${aspectRatioClasses[aspectRatio]} bg-white overflow-hidden shadow-2xl`}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out;
        }
      `}</style>
      {renderSlideContent()}
    </div>
  );
};

// ============================================================================
// SLIDE TEMPLATE BROWSER WITH LIST/GRID VIEW
// ============================================================================

interface SlideTemplateBrowserProps {
  onSelectSlide?: (data: SlideData, variant: SlideVariant) => void;
}

export const SlideTemplateBrowser: React.FC<SlideTemplateBrowserProps> = ({ 
  onSelectSlide 
}) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const [selectedSlide, setSelectedSlide] = useState<{ data: SlideData; variant: SlideVariant; aspectRatio: '16:9' | '9:16' } | null>(null);
  const [aspectRatioFilter, setAspectRatioFilter] = useState<'16:9' | '9:16'>('16:9');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [slideTypeFilter, setSlideTypeFilter] = useState<'all' | SlideType>('all');
  const [isBatchExporting, setIsBatchExporting] = useState(false);
  const [batchProgress, setBatchProgress] = useState('');
  const batchRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Editable per-video data (filled via UI or Playwright automation)
  const [editableProfile, setEditableProfile] = useState({
    teacherName: '',
    teacherRole: '',
    schoolName: '',
    thumbnailImage: '',
  });
  const [editableTransition, setEditableTransition] = useState({
    title: '',
    description: '',
  });

  const exportAllSlides = async () => {
    setIsBatchExporting(true);
    const zip = new JSZip();
    const aspectRatios: Array<'16:9' | '9:16'> = ['16:9', '9:16'];
    for (const ar of aspectRatios) {
      const arLabel = ar === '16:9' ? 'landscape' : 'portrait';
      const folder = zip.folder(arLabel)!;
      for (const slide of sampleSlides) {
        const key = `${arLabel}_${slide.label.replace(/\s+/g, '_').toLowerCase()}`;
        const el = batchRefs.current[key];
        if (!el) continue;
        setBatchProgress(`${slide.label} (${arLabel})`);
        const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#FFFFFF', logging: false, useCORS: true });
        const blob = await new Promise<Blob>(resolve => canvas.toBlob(b => resolve(b!), 'image/png'));
        folder.file(`${key}.png`, blob);
      }
    }
    setBatchProgress('Zipping…');
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'm3-video-slides.zip';
    link.click();
    URL.revokeObjectURL(url);
    setIsBatchExporting(false);
    setBatchProgress('');
  };

  const exportSlide = async () => {
    if (!slideRef.current) return;

    // html2canvas doesn't support oklch() — replace all oklch computed styles
    // on the target element and its children with their sRGB equivalents
    const patchOklch = (el: HTMLElement) => {
      const style = window.getComputedStyle(el);
      const props = ['color', 'background-color', 'border-color', 'outline-color', 'box-shadow'];
      props.forEach(prop => {
        const val = style.getPropertyValue(prop);
        if (val && val.includes('oklch')) {
          (el.style as any)[prop.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase())] = 'transparent';
        }
      });
      Array.from(el.children).forEach(child => patchOklch(child as HTMLElement));
    };
    patchOklch(slideRef.current);

    let canvas;
    try {
      canvas = await html2canvas(slideRef.current, {
        scale: 2,
        backgroundColor: '#FFFFFF',
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
    } catch (err) {
      (window as any).__lastExportDataUrl = `ERROR:${err}`;
      console.error('html2canvas failed:', err);
      return;
    }

    const dataUrl = canvas.toDataURL('image/png');
    // Expose for Playwright automation
    (window as any).__lastExportDataUrl = dataUrl;
    const link = document.createElement('a');
    const aspectSuffix = selectedSlide?.aspectRatio === '9:16' ? 'portrait' : 'landscape';
    const slideLabel = selectedSlide?.data.type === 'testimonialProfile'
      ? `${(editableProfile.teacherName || 'profile').replace(/\s+/g, '_').toLowerCase()}_profile`
      : selectedSlide?.data.type === 'transition'
      ? `${(editableTransition.title || 'transition').replace(/\s+/g, '_').toLowerCase().slice(0, 30)}`
      : selectedSlide?.data.type || 'slide';
    link.download = `${slideLabel}_${aspectSuffix}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Sample data for each slide type
  const sampleSlides: Array<{ data: SlideData; variant: SlideVariant; label: string }> = [
    {
      label: 'Intro - Opening Slide',
      variant: 'default',
      data: {
        type: 'intro',
        title: 'My Misconception Mentor',
        subtitle: 'Transforming Math & Science Education',
        assetPoints: [
          'Comprehensive assessment tools',
          'Data-driven insights',
          'Student misconception tracking'
        ],
        genWisePoints: [
          'Expert teacher mentoring',
          'Personalized guidance',
          'Continuous professional development'
        ],
        tagline: 'Evidence-led PD. Outcome-led teaching.'
      }
    },
    {
      label: 'Intro - Cinematic',
      variant: 'cinematic',
      data: {
        type: 'intro',
        title: 'My Misconception Mentor',
        subtitle: 'Transforming Math & Science Education',
        tagline: 'Evidence-led PD. Outcome-led teaching.'
      }
    },
    {
      label: 'Social Proof',
      variant: 'default',
      data: {
        type: 'trust',
        title: 'My Misconception Mentor',
        subtitle: 'Online Math and Science Teacher Mentoring',
        schoolLogos: [
          gemsLogo, // GEMS Modern Academy
          millenniumLogo, // The Millennium School
          pictLogo, // PICT Model School
          psbbLogo, // PSBB Senior Secondary School
          sanskritiLogo, // Sanskriti The Gurukul
          shivNadarLogo, // Shiv Nadar School
          gearLogo, // GEAR
          sriKumaranLogo, // Sri Kumaran Children's Home
          tvsLogo, // TVS Academy
        ],
        stats: [
          { value: '300+', label: 'Teachers Mentored' },
          { value: '30+', label: 'Partner Schools' },
          { value: '90%+', label: 'Satisfaction Rate' }
        ]
      }
    },
    {
      label: 'Transition Slide',
      variant: 'default',
      data: {
        type: 'transition',
        title: editableTransition.title || 'Eye-Opener: The VSH Theory',
        description: editableTransition.description || 'Understanding the fundamental principles of evolution in biology education'
      }
    },
    {
      label: 'Contact - Closing Slide',
      variant: 'cinematic',
      data: {
        type: 'contact',
        title: 'My Misconception Mentor',
        websiteUrl: 'https://www.genwise.in/my-misconception-mentor',
        contacts: [
          {
            name: 'Prakhar Ghildyal',
            email: 'prakhar.ghildyal@ei.study',
            phone: '+91 89586 58658'
          },
          {
            name: 'Siddharth Bharath',
            email: 'siddharth@genwise.in',
            phone: '+91 87627 03967'
          }
        ]
      }
    },
    {
      label: 'Testimonial Profile',
      variant: 'default',
      data: {
        type: 'testimonialProfile',
        teacherName: editableProfile.teacherName || 'Dr. Jane Doe',
        teacherRole: editableProfile.teacherRole || 'Mathematics Teacher',
        schoolName: editableProfile.schoolName || "St. Mary's High School",
        thumbnailImage: editableProfile.thumbnailImage || 'https://via.placeholder.com/1920x1080/FF8C00/FFFFFF?text=Dr.+Jane+Doe',
        title: (() => {
          const role = (editableProfile.teacherRole || '').toLowerCase();
          const perspective = role.includes('principal') ? "Principal's"
            : role.includes('coordinator') ? "Coordinator's"
            : "Teacher's";
          return `A ${perspective} Perspective on\nMy Misconception Mentor (M3)`;
        })()
      }
    }
  ];

  // Filter slides by type
  const filteredSlides = slideTypeFilter === 'all' 
    ? sampleSlides 
    : sampleSlides.filter(slide => slide.data.type === slideTypeFilter);

  // Auto-select if only one slide in filtered results
  React.useEffect(() => {
    if (filteredSlides.length === 1) {
      setSelectedSlide({ ...filteredSlides[0], aspectRatio: aspectRatioFilter });
      onSelectSlide?.(filteredSlides[0].data, filteredSlides[0].variant);
    }
  }, [slideTypeFilter, aspectRatioFilter, filteredSlides.length]);

  const handleSlideClick = (slide: typeof sampleSlides[0]) => {
    setSelectedSlide({ ...slide, aspectRatio: aspectRatioFilter });
    onSelectSlide?.(slide.data, slide.variant);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black text-white mb-3">M3 Video Slide Templates</h1>
          <p className="text-xl text-gray-300 font-medium">
            World-class slides for professional testimonial videos
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-wrap gap-4 items-center">
          {/* Slide Type Dropdown */}
          <div className="flex items-center gap-3">
            <label className="text-white text-sm font-bold">Slide Type:</label>
            <select
              value={slideTypeFilter}
              onChange={(e) => setSlideTypeFilter(e.target.value as 'all' | SlideType)}
              className="bg-white/20 text-white border border-white/30 rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-yellow"
            >
              <option value="all" className="bg-gray-800">All Slides</option>
              <option value="intro" className="bg-gray-800">Intro Slides</option>
              <option value="trust" className="bg-gray-800">Social Proof</option>
              <option value="transition" className="bg-gray-800">Transition</option>
              <option value="contact" className="bg-gray-800">Contact/Closing</option>
              <option value="testimonialProfile" className="bg-gray-800">Testimonial Profile</option>
            </select>
          </div>

          {/* Aspect Ratio Dropdown */}
          <div className="flex items-center gap-3">
            <label className="text-white text-sm font-bold">Aspect Ratio:</label>
            <select
              value={aspectRatioFilter}
              onChange={(e) => setAspectRatioFilter(e.target.value as '16:9' | '9:16')}
              className="bg-white/20 text-white border border-white/30 rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-yellow"
            >
              <option value="16:9" className="bg-gray-800">16:9 Landscape</option>
              <option value="9:16" className="bg-gray-800">9:16 Portrait</option>
            </select>
          </div>

          {/* Batch Export */}
          <Button
            onClick={exportAllSlides}
            disabled={isBatchExporting}
            className="bg-gradient-to-r from-yellow to-yellow/80 text-gray-900 font-bold px-5 py-2 hover:scale-105 transition-transform disabled:opacity-50"
          >
            {isBatchExporting
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin inline" />Exporting: {batchProgress}</>
              : <><Archive className="w-4 h-4 mr-2 inline" />Export All (ZIP)</>}
          </Button>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white/20 rounded-lg p-1 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 text-sm ${
                viewMode === 'grid'
                  ? 'bg-white text-gray-900'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 text-sm ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
        </div>

        {/* Per-Video Data Editor — shown for testimonialProfile or transition slide types */}
        {(slideTypeFilter === 'testimonialProfile' || slideTypeFilter === 'transition' || slideTypeFilter === 'all') && (
          <div className="mb-6 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20" id="per-video-editor">
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Per-Video Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(slideTypeFilter === 'testimonialProfile' || slideTypeFilter === 'all') && (<>
                <div>
                  <label className="text-gray-300 text-xs font-semibold block mb-1">Teacher Name</label>
                  <input
                    data-field="teacherName"
                    type="text"
                    value={editableProfile.teacherName}
                    onChange={e => setEditableProfile(p => ({ ...p, teacherName: e.target.value }))}
                    placeholder="e.g. Anusha"
                    className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-xs font-semibold block mb-1">Role</label>
                  <input
                    data-field="teacherRole"
                    type="text"
                    value={editableProfile.teacherRole}
                    onChange={e => setEditableProfile(p => ({ ...p, teacherRole: e.target.value }))}
                    placeholder="e.g. Middle School Science Teacher"
                    className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-xs font-semibold block mb-1">School Name</label>
                  <input
                    data-field="schoolName"
                    type="text"
                    value={editableProfile.schoolName}
                    onChange={e => setEditableProfile(p => ({ ...p, schoolName: e.target.value }))}
                    placeholder="e.g. Padma Seshadri Bala Bhavan School, Chennai"
                    className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-xs font-semibold block mb-1">Thumbnail Image URL (Drive share link)</label>
                  <input
                    data-field="thumbnailImage"
                    type="text"
                    value={editableProfile.thumbnailImage}
                    onChange={e => setEditableProfile(p => ({ ...p, thumbnailImage: e.target.value }))}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                  />
                </div>
              </>)}
              {(slideTypeFilter === 'transition' || slideTypeFilter === 'all') && (<>
                <div>
                  <label className="text-gray-300 text-xs font-semibold block mb-1">Transition Title</label>
                  <input
                    data-field="transitionTitle"
                    type="text"
                    value={editableTransition.title}
                    onChange={e => setEditableTransition(t => ({ ...t, title: e.target.value }))}
                    placeholder="e.g. Knowledge is Powerful"
                    className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-xs font-semibold block mb-1">Transition Description</label>
                  <input
                    data-field="transitionDescription"
                    type="text"
                    value={editableTransition.description}
                    onChange={e => setEditableTransition(t => ({ ...t, description: e.target.value }))}
                    placeholder="e.g. How M3 shifted her focus from right answers to student reasoning"
                    className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                  />
                </div>
              </>)}
            </div>
          </div>
        )}

        {/* Template Grid/List */}
        {viewMode === 'list' ? (
          <div className="space-y-3 mb-8">
            {filteredSlides.map((slide, idx) => (
              <div 
                key={idx} 
                onClick={() => handleSlideClick(slide)}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg hover:bg-white/15 hover:scale-[1.02] transition-all cursor-pointer flex items-center px-5 py-3"
              >
                <h3 className="font-black text-white text-lg flex-1">{slide.label}</h3>
                <div className="text-gray-300 text-sm font-medium">
                  {slide.data.type === 'intro' && slide.variant === 'cinematic' ? 'Cinematic' : 'Default'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {filteredSlides.map((slide, idx) => (
              <div 
                key={idx} 
                onClick={() => handleSlideClick(slide)}
                className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-2xl hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="p-4 bg-white/5 border-b border-white/20">
                  <h3 className="font-black text-white text-base">{slide.label}</h3>
                </div>
                <div className="bg-gray-900 p-4">
                  <VideoSlide data={slide.data} variant={slide.variant} aspectRatio={aspectRatioFilter} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Slide Preview */}
        {selectedSlide && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-white">Selected Slide Preview</h2>
              <Button 
                onClick={exportSlide}
                className="bg-gradient-to-r from-crimson to-blue text-white font-bold text-lg px-8 py-6 shadow-2xl hover:scale-105 transition-transform"
              >
                <Download className="w-5 h-5 mr-2" />
                Export PNG (2x Resolution)
              </Button>
            </div>
            <div ref={slideRef} data-testid="slide-preview" className={`mx-auto ${selectedSlide.aspectRatio === '9:16' ? 'max-w-lg' : 'max-w-5xl'}`}>
              <VideoSlide 
                data={selectedSlide.data} 
                variant={selectedSlide.variant} 
                aspectRatio={selectedSlide.aspectRatio} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Off-screen slides for batch export */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', pointerEvents: 'none' }}>
        {(['16:9', '9:16'] as const).map(ar =>
          sampleSlides.map(slide => {
            const arLabel = ar === '16:9' ? 'landscape' : 'portrait';
            const key = `${arLabel}_${slide.label.replace(/\s+/g, '_').toLowerCase()}`;
            const width = ar === '16:9' ? 1280 : 720;
            return (
              <div key={key} ref={el => { batchRefs.current[key] = el; }} style={{ width: `${width}px` }}>
                <VideoSlide data={slide.data} variant={slide.variant} aspectRatio={ar} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SlideTemplateBrowser;