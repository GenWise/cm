/**
 * Google Drive helper functions
 */

/**
 * Extract file ID from various Google Drive URL formats
 */
export function extractDriveFileId(url: string): string | null {
  if (!url) return null;
  
  // Match patterns:
  // https://drive.google.com/file/d/{fileId}/view
  // https://drive.google.com/open?id={fileId}
  // https://drive.google.com/uc?id={fileId}
  
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /^([a-zA-Z0-9_-]{25,})$/, // Just the ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Get Google Drive view URL from file ID
 */
export function getDriveViewUrl(fileIdOrUrl: string): string {
  const fileId = extractDriveFileId(fileIdOrUrl) || fileIdOrUrl;
  return `https://drive.google.com/file/d/${fileId}/view`;
}

/**
 * Get Google Drive preview/embed URL from file ID
 */
export function getDrivePreviewUrl(fileIdOrUrl: string): string {
  const fileId = extractDriveFileId(fileIdOrUrl) || fileIdOrUrl;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Get Google Drive thumbnail URL
 */
export function getDriveThumbnailUrl(fileIdOrUrl: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  const fileId = extractDriveFileId(fileIdOrUrl) || fileIdOrUrl;
  const sizeMap = {
    small: 200,
    medium: 400,
    large: 800,
  };
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${sizeMap[size]}`;
}

/**
 * Get Google Drive download URL
 */
export function getDriveDownloadUrl(fileIdOrUrl: string): string {
  const fileId = extractDriveFileId(fileIdOrUrl) || fileIdOrUrl;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Check if URL is a Google Drive URL
 */
export function isGoogleDriveUrl(url: string): boolean {
  return url?.includes('drive.google.com') || url?.includes('docs.google.com');
}

/**
 * Open Google Drive file in new tab
 */
export function openInDrive(fileIdOrUrl: string): void {
  const url = getDriveViewUrl(fileIdOrUrl);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Get folder URL for Google Shared Drive
 */
export function getDriveFolderUrl(folderId: string): string {
  return `https://drive.google.com/drive/folders/${folderId}`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
