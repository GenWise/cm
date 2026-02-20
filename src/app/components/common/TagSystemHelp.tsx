import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, Tag, Layers, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function TagSystemHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">How Tags Work</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Smart Tag System</DialogTitle>
          <DialogDescription>
            Understanding how tags work in GenWise Content Manager
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overview */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              How It Works
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              GenWise uses a <strong>hybrid tagging system</strong> that combines granular clip-level tags 
              with optional video-level tags, giving you the best of both worlds.
            </p>
          </div>

          {/* Clip Tags */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-purple-900">Clip Tags (Primary)</h4>
            </div>
            <ul className="space-y-2 text-sm text-purple-800">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Tag individual clips with specific themes and topics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>These are your <strong>source of truth</strong> - the most granular level of tagging</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Example: "AI ethics", "healthcare", "customer-story", "product-demo"</span>
              </li>
            </ul>
          </div>

          {/* Auto-Aggregation */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Auto-Aggregation (Automatic)</h4>
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Video tags are <strong>automatically computed</strong> from all child clips</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>All unique clip tags are collected and shown at the video level</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>No duplication needed - tag clips once, find videos everywhere!</span>
              </li>
            </ul>
          </div>

          {/* Manual Video Tags */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Manual Video Tags (Optional)</h4>
            </div>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Add high-level tags directly to videos when needed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Useful for overarching themes not captured in individual clips</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Example: "keynote", "conference", "webinar-series"</span>
              </li>
            </ul>
          </div>

          {/* Tag Colors */}
          <div>
            <h4 className="font-semibold mb-3">Tag Color Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge className="border-blue-300 bg-blue-50 text-blue-700">
                  <Tag className="w-3 h-3 mr-1" />
                  example-tag
                </Badge>
                <span className="text-sm text-gray-700">Manual video tag</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="border-purple-300 bg-purple-50 text-purple-700">
                  <Layers className="w-3 h-3 mr-1" />
                  example-tag
                </Badge>
                <span className="text-sm text-gray-700">Aggregated from clips</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="border-green-300 bg-green-50 text-green-700">
                  <Tag className="w-3 h-3 mr-1" />
                  example-tag
                </Badge>
                <span className="text-sm text-gray-700">Both manual + from clips</span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="font-semibold mb-3">Benefits</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>No Duplication:</strong> Tag clips once, videos inherit tags automatically</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Better Search:</strong> Find videos by any clip tag without manual tagging</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Flexibility:</strong> Add video-level tags for high-level categorization when needed</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Transparency:</strong> Always see which tags come from where</span>
              </li>
            </ul>
          </div>

          {/* Example */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold mb-3">Example Workflow</h4>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="font-semibold text-gray-900">1.</span>
                <span>Create a video: "Healthcare AI Innovation Interview"</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-gray-900">2.</span>
                <div>
                  <p>Add clips with tags:</p>
                  <ul className="mt-1 ml-4 space-y-1">
                    <li>• Clip 1: "AI ethics in medicine" → <code>#AI-ethics #healthcare</code></li>
                    <li>• Clip 2: "Patient data privacy" → <code>#data-privacy #healthcare</code></li>
                    <li>• Clip 3: "Future of diagnostics" → <code>#AI-diagnostics #innovation</code></li>
                  </ul>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-gray-900">3.</span>
                <span>Video automatically shows all tags: AI-ethics, healthcare, data-privacy, AI-diagnostics, innovation</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-gray-900">4.</span>
                <span>Optionally add manual tag: <code>#keynote</code></span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-gray-900">5.</span>
                <span>Search for "healthcare" finds this video through clip tags!</span>
              </li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
