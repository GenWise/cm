import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FolderOpen, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

declare global {
  interface Window {
    google?: any;
    gapi?: any;
  }
}

interface GoogleDrivePickerProps {
  onFileSelect: (fileId: string, fileUrl: string, fileName: string) => void;
  mimeType?: string;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'ghost';
  buttonSize?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function GoogleDrivePicker({
  onFileSelect,
  mimeType = 'video/*',
  buttonText = 'Browse Google Drive',
  buttonVariant = 'outline',
  buttonSize = 'default',
  className = '',
}: GoogleDrivePickerProps) {
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
  const [showSetupInstructions, setShowSetupInstructions] = useState(false);

  useEffect(() => {
    // Check if Google Picker API is available
    if (window.google?.picker) {
      setPickerApiLoaded(true);
    }
  }, []);

  const handleOpenPicker = () => {
    // For now, show setup instructions since we need API key configuration
    setShowSetupInstructions(true);
  };

  const openGoogleDriveWeb = () => {
    window.open('https://drive.google.com/drive/my-drive', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        <Button
          type="button"
          variant={buttonVariant}
          size={buttonSize}
          onClick={openGoogleDriveWeb}
          className="w-full gap-2"
        >
          <FolderOpen className="w-4 h-4" />
          {buttonText}
        </Button>

        {showSetupInstructions && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <p className="font-medium mb-2">Google Drive Integration</p>
              <p className="mb-2">
                The Google Drive file browser will open in a new tab. To use the file:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-xs ml-2">
                <li>Right-click on your video file in Google Drive</li>
                <li>Select "Get link" or "Share"</li>
                <li>Set permissions to "Anyone with the link can view"</li>
                <li>Copy the link and paste it into the Video URL field</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>✓ Paste any Google Drive share link</p>
          <p>✓ Supports videos from My Drive or Shared Drives</p>
          <p>✓ File permissions must allow viewing</p>
        </div>
      </div>
    </div>
  );
}

interface DriveUrlInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  helpText?: string;
  showPicker?: boolean;
}

export function DriveUrlInput({
  value,
  onChange,
  label = 'Google Drive URL',
  placeholder = 'https://drive.google.com/file/d/...',
  helpText = 'Paste a Google Drive share link',
  showPicker = true,
}: DriveUrlInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {showPicker && (
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={() => window.open('https://drive.google.com/drive/my-drive', '_blank')}
          >
            <FolderOpen className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      {helpText && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
}
