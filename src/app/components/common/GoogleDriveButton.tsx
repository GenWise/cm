import { Button } from '@/components/ui/button';
import { ExternalLink, FolderOpen } from 'lucide-react';
import { openInDrive, isGoogleDriveUrl } from '@/lib/googleDrive';

interface GoogleDriveButtonProps {
  fileIdOrUrl?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function GoogleDriveButton({ 
  fileIdOrUrl, 
  variant = 'outline',
  size = 'default',
  showIcon = true,
  children = 'Open in Google Drive',
  className = ''
}: GoogleDriveButtonProps) {
  if (!fileIdOrUrl) return null;

  return (
    <Button
      variant={variant}
      size={size}
      className={`gap-2 ${className}`}
      onClick={() => openInDrive(fileIdOrUrl)}
    >
      {showIcon && <ExternalLink className="w-4 h-4" />}
      {children}
    </Button>
  );
}

interface GoogleDriveLinkProps {
  fileIdOrUrl?: string;
  children?: React.ReactNode;
  className?: string;
}

export function GoogleDriveLink({ fileIdOrUrl, children, className = '' }: GoogleDriveLinkProps) {
  if (!fileIdOrUrl) return null;

  return (
    <button
      onClick={() => openInDrive(fileIdOrUrl)}
      className={`inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:underline ${className}`}
    >
      {children}
      <ExternalLink className="w-3.5 h-3.5" />
    </button>
  );
}

interface GoogleDriveBadgeProps {
  url?: string;
}

export function GoogleDriveBadge({ url }: GoogleDriveBadgeProps) {
  if (!url || !isGoogleDriveUrl(url)) return null;

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.5 2.5l-6 10.5h4.5l6-10.5h-4.5zm7.5 0l6 10.5h-4.5l-6-10.5h4.5zm-11 12l3 5.5 6-10.5h-4.5l-4.5 7.5zm16 0h-9l-3 5.5h9l3-5.5z"/>
      </svg>
      <span>Google Drive</span>
    </div>
  );
}

interface GoogleDriveFolderButtonProps {
  folderId?: string;
  folderName?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function GoogleDriveFolderButton({ 
  folderId, 
  folderName = 'Open Folder',
  variant = 'outline',
  size = 'sm',
  className = ''
}: GoogleDriveFolderButtonProps) {
  if (!folderId) return null;

  const handleClick = () => {
    window.open(`https://drive.google.com/drive/folders/${folderId}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`gap-2 ${className}`}
      onClick={handleClick}
    >
      <FolderOpen className="w-4 h-4" />
      {folderName}
    </Button>
  );
}
