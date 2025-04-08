// packages/types/src/index.ts

// --- Common/Pagination ---

export interface ErrorResponseDTO {
    code: string; // e.g., "INVALID_INPUT", "NOT_FOUND", "UNAUTHENTICATED"
    message: string; // User-friendly error message
    requestId?: string; // Optional request ID for tracing
    // details?: Record<string, string>; // Optional validation details
  }
  
  export interface PaginatedResponseDTO<T> {
    data: T[]; // Array of response DTOs for the current page
    total: number;
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
  }
  
  // --- Authentication DTOs ---
  
  export interface RegisterRequestDTO {
    email: string;
    password?: string; // Made optional to potentially reuse for external auth completion
    name: string;
  }
  
  export interface LoginRequestDTO {
    email: string;
    password?: string; // Optional if supporting passwordless later
  }
  
  export interface GoogleCallbackRequestDTO {
    idToken: string;
  }
  
  export interface AuthResponseDTO {
    token: string;
    isNewUser?: boolean; // Optional, primarily for external auth callback
  }
  
  // --- User DTOs ---
  
  export type AuthProvider = 'local' | 'google'; // Or define as enum if preferred
  
  export interface UserResponseDTO {
    id: string; // UUID string
    email: string;
    name: string;
    authProvider: AuthProvider;
    profileImageUrl?: string | null;
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string
  }
  
  // --- Audio Track DTOs ---
  
  // Use string enums matching Go domain types for clarity
  export type AudioLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "NATIVE" | ""; // "" for Unknown/Not Set
  
  // Basic track info used in lists
  export interface AudioTrackResponseDTO {
    id: string; // UUID string
    title: string;
    description?: string;
    languageCode: string; // e.g., "en-US"
    level?: AudioLevel;
    durationMs: number; // Duration in milliseconds
    coverImageUrl?: string | null;
    uploaderId?: string | null; // UUID string
    isPublic: boolean;
    tags?: string[];
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string
  }
  
  // Detailed track info, includes playback URL
  export interface AudioTrackDetailsResponseDTO extends AudioTrackResponseDTO {
    playUrl: string; // Presigned URL
  }
  
  // DTO for creating track metadata after upload (Admin)
  export interface CompleteUploadRequestDTO {
    objectKey: string;
    title: string;
    description?: string;
    languageCode: string;
    level?: AudioLevel;
    durationMs: number;
    isPublic?: boolean; // Allow default
    tags?: string[];
    coverImageUrl?: string | null;
  }
  
  // --- Audio Collection DTOs ---
  
  export type CollectionType = "COURSE" | "PLAYLIST";
  
  export interface CreateCollectionRequestDTO {
    title: string;
    description?: string;
    type: CollectionType;
    initialTrackIds?: string[]; // Array of UUID strings
  }
  
   export interface UpdateCollectionRequestDTO {
    title?: string; // Make fields optional for PUT/PATCH
    description?: string;
  }
  
  export interface UpdateCollectionTracksRequestDTO {
    orderedTrackIds: string[]; // Array of UUID strings
  }
  
  export interface AudioCollectionResponseDTO {
    id: string; // UUID string
    title: string;
    description?: string;
    ownerId: string; // UUID string
    type: CollectionType;
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string
    tracks?: AudioTrackResponseDTO[]; // Optional: Included in detail view
  }
  
  // --- User Activity DTOs ---
  
  export interface RecordProgressRequestDTO {
    trackId: string; // UUID string
    progressMs: number; // Progress in milliseconds
  }
  
  export interface PlaybackProgressResponseDTO {
    userId: string; // UUID string
    trackId: string; // UUID string
    progressMs: number;
    lastListenedAt: string; // ISO 8601 date string
  }
  
  export interface CreateBookmarkRequestDTO {
    trackId: string; // UUID string
    timestampMs: number; // Timestamp in milliseconds
    note?: string;
  }
  
  export interface BookmarkResponseDTO {
    id: string; // UUID string
    userId: string; // UUID string
    trackId: string; // UUID string
    timestampMs: number;
    note?: string;
    createdAt: string; // ISO 8601 date string
  }
  
  // --- Upload DTOs ---
  
  export interface RequestUploadRequestDTO {
      filename: string;
      contentType: string; // e.g., "audio/mpeg"
  }
  
  export interface RequestUploadResponseDTO {
      uploadUrl: string; // The presigned PUT URL
      objectKey: string; // The key the client should use/report back
  }
  
  // --- Query Parameter Interfaces (Documentation/Helper only) ---
  // These are typically not used directly as DTOs but help define possible parameters
  
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
  
  // Add interfaces for other list query params if needed (Collections, Admin Users, etc.)