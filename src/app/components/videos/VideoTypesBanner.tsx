import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileVideo, Scissors, Video, X } from 'lucide-react';
import { useState } from 'react';

export function VideoTypesBanner() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 border-2 border-blue-200">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-sm">📹 Video Types in GenWise</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 ml-auto"
              onClick={() => setShow(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                <FileVideo className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">Raw Videos</p>
                <p className="text-blue-700">Unedited source footage in Google Drive</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                <Scissors className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-purple-900">Edited Videos</p>
                <p className="text-purple-700">Work-in-progress versions under review</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                <Video className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-900">Final Videos</p>
                <p className="text-green-700">Published versions ready for distribution</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
