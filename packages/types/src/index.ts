// packages/types/src/index.ts

// --- Common/Pagination ---
/** Standardized error response structure from the backend */
export interface ErrorResponseDTO {
  code: string; // e.g., "NOT_FOUND", "INVALID_INPUT", "UNAUTHENTICATED"
  message: string;
  requestId?: string; // Optional trace ID
  // details?: unknown; // Optional structured details (e.g., validation errors)
}

/** Standardized paginated response structure from the backend */
export interface PaginatedResponseDTO<T> {
  data: T[];         // Items for the current page
  total: number;     // Total number of items available
  limit: number;     // The limit used for this page
  offset: number;    // The offset used for this page
  page: number;      // Current page number (1-based, calculated)
  totalPages: number;// Total number of pages (calculated)
}

// --- Authentication DTOs (Matching backend API) ---
export interface RegisterRequestDTO {
  email: string;
  password?: string; // Required for 'local' provider
  name: string;
}

export interface LoginRequestDTO {
  email: string;
  password?: string; // Required for 'local' provider
}

export interface GoogleCallbackRequestDTO {
  idToken: string; // Google ID Token from client
}

export interface RefreshRequestDTO {
  refreshToken: string;
}

export interface LogoutRequestDTO {
  refreshToken: string;
}

export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  isNewUser?: boolean; // Provided by Google callback response
  user?: UserResponseDTO; // Often included on login/register success
}

// --- User DTOs ---
export type AuthProvider = 'local' | 'google'; // Matches backend domain AuthProvider

export interface UserResponseDTO {
  id: string; // UUID
  email: string;
  name: string;
  authProvider: AuthProvider;
  profileImageUrl?: string | null;
  createdAt: string; // ISO 8601 datetime string (e.g., "2023-10-27T10:00:00Z")
  updatedAt: string; // ISO 8601 datetime string
  isAdmin?: boolean; // Important for Admin Panel checks
}

// --- Admin User DTOs (Example) ---
// DTO for updating user info via admin panel
export interface AdminUpdateUserRequestDTO {
    name?: string;
    email?: string; // Be cautious allowing email updates
    isAdmin?: boolean;
    // Add other fields like status (active/inactive), roles etc.
    // status?: 'active' | 'inactive';
}

// --- Audio Track DTOs ---
export type AudioLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "NATIVE" | ""; // Allow empty string for 'unknown/any'

// Basic track info returned in lists
export interface AudioTrackResponseDTO {
  id: string; // UUID
  title: string;
  description?: string | null;
  languageCode: string; // e.g., 'en-US'
  level?: AudioLevel | null; // Optional level
  durationMs: number; // Always in milliseconds
  coverImageUrl?: string | null;
  uploaderId?: string | null; // UUID string
  isPublic: boolean;
  tags?: string[] | null;
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string
}

// Detailed track info including playback URL and user-specific data
export interface AudioTrackDetailsResponseDTO extends AudioTrackResponseDTO {
  playUrl: string; // Presigned URL for playback
  userProgressMs?: number | null; // User's progress in milliseconds
  userBookmarks?: BookmarkResponseDTO[] | null; // Array of user's bookmarks for this track
}

// --- Audio Collection DTOs ---
export type CollectionType = "COURSE" | "PLAYLIST";

export interface CreateCollectionRequestDTO {
  title: string;
  description?: string | null;
  type: CollectionType;
  initialTrackIds?: string[] | null; // Array of Track UUID strings
}

export interface UpdateCollectionRequestDTO {
  title?: string | null; // Optional for partial updates
  description?: string | null; // Optional for partial updates
}

export interface UpdateCollectionTracksRequestDTO {
  orderedTrackIds: string[]; // Array of Track UUID strings in desired order
}

export interface AudioCollectionResponseDTO {
  id: string; // UUID
  title: string;
  description?: string | null;
  ownerId: string; // User UUID string
  type: CollectionType;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
  // Tracks might be included in detail view, optional in lists
  tracks?: AudioTrackResponseDTO[] | null;
  // trackCount?: number; // Optional: If backend provides count separately
}

// --- User Activity DTOs ---
export interface RecordProgressRequestDTO {
  trackId: string; // UUID
  progressMs: number; // Progress in milliseconds
}

