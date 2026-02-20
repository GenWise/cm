import { Card } from '@/components/ui/card';
import { FileVideo, Scissors, Video, ArrowRight, CheckCircle2 } from 'lucide-react';

export function VideoPipelineInfo() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Understanding the Video Pipeline</h3>
      
      <div className="space-y-6">
        {/* Visual Pipeline */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FileVideo className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm font-medium">Raw Video</p>
            <p className="text-xs text-gray-500 mt-1">Source footage</p>
          </div>
          
          <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
          
          <div className="flex-1 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Scissors className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm font-medium">Edited Video</p>
            <p className="text-xs text-gray-500 mt-1">Work in progress</p>
          </div>
          
          <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
          
          <div className="flex-1 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Video className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm font-medium">Final Video</p>
            <p className="text-xs text-gray-500 mt-1">Ready to publish</p>
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-3">
          <div className="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <FileVideo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Raw Video</p>
              <p className="text-xs text-blue-700 mt-1">
                Unedited source footage stored in Google Drive. This is your recording straight from the camera/screen capture.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-xs bg-blue-100 px-2 py-1 rounded">Reference material</span>
                <span className="text-xs bg-blue-100 px-2 py-1 rounded">For editors</span>
                <span className="text-xs bg-blue-100 px-2 py-1 rounded">Create clips</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <Scissors className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-900">Edited Video</p>
              <p className="text-xs text-purple-700 mt-1">
                Working version with cuts, transitions, and effects applied. May still need review or final touches.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-xs bg-purple-100 px-2 py-1 rounded">Team review</span>
                <span className="text-xs bg-purple-100 px-2 py-1 rounded">QA checks</span>
                <span className="text-xs bg-purple-100 px-2 py-1 rounded">Revisions</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
            <Video className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">Final Video</p>
              <p className="text-xs text-green-700 mt-1">
                Production-ready, approved version for distribution. This is what gets posted on social media and websites.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-xs bg-green-100 px-2 py-1 rounded">Social media</span>
                <span className="text-xs bg-green-100 px-2 py-1 rounded">Website</span>
                <span className="text-xs bg-green-100 px-2 py-1 rounded">Public</span>
              </div>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Best Practices
          </p>
          <ul className="text-xs text-gray-600 space-y-1.5 ml-6">
            <li>• Keep raw videos in a dedicated "Raw Videos" folder in Google Drive</li>
            <li>• Name files consistently: [Program]_[Subject]_[Date]_raw.mp4</li>
            <li>• Only mark videos as "Final" after team approval</li>
            <li>• Create clips from raw videos to capture key moments</li>
            <li>• Use the Final video URL for all public-facing posts</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
