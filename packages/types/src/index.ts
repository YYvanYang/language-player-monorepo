// packages/types/src/index.ts

// --- Common/Pagination ---
/** Standardized error response structure */
export interface ErrorResponseDTO {
  code: string; // e.g., "NOT_FOUND", "INVALID_INPUT"
  message: string;
  requestId?: string;
}

/** Standardized paginated response structure */
export interface PaginatedResponseDTO<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  page: number; // 1-based page number derived from limit/offset
  totalPages: number;
}

// --- Authentication DTOs ---
export interface RegisterRequestDTO {
  email: string;
  password?: string; // Password is required for local registration
  name: string;
}

export interface LoginRequestDTO {
  email: string;
  password?: string; // Password is required for local login
}

export interface GoogleCallbackRequestDTO {
  idToken: string; // The ID token received from Google Sign-In client-side
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
  isNewUser?: boolean; // Indicates if Google sign-in created a new user
}

// --- User DTOs ---
export type AuthProvider = 'local' | 'google'; // Matches backend domain

export interface UserResponseDTO {
  id: string; // UUID
  email: string;
  name: string;
  authProvider: AuthProvider;
  profileImageUrl?: string | null;
  createdAt: string; // ISO 8601 string (e.g., "2023-10-27T10:00:00Z")
  updatedAt: string; // ISO 8601 string
  // Add isAdmin field if backend includes it for admin checks
  isAdmin?: boolean;
}

// --- Audio Track DTOs ---
export type AudioLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "NATIVE" | ""; // Allow empty string

