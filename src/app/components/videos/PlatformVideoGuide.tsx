import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  TrendingUp, 
  Video, 
  ExternalLink,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { PLATFORM_SPECS } from '@/lib/platformSpecs';

export function PlatformVideoGuide() {
  const nativePlatforms = Object.values(PLATFORM_SPECS).filter(p => p.penalizesYouTube);
  const friendlyPlatforms = Object.values(PLATFORM_SPECS).filter(p => !p.penalizesYouTube);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">Platform Video Strategy Guide</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Why you need multiple video versions and how to maximize reach across all platforms
        </p>
      </div>

      {/* The Problem */}
      <Card className="p-6 bg-orange-50 border-orange-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-orange-900 mb-2">The YouTube Link Problem</h2>
            <p className="text-orange-800 mb-4">
              When you post a YouTube link on Facebook, LinkedIn, or Instagram, these platforms <strong>dramatically reduce your reach</strong> because they don't want to send users to a competing platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-lg border border-orange-200">
                <p className="font-semibold text-orange-900 mb-1">Facebook</p>
                <p className="text-sm text-orange-700">10x less reach with YouTube links</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-orange-200">
                <p className="font-semibold text-orange-900 mb-1">LinkedIn</p>
                <p className="text-sm text-orange-700">5x less reach with external links</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-orange-200">
                <p className="font-semibold text-orange-900 mb-1">Instagram</p>
                <p className="text-sm text-orange-700">Doesn't allow external links in posts</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* The Solution */}
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-green-900 mb-2">The Solution: Native Uploads</h2>
            <p className="text-green-800 mb-4">
              Upload platform-specific video versions directly to each platform. Native videos get <strong>5-10x better reach and engagement</strong>.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Videos play inline without leaving the platform</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Algorithm favors native content</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Better mobile experience</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Platform-specific optimizations (auto-captions, aspect ratios)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Platform Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Native Required */}
        <Card className="p-6 border-orange-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-lg">Native Upload Required</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            These platforms penalize YouTube links. Always upload videos directly.
          </p>
          <div className="space-y-2">
            {nativePlatforms.map(platform => (
              <div key={platform.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <span className="font-medium text-sm">{platform.name}</span>
                </div>
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
            ))}
          </div>
        </Card>

        {/* YouTube Friendly */}
        <Card className="p-6 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-lg">YouTube Links OK</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            These platforms don't penalize external video links as much.
          </p>
          <div className="space-y-2">
            {friendlyPlatforms.map(platform => (
              <div key={platform.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <span className="font-medium text-sm">{platform.name}</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Workflow */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Recommended Workflow</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">Create Master Video</h4>
              <p className="text-sm text-gray-600">
                Edit your main video at 1920x1080 (16:9). This becomes your YouTube/website version.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
              2
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">Create Platform Versions</h4>
              <p className="text-sm text-gray-600 mb-2">
                Export optimized versions for each platform:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• <strong>LinkedIn/Facebook/Twitter:</strong> 1:1 square (1080x1080)</li>
                <li>• <strong>Instagram Feed:</strong> 4:5 vertical (1080x1350)</li>
                <li>• <strong>Instagram Reels/TikTok:</strong> 9:16 vertical (1080x1920)</li>
                <li>• <strong>WhatsApp Status:</strong> Short version (under 30s, 9:16)</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
              3
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">Organize in Google Drive</h4>
              <p className="text-sm text-gray-600">
                Store all versions in a structured folder. Example:
              </p>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg font-mono text-xs space-y-1">
                <div>📁 M3_Testimonial_John_2024</div>
                <div className="ml-4">├─ raw_footage.mp4</div>
                <div className="ml-4">├─ master_16x9.mp4 (YouTube)</div>
                <div className="ml-4">├─ square_1x1.mp4 (LinkedIn, FB)</div>
                <div className="ml-4">├─ vertical_4x5.mp4 (IG Feed)</div>
                <div className="ml-4">└─ reels_9x16.mp4 (IG Reels, TikTok)</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
              4
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">Track in GenWise</h4>
              <p className="text-sm text-gray-600">
                Link each version in GenWise's Platform Versions section. See at a glance which platforms are ready.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
              5
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">Post Natively</h4>
              <p className="text-sm text-gray-600">
                When creating posts, upload the platform-specific video directly—never paste YouTube links on Facebook/LinkedIn/Instagram.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Tips */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Quick Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex gap-2">
            <Video className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Add Captions</p>
              <p className="text-blue-700">85% of social videos are watched without sound</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Video className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Hook in 3 Seconds</p>
              <p className="text-blue-700">Grab attention immediately or viewers scroll past</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Video className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Shorter is Better</p>
              <p className="text-blue-700">30-60 seconds gets highest engagement</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Video className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Test & Iterate</p>
              <p className="text-blue-700">Track which versions perform best per platform</p>
            </div>
          </div>
        </div>
      </Card>

      {/* CTA */}
      <Card className="p-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h3 className="text-2xl font-bold mb-2">Ready to Maximize Your Reach?</h3>
        <p className="mb-4 opacity-90">
          Start tracking platform-specific video versions in GenWise
        </p>
        <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
          <Video className="w-5 h-5 mr-2" />
          Manage Platform Versions
        </Button>
      </Card>
    </div>
  );
}
