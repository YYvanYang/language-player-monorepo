// apps/admin-panel/_services/adminUserService.ts
import apiClient from '@repo/api-client';
import type { PaginatedResponseDTO, UserResponseDTO } from '@repo/types';
import { buildQueryString } from '@repo/utils'; // Use shared util

// Define specific params for admin listing if different from user-facing
export interface AdminListUsersParams {
    q?: string; // Search by email or name
    provider?: string; // Filter by auth provider
    limit?: number;
    offset?: number;
    sortBy?: 'email' | 'name' | 'createdAt';
    sortDir?: 'asc' | 'desc';
}

export async function listUsers(params?: AdminListUsersParams): Promise<PaginatedResponseDTO<UserResponseDTO>> {
    // Assumes backend endpoint /admin/users exists and requires admin privileges
    const queryString = buildQueryString(params);
    // IMPORTANT: Server Actions/Route Handlers calling this will need to add the Admin Auth Token
    // This service function itself doesn't handle auth.
    const response = await apiClient<PaginatedResponseDTO<UserResponseDTO>>(`/admin/users${queryString}`); // Example endpoint
    return response;
}

export async function getUserDetails(userId: string): Promise<UserResponseDTO> {
    if (!userId) throw new Error("User ID required");
    const response = await apiClient<UserResponseDTO>(`/admin/users/${userId}`); // Example endpoint
    return response;
}