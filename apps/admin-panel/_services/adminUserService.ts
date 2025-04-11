// apps/admin-panel/_services/adminUserService.ts
import apiClient from '@repo/api-client'; // Correct path
import type { PaginatedResponseDTO, UserResponseDTO } from '@repo/types'; // Use shared types
import { buildQueryString } from '@repo/utils'; // Use shared util

// Define specific params for admin user listing
export interface AdminListUsersParams {
    q?: string; // Search by email or name
    provider?: string; // Filter by auth provider ('local', 'google')
    isAdmin?: boolean; // Filter by admin status
    limit?: number;
    offset?: number;
    sortBy?: 'email' | 'name' | 'createdAt' | 'authProvider'; // Allowed sort fields
    sortDir?: 'asc' | 'desc';
}

const ADMIN_USERS_ENDPOINT = '/admin/users'; // Base endpoint for admin user operations

/**
 * Fetches a paginated list of ALL users (requires admin privileges).
 */
export async function listUsers(params?: AdminListUsersParams): Promise<PaginatedResponseDTO<UserResponseDTO>> {
    const queryString = buildQueryString(params);
    const endpoint = `${ADMIN_USERS_ENDPOINT}${queryString}`;
    console.log(`ADMIN SERVICE: Fetching users from: ${endpoint}`);
    try {
        const response = await apiClient<PaginatedResponseDTO<UserResponseDTO>>(endpoint);
        return response;
    } catch (error) {
        console.error(`ADMIN SERVICE: Error listing users:`, error);
        throw error;
    }
}

/**
 * Fetches details for a specific user (requires admin privileges).
 */
export async function getUserDetails(userId: string): Promise<UserResponseDTO> {
    if (!userId) {
        throw new Error("ADMIN SERVICE: User ID required");
    }
    const endpoint = `${ADMIN_USERS_ENDPOINT}/${userId}`;
    console.log(`ADMIN SERVICE: Fetching user details from: ${endpoint}`);
    try {
        const response = await apiClient<UserResponseDTO>(endpoint);
        return response;
    } catch (error) {
        console.error(`ADMIN SERVICE: Error fetching user details for ${userId}:`, error);
        throw error;
    }
}

// Note: Create/Update/Delete user operations are typically handled directly in Server Actions
// using the apiClient, calling the respective ADMIN_USERS_ENDPOINT routes (POST, PUT, DELETE).