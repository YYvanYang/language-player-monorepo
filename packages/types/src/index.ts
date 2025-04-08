// packages/types/src/index.ts

// --- Common/Pagination ---

/** Standardized error response structure */
export interface ErrorResponseDTO {
  code: string; // e.g., "INVALID_INPUT", "NOT_FOUND", "UNAUTHENTICATED", "INTERNAL_ERROR"
  message: string; // User-friendly error message
  requestId?: string; // Optional request ID for tracing
  // details?: Record<string, string>; // Optional validation details map
}

/** Standardized paginated response structure */
export interface PaginatedResponseDTO<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  page: number;       // Current page (1-based)
  totalPages: number;
}

// --- Authentication DTOs ---

export interface RegisterRequestDTO {
  email: string;
  password?: string; // Password required for 'local' provider registration
  name: string;
}

export interface LoginRequestDTO {
  email: string;
  password?: string; // Required for 'local' provider login
}

export interface GoogleCallbackRequestDTO {
  idToken: string;
}

export interface AuthResponseDTO {
  token: string;       // Application's JWT
  isNewUser?: boolean; // True if external auth resulted in new account creation
}

// --- User DTOs ---

export type AuthProvider = 'local' | 'google'; // Expand as needed

export interface UserResponseDTO {
  id: string; // UUID string
  email: string;
  name: string;
  authProvider: AuthProvider;
  profileImageUrl?: string | null;
  createdAt: string; // ISO 8601 date-time string (e.g., "2023-10-27T10:00:00Z")
  updatedAt: string; // ISO 8601 date-time string
  // DO NOT include password hash or sensitive details here
  // Add 'isAdmin' or 'roles' if needed for context, especially for admin app session GET
  isAdmin?: boolean;
}

// --- Audio Track DTOs ---

export type AudioLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "NATIVE" | ""; // "" or null represents Unknown/Not Set

// Basic track info used in lists and general display
export interface AudioTrackResponseDTO {
  id: string; // UUID string
  title: string;
  description?: string | null;
  languageCode: string; // e.g., "en-US"
  level?: AudioLevel | null;
  durationMs: number; // Duration in milliseconds (use number for easier calculations)
  coverImageUrl?: string | null;
  uploaderId?: string | null; // UUID string
  isPublic: boolean;
  tags?: string[] | null;
  createdAt: string; // ISO 8601 date-time string
  updatedAt: string; // ISO 8601 date-time string
}

// Detailed track info, includes the temporary playback URL
export interface AudioTrackDetailsResponseDTO extends AudioTrackResponseDTO {
  playUrl: string; // Presigned URL (potentially empty if generation failed or no permission)
}

// DTO for finalizing an upload and creating track metadata (used by Admin and potentially User Upload feature)
export interface CompleteUploadRequestDTO {
  objectKey: string;
  title: string;
  description?: string | null;
  languageCode: string;
  level?: AudioLevel | null; // Allow null/empty
  durationMs: number; // Required, must be > 0
  isPublic?: boolean | null; // Allow default handling if null
  tags?: string[] | null;
  coverImageUrl?: string | null;
}

// --- Audio Collection DTOs ---

export type CollectionType = "COURSE" | "PLAYLIST";

// Request DTO for creating a collection
export interface CreateCollectionRequestDTO {
  title: string;
  description?: string | null;
  type: CollectionType;
  initialTrackIds?: string[] | null; // Array of UUID strings
}

// Request DTO for updating collection metadata
export interface UpdateCollectionRequestDTO {
  title?: string | null; // Fields are optional for updates
  description?: string | null;
}

// Request DTO for updating the ordered list of tracks in a collection
export interface UpdateCollectionTracksRequestDTO {
  orderedTrackIds: string[]; // Required: Full ordered list of UUID strings
}

// Response DTO for a collection (details might include tracks)
export interface AudioCollectionResponseDTO {
  id: string; // UUID string
  title: string;
  description?: string | null;
  ownerId: string; // UUID string
  type: CollectionType;
  createdAt: string; // ISO 8601 date-time string
  updatedAt: string; // ISO 8601 date-time string
  tracks?: AudioTrackResponseDTO[] | null; // Populated in detail endpoints
  trackCount?: number; // Optional: Count might be included in list views
}

// --- User Activity DTOs ---

// Request DTO for recording progress
export interface RecordProgressRequestDTO {
  trackId: string; // UUID string
  progressMs: number; // Progress in milliseconds
}

// Response DTO for playback progress
export interface PlaybackProgressResponseDTO {
  userId: string; // UUID string
  trackId: string; // UUID string
  progressMs: number; // Progress in milliseconds
  lastListenedAt: string; // ISO 8601 date-time string
}

// Request DTO for creating a bookmark
export interface CreateBookmarkRequestDTO {
  trackId: string; // UUID string
  timestampMs: number; // Timestamp in milliseconds
  note?: string | null;
}

// Response DTO for a bookmark
export interface BookmarkResponseDTO {
  id: string; // UUID string
  userId: string; // UUID string
  trackId: string; // UUID string
  timestampMs: number; // Timestamp in milliseconds
  note?: string | null;
  createdAt: string; // ISO 8601 date-time string
}

// --- Upload DTOs ---

// Request DTO for requesting a presigned upload URL
export interface RequestUploadRequestDTO {
    filename: string;
    contentType: string; // e.g., "audio/mpeg"
}

// Response DTO after requesting an upload URL
export interface RequestUploadResponseDTO {
    uploadUrl: string; // The presigned PUT URL
    objectKey: string; // The key the client should use for upload and report back
}

// --- Query Parameter Interfaces (for documentation/type safety) ---

// Combined Params for flexibility, use Partial<> if needed
export interface ListTrackQueryParams {
  q?: string;
  lang?: string;
  level?: AudioLevel;
  isPublic?: boolean;
  tags?: string[];
  sortBy?: 'createdAt' | 'title' | 'durationMs' | 'level';
  sortDir?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ListBookmarkQueryParams {
    trackId?: string; // UUID string
    limit?: number;
    offset?: number;
}

export interface ListProgressQueryParams {
    limit?: number;
    offset?: number;
}

export interface ListCollectionQueryParams {
    // Add filters if needed (e.g., by type)
    limit?: number;
    offset?: number;
}

// Admin Specific Params
export interface AdminListUsersParams {
    q?: string; // Search by email or name
    provider?: AuthProvider; // Filter by auth provider
    limit?: number;
    offset?: number;
    sortBy?: 'email' | 'name' | 'createdAt';
    sortDir?: 'asc' | 'desc';
}

// Add other admin list params (tracks, collections) if different from user params