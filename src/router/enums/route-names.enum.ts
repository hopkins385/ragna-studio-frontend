export const RouteName = {
  HOME: 'home',
  // User routes
  USER_LIST: 'user.list',
  USER_CREATE: 'user.create',
  USER_SHOW: 'user.show',
  USER_EDIT: 'user.edit',
  // Document routes
  DOCUMENT_INDEX: 'document.index',
  DOCUMENT_SHOW: 'document.show',
  // Chat routes
  CHAT_RECENT: 'chat.recent',
  CHAT_CREATE: 'chat.create',
  CHAT_HISTORY: 'chat.history',
  CHAT_SHOW: 'chat.show',
  // Assistant routes
  ASSISTANT_INDEX: 'assistant.index',
  ASSISTANT_CREATE: 'assistant.create',
  ASSISTANT_EDIT: 'assistant.edit',
  // Collection routes
  COLLECTION_INDEX: 'collection.index',
  COLLECTION_CREATE: 'collection.create',
  COLLECTION_SHOW: 'collection.show',
  COLLECTION_MEDIA: 'collection.media',
  // Media routes
  MEDIA_INDEX: 'media.index',
  MEDIA_UPLOAD: 'media.upload',
  MEDIA_GOOGLE_DRIVE_INDEX: 'media.google-drive.index',
  MEDIA_GOOGLE_DRIVE_CALLBACK: 'media.google-drive.callback',
  MEDIA_GOOGLE_DRIVE_SHOW: 'media.google-drive.show',
  MEDIA_ONE_DRIVE: 'media.one-drive',
  // Text to image routes
  TEXT_TO_IMAGE_INDEX: 'text-to-image.index',
  TEXT_TO_IMAGE_EXPLORE: 'text-to-image.explore',
  // Workflow routes
  WORKFLOW_INDEX: 'workflow.index',
  WORKFLOW_CREATE: 'workflow.create',
  WORKFLOW_SHOW: 'workflow.show',
  WORKFLOW_EDIT: 'workflow.edit',
  // Template routes
  TEMPLATE_INDEX: 'template.index',
  TEMPLATE_SHOW: 'template.show',
  // Account routes
  ACCOUNT_INDEX: 'account.index',
  ACCOUNT_SETTINGS: 'account.settings',
  // Social auth callback route
  SOCIAL_AUTH_CALLBACK: 'social-auth-callback',
  // Onboarding routes
  ONBOARDING_INDEX: 'onboarding.index',
  // Login and register routes
  LOGIN: 'login',
  REGISTER: 'register',
  LOGOUT: 'logout',
  // 404 route
  NOT_FOUND: 'not-found',
} as const;
