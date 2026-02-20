import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle2, FileVideo, FolderOpen, Share2 } from 'lucide-react';

export function GoogleDriveIntegrationGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Google Drive Integration</h2>
        <p className="text-gray-600">
          GenWise works seamlessly with Google Shared Drives to organize and access your video content.
        </p>
      </div>

      {/* Quick Start */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.5 2.5l-6 10.5h4.5l6-10.5h-4.5zm7.5 0l6 10.5h-4.5l-6-10.5h4.5zm-11 12l3 5.5 6-10.5h-4.5l-4.5 7.5zm16 0h-9l-3 5.5h9l3-5.5z"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Already Using Google Drive?</h3>
            <p className="text-sm text-gray-700 mb-4">
              You're all set! GenWise integrates directly with your existing Google Drive or Shared Drive. 
              Just paste video links and we'll handle the rest.
            </p>
            <Button size="sm" variant="default" onClick={() => window.open('https://drive.google.com', '_blank')}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Google Drive
            </Button>
          </div>
        </div>
      </Card>

      {/* How It Works */}
      <div>
        <h3 className="text-xl font-semibold mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <FileVideo className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-semibold mb-2">1. Store Videos in Drive</h4>
            <p className="text-sm text-gray-600">
              Keep your raw videos in Google Drive or Shared Drives, organized in folders by program or date.
            </p>
          </Card>

          <Card className="p-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <Share2 className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-semibold mb-2">2. Get Shareable Links</h4>
            <p className="text-sm text-gray-600">
              Right-click any video → "Get link" → Set to "Anyone with the link" → Copy the URL.
            </p>
          </Card>

          <Card className="p-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-semibold mb-2">3. Track in GenWise</h4>
            <p className="text-sm text-gray-600">
              Paste the link in GenWise to track clips, tags, transcripts, and social media posts.
            </p>
          </Card>
        </div>
      </div>

      {/* Step by Step */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Step-by-Step Guide</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">Upload Video to Google Drive</h4>
              <p className="text-sm text-gray-600 mb-2">
                Upload your video file to any folder in your Google Drive or Shared Drive.
              </p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                My Drive → Programs → M3 → raw_videos → video.mp4
              </code>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
              2
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">Get Shareable Link</h4>
              <p className="text-sm text-gray-600 mb-2">
                Right-click the video file → Click "Share" or "Get link"
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                <p className="font-medium text-yellow-900 mb-1">⚠️ Important:</p>
                <p className="text-yellow-800">
                  Set sharing to <strong>"Anyone with the link can view"</strong> so GenWise can access the video.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
              3
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">Copy the Link</h4>
              <p className="text-sm text-gray-600 mb-2">
                Click "Copy link" button. The URL will look like:
              </p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block overflow-x-auto">
                https://drive.google.com/file/d/1ABC...XYZ/view?usp=sharing
              </code>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
              4
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">Paste in GenWise</h4>
              <p className="text-sm text-gray-600 mb-2">
                In GenWise → Add Video → Paste the link in the "Raw Video URL" field
              </p>
              <p className="text-xs text-green-600 font-medium mt-2">
                ✅ Video will now be playable directly in GenWise!
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Benefits */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Benefits of Google Drive Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Centralized Storage</p>
              <p className="text-xs text-gray-600">All videos in one place your team already uses</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">No Re-uploading</p>
              <p className="text-xs text-gray-600">Link directly to existing files</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Team Collaboration</p>
              <p className="text-xs text-gray-600">Share drives keep everyone in sync</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Version Control</p>
              <p className="text-xs text-gray-600">Google Drive's built-in versioning</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Unlimited Storage</p>
              <p className="text-xs text-gray-600">Use your organization's Drive quota</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Easy Access</p>
              <p className="text-xs text-gray-600">Click "Open in Drive" anytime</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Folder Structure Suggestion */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">📁 Suggested Folder Structure</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm space-y-1">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-blue-600" />
            <span className="font-semibold">GenWise Content</span>
          </div>
          <div className="ml-6 space-y-1">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue-500" />
              <span>M3 (Master Maths Mind)</span>
            </div>
            <div className="ml-6 space-y-1 text-gray-600">
              <div>└─ 📹 2024_Testimonials</div>
              <div>└─ 📹 2024_Training_Sessions</div>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <FolderOpen className="w-4 h-4 text-blue-500" />
              <span>GenAI</span>
            </div>
            <div className="ml-6 space-y-1 text-gray-600">
              <div>└─ 📹 Webinars</div>
              <div>└─ 📹 Case_Studies</div>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <FolderOpen className="w-4 h-4 text-blue-500" />
              <span>GSP (GenWise Skilling Program)</span>
            </div>
            <div className="ml-6 space-y-1 text-gray-600">
              <div>└─ 📹 Module_Videos</div>
              <div>└─ 📹 Student_Success</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
