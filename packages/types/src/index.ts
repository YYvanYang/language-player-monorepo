// packages/types/src/index.ts

// --- Common/Pagination ---
// No changes needed based on doc.json

/** Standardized error response structure */
export interface ErrorResponseDTO {
  code: string;
  message: string;
  requestId?: string;
}

/** Standardized paginated response structure */
export interface PaginatedResponseDTO<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  page: number;
  totalPages: number;
}

// --- Authentication DTOs ---

export interface RegisterRequestDTO {
  email: string;
  password?: string; // Keep optional if supporting external providers primarily
  name: string;
}

export interface LoginRequestDTO {
  email: string;
  password?: string; // Keep optional
}

export interface GoogleCallbackRequestDTO {
  idToken: string;
}

// ADDED: Refresh Token Request DTO
export interface RefreshRequestDTO {
  refreshToken: string;
}

// ADDED: Logout Request DTO
export interface LogoutRequestDTO {
  refreshToken: string;
}

// MODIFIED: AuthResponseDTO to include refreshToken
export interface AuthResponseDTO {
  accessToken: string; // Changed from 'token' for clarity, matches doc.json
  refreshToken: string; // Added non-optional refresh token
  isNewUser?: boolean; // True if external auth resulted in new account creation
}

// --- User DTOs ---
// No changes needed based on doc.json
export type AuthProvider = 'local' | 'google';

export interface UserResponseDTO {
  id: string;
  email: string;
  name: string;
  authProvider: AuthProvider;
  profileImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  isAdmin?: boolean;
}

// --- Audio Track DTOs ---
// No changes needed based on doc.json (durationMs already used)
export type AudioLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "NATIVE" | "";

export interface AudioTrackResponseDTO {
  id: string;
  title: string;
  description?: string | null;
  languageCode: string;
  level?: AudioLevel | null;
  durationMs: number; // Stays as number (milliseconds)
  coverImageUrl?: string | null;
  uploaderId?: string | null;
  isPublic: boolean;
  tags?: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface AudioTrackDetailsResponseDTO extends AudioTrackResponseDTO {
  playUrl: string;
  // User activity also uses ms
  userProgressMs?: number | null; // Make null instead of undefined for consistency
  userBookmarks?: BookmarkResponseDTO[] | null;
}

export interface CompleteUploadRequestDTO {
  objectKey: string;
  title: string;
  description?: string | null;
  languageCode: string;
  level?: AudioLevel | null;
  durationMs: number; // Keep as number (milliseconds)
  isPublic?: boolean | null;
  tags?: string[] | null;
  coverImageUrl?: string | null;
}


// --- Audio Collection DTOs ---
// No changes needed based on doc.json
export type CollectionType = "COURSE" | "PLAYLIST";

export interface CreateCollectionRequestDTO {
  title: string;
  description?: string | null;
  type: CollectionType;
  initialTrackIds?: string[] | null;
}

export interface UpdateCollectionRequestDTO {
  title?: string | null;
  description?: string | null;
}

export interface UpdateCollectionTracksRequestDTO {
  orderedTrackIds: string[];
}

export interface AudioCollectionResponseDTO {
  id: string;
  title: string;
  description?: string | null;
  ownerId: string;
  type: CollectionType;
  createdAt: string;
  updatedAt: string;
  tracks?: AudioTrackResponseDTO[] | null;
  trackCount?: number;
}

// --- User Activity DTOs ---
// No changes needed based on doc.json (already using ms)
export interface RecordProgressRequestDTO {
  trackId: string;
  progressMs: number;
}

export interface PlaybackProgressResponseDTO {
  userId: string;
  trackId: string;
  progressMs: number;
  lastListenedAt: string;
}

export interface CreateBookmarkRequestDTO {
  trackId: string;
  timestampMs: number;
  note?: string | null;
}

export interface BookmarkResponseDTO {
  id: string;
  userId: string;
  trackId: string;
  timestampMs: number;
  note?: string | null;
  createdAt: string;
}

// --- Upload DTOs ---
// No changes needed for single upload based on doc.json
export interface RequestUploadRequestDTO {
    filename: string;
    contentType: string;
}

export interface RequestUploadResponseDTO {
    uploadUrl: string;
    objectKey: string;
}

// --- ADDED: Batch Upload DTOs ---

export interface BatchRequestUploadInputItemDTO {
    filename: string;
    contentType: string;
}

export interface BatchRequestUploadInputRequestDTO {
    files: BatchRequestUploadInputItemDTO[];
}

export interface BatchRequestUploadInputResponseItemDTO {
    originalFilename: string;
    objectKey: string;
    uploadUrl: string;
    error?: string;
}

export interface BatchRequestUploadInputResponseDTO {
    results: BatchRequestUploadInputResponseItemDTO[];
}

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

export interface BatchCompleteUploadInputDTO {
    tracks: BatchCompleteUploadItemDTO[];
}

export interface BatchCompleteUploadResponseItemDTO {
    objectKey: string;
    success: boolean;
    trackId?: string;
    error?: string;
}

export interface BatchCompleteUploadResponseDTO {
    results: BatchCompleteUploadResponseItemDTO[];
}

// --- Query Parameter Interfaces ---
// No changes needed based on doc.json
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
    trackId?: string;
    limit?: number;
    offset?: number;
}

export interface ListProgressQueryParams {
    limit?: number;
    offset?: number;
}

export interface ListCollectionQueryParams {
    limit?: number;
    offset?: number;
}

// Admin Specific Params
// No changes needed based on doc.json
export interface AdminListUsersParams {
    q?: string;
    provider?: AuthProvider;
    limit?: number;
    offset?: number;
    sortBy?: 'email' | 'name' | 'createdAt';
    sortDir?: 'asc' | 'desc';
}