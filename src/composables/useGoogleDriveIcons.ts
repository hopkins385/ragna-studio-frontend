import {
  FolderIcon,
  FileIcon,
  FileSpreadsheetIcon,
  ImageIcon,
  type LucideIcon,
} from 'lucide-vue-next';

type SupportedMimeType =
  | 'application/vnd.google-apps.document'
  | 'application/vnd.google-apps.spreadsheet'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/vnd.google-apps.presentation'
  | 'application/vnd.google-apps.drawing'
  | 'image/jpeg'
  | 'image/png'
  | 'image/svg+xml'
  | 'image/bmp'
  | 'image/webp'
  | 'image/gif'
  | 'image/tiff'
  | 'application/vnd.google-apps.script'
  | 'application/vnd.google-apps.folder'
  | 'application/vnd.google-apps.audio'
  | 'application/vnd.google-apps.video'
  | 'application/vnd.google-apps.photo'
  | 'application/vnd.google-apps.file'
  | 'application/vnd.google-apps.unknown'
  | 'application/pdf'
  | 'application/vnd.google.colaboratory'
  | 'folder';

export default function useGoogleDriveIcons() {
  const icons: Record<SupportedMimeType, LucideIcon> = {
    'application/vnd.google-apps.document': FileIcon,
    'application/vnd.google-apps.spreadsheet': FileSpreadsheetIcon,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      FileSpreadsheetIcon,
    'application/vnd.google-apps.presentation': FileIcon,
    'application/vnd.google-apps.drawing': ImageIcon,
    'image/jpeg': ImageIcon,
    'image/png': ImageIcon,
    'image/svg+xml': ImageIcon,
    'image/bmp': ImageIcon,
    'image/webp': ImageIcon,
    'image/gif': ImageIcon,
    'image/tiff': ImageIcon,
    'application/vnd.google-apps.script': FileIcon,
    'application/vnd.google-apps.folder': FolderIcon,
    'application/vnd.google-apps.audio': FileIcon,
    'application/vnd.google-apps.video': FileIcon,
    'application/vnd.google-apps.photo': ImageIcon,
    'application/vnd.google-apps.file': FileIcon,
    'application/vnd.google-apps.unknown': FileIcon,
    'application/pdf': FileIcon,
    'application/vnd.google.colaboratory': FileIcon,
    folder: FolderIcon,
  };

  const fileIcon = (mimeType: string): LucideIcon => {
    return icons[mimeType as SupportedMimeType] || FileIcon;
  };

  return {
    fileIcon,
  };
}