// Matches dto.AudioTrackResponseDTO
export interface AudioTrackResponseDTO {
  id: string; // UUID
  title: string;
  description?: string | null;
  languageCode: string;
  level?: AudioLevel | null;
  durationMs: number; // Duration in milliseconds (integer)
  coverImageUrl?: string | null;
  uploaderId?: string | null; // UUID string
  isPublic: boolean;
  tags?: string[] | null;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

// Matches dto.AudioTrackDetailsResponseDTO
export interface AudioTrackDetailsResponseDTO extends AudioTrackResponseDTO {
  playUrl: string; // Presigned URL for playback
  userProgressMs?: number | null; // User's progress in milliseconds (integer)
  userBookmarks?: BookmarkResponseDTO[] | null;
}

// --- Audio Collection DTOs ---
export type CollectionType = "COURSE" | "PLAYLIST";

// Matches dto.CreateCollectionRequestDTO
export interface CreateCollectionRequestDTO {
  title: string;
  description?: string | null;
  type: CollectionType;
  initialTrackIds?: string[] | null; // Array of Track UUID strings
}

// Matches dto.UpdateCollectionRequestDTO
export interface UpdateCollectionRequestDTO {
  title?: string | null;       // Made optional for PATCH-like behavior if needed
  description?: string | null; // Made optional
}

// Matches dto.UpdateCollectionTracksRequestDTO
export interface UpdateCollectionTracksRequestDTO {
  orderedTrackIds: string[]; // Array of Track UUID strings in desired order
}

// Matches dto.AudioCollectionResponseDTO
export interface AudioCollectionResponseDTO {
  id: string; // UUID
  title: string;
  description?: string | null;
  ownerId: string; // User UUID string
  type: CollectionType;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
  tracks?: AudioTrackResponseDTO[] | null; // Optional list of full track details
  // trackCount?: number; // Add if backend provides a count separately
}

// --- User Activity DTOs ---

// Matches dto.RecordProgressRequestDTO
export interface RecordProgressRequestDTO {
  trackId: string; // UUID
  progressMs: number; // Progress in milliseconds (integer)
}

// Matches dto.PlaybackProgressResponseDTO
export interface PlaybackProgressResponseDTO {
  userId: string; // UUID
  trackId: string; // UUID
  progressMs: number; // Progress in milliseconds (integer)
  lastListenedAt: string; // ISO 8601 string
}

// Matches dto.CreateBookmarkRequestDTO
export interface CreateBookmarkRequestDTO {
  trackId: string; // UUID
  timestampMs: number; // Timestamp in milliseconds (integer)
  note?: string | null;
}

// Matches dto.BookmarkResponseDTO
export interface BookmarkResponseDTO {
  id: string; // UUID
  userId: string; // UUID
  trackId: string; // UUID
  timestampMs: number; // Timestamp in milliseconds (integer)
  note?: string | null;
  createdAt: string; // ISO 8601 string
}

// --- Upload DTOs ---

// Matches dto.RequestUploadRequestDTO
export interface RequestUploadRequestDTO {
    filename: string;
    contentType: string; // e.g., "audio/mpeg"
}

// Matches dto.RequestUploadResponseDTO
export interface RequestUploadResponseDTO {
    uploadUrl: string; // The presigned PUT URL
    objectKey: string; // The key assigned by the backend
}

// Matches dto.CompleteUploadInputDTO
export interface CompleteUploadRequestDTO {
    objectKey: string;
    title: string;
    description?: string | null;
    languageCode: string;
    level?: AudioLevel | null;
    durationMs: number; // Duration MUST be provided in milliseconds
    isPublic?: boolean | null;
    tags?: string[] | null;
    coverImageUrl?: string | null;
}

// --- Batch Upload DTOs ---

// Matches dto.BatchRequestUploadInputItemDTO
export interface BatchRequestUploadInputItemDTO {
    filename: string;
    contentType: string;
}

// Matches dto.BatchRequestUploadInputRequestDTO
export interface BatchRequestUploadInputRequestDTO {
    files: BatchRequestUploadInputItemDTO[];
}

// Matches dto.BatchRequestUploadInputResponseItemDTO
export interface BatchRequestUploadInputResponseItemDTO {
    originalFilename: string;
    objectKey: string;
    uploadUrl: string;
    error?: string; // Error message if URL generation failed for this item
}

// Matches dto.BatchRequestUploadInputResponseDTO
export interface BatchRequestUploadInputResponseDTO {
    results: BatchRequestUploadInputResponseItemDTO[];
}

// Matches dto.BatchCompleteUploadItemDTO
export interface BatchCompleteUploadItemDTO {
    objectKey: string;
    title: string;
    description?: string | null;
    languageCode: string;
    level?: AudioLevel | null;
    durationMs: number;
    isPublic?: boolean | null;
    tags?: string[] | null;
    coverImageUrl?: string | null;
}

// Matches dto.BatchCompleteUploadInputDTO
export interface BatchCompleteUploadInputDTO {
    tracks: BatchCompleteUploadItemDTO[];
}

// Matches dto.BatchCompleteUploadResponseItemDTO
export interface BatchCompleteUploadResponseItemDTO {
    objectKey: string;
    success: boolean;
    trackId?: string; // UUID string of created track if successful
    error?: string;   // Error message if processing failed
}

// Matches dto.BatchCompleteUploadResponseDTO
export interface BatchCompleteUploadResponseDTO {
    results: BatchCompleteUploadResponseItemDTO[];
}

// --- Query Parameter Interfaces ---

// Based on GET /audio/tracks parameters
export interface ListTrackQueryParams {
  q?: string;
  lang?: string;
  level?: AudioLevel;
  isPublic?: boolean;
  tags?: string[];
  sortBy?: 'createdAt' | 'title' | 'durationMs' | 'level'; // Match allowed fields
  sortDir?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Based on GET /users/me/bookmarks parameters
export interface ListBookmarkQueryParams {
    trackId?: string; // UUID
    limit?: number;
    offset?: number;
}

// Based on GET /users/me/progress parameters
export interface ListProgressQueryParams {
    limit?: number;
    offset?: number;
}

// --- Admin Specific (Placeholder - Define based on actual Admin API) ---
export interface AdminListUsersParams {
    // Define params for listing users in admin panel
    q?: string;
    limit?: number;
    offset?: number;
}

export interface AdminUpdateUserRequestDTO {
    name?: string;
    // Add roles, status, etc.
}