export interface PlaybackProgressResponseDTO {
  userId: string; // UUID
  trackId: string; // UUID
  progressMs: number; // Progress in milliseconds
  lastListenedAt: string; // ISO 8601 string
}

export interface CreateBookmarkRequestDTO {
  trackId: string; // UUID
  timestampMs: number; // Timestamp in milliseconds
  note?: string | null;
}

export interface BookmarkResponseDTO {
  id: string; // UUID
  userId: string; // UUID
  trackId: string; // UUID
  timestampMs: number; // Timestamp in milliseconds
  note?: string | null;
  createdAt: string; // ISO 8601 string
}

// --- Upload DTOs (Matching Go backend DTOs/ports) ---
export interface RequestUploadRequestDTO {
    filename: string;
    contentType: string;
}

export interface RequestUploadResponseDTO {
    uploadUrl: string;
    objectKey: string;
}

// DTO for POST /audio/tracks (matches port.CompleteUploadInput structure)
export interface CompleteUploadRequestDTO {
    objectKey: string;
    title: string;
    description?: string | null;
    languageCode: string;
    level?: AudioLevel | null;
    durationMs: number; // Milliseconds
    isPublic?: boolean | null; // Backend likely defaults this
    tags?: string[] | null;
    coverImageUrl?: string | null;
}

// DTO for POST /uploads/audio/batch/request (matches port.BatchRequestUploadInput)
export interface BatchRequestUploadInputItemDTO {
    filename: string;
    contentType: string;
}
export interface BatchRequestUploadInputRequestDTO {
    files: BatchRequestUploadInputItemDTO[];
}

// DTO for response of /uploads/audio/batch/request (matches port.BatchURLResultItem structure)
export interface BatchRequestUploadInputResponseItemDTO {
    originalFilename: string;
    objectKey: string;
    uploadUrl: string;
    error?: string; // Error message if specific URL generation failed
}
export interface BatchRequestUploadInputResponseDTO {
    results: BatchRequestUploadInputResponseItemDTO[];
}

// DTO for POST /audio/tracks/batch/complete (matches port.BatchCompleteInput structure)
export interface BatchCompleteUploadItemDTO {
    objectKey: string;
    title: string;
    description?: string | null;
    languageCode: string;
    level?: AudioLevel | null;
    durationMs: number; // Milliseconds
    isPublic?: boolean | null;
    tags?: string[] | null;
    coverImageUrl?: string | null;
}
export interface BatchCompleteUploadInputDTO {
    tracks: BatchCompleteUploadItemDTO[];
}

// DTO for response of /audio/tracks/batch/complete (matches port.BatchCompleteResultItem structure)
export interface BatchCompleteUploadResponseItemDTO {
    objectKey: string;
    success: boolean;
    trackId?: string; // UUID string of created track if successful
    error?: string;   // Error message if processing failed for this item
}
export interface BatchCompleteUploadResponseDTO {
    results: BatchCompleteUploadResponseItemDTO[];
}


// --- Query Parameter Interfaces (for API services/hooks) ---

// Generic pagination params used by multiple list requests
export interface PaginationParams {
    limit?: number;
    offset?: number;
}

// Params for GET /audio/tracks
export interface ListTrackQueryParams extends PaginationParams {
  q?: string; // General search
  lang?: string; // Language code filter
  level?: AudioLevel; // Level filter
  isPublic?: boolean; // Public status filter
  tags?: string[]; // Tag filter (array)
  sortBy?: 'createdAt' | 'title' | 'durationMs' | 'level'; // Allowed sort fields
  sortDir?: 'asc' | 'desc';
}

// Params for GET /users/me/bookmarks
export interface ListBookmarkQueryParams extends PaginationParams {
    trackId?: string; // Optional track UUID filter
    // Add sorting if API supports it
    // sortBy?: 'createdAt' | 'timestampMs';
    // sortDir?: 'asc' | 'desc';
}

// Params for GET /users/me/progress
export interface ListProgressQueryParams extends PaginationParams {
    // Add sorting if API supports it
    // sortBy?: 'lastListenedAt';
    // sortDir?: 'asc' | 'desc';
}