import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { AdminAuthService } from './AdminAuthService'

/**
 * Property-Based Tests for AdminAuthService
 * 
 * These tests verify universal properties that should hold across all inputs.
 * 
 * Note: These tests require a valid admin user to exist in the database.
 * The test uses environment variables to specify test credentials:
 * - TEST_ADMIN_EMAIL: Email of an existing admin user
 * - TEST_ADMIN_PASSWORD: Password for the admin user
 * 
 * If these are not set, the tests will be skipped.
 */

// Test admin user credentials from environment
const TEST_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL
const TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD

describe('AdminAuthService - Property-Based Tests', () => {
  /**
   * **Feature: admin-panel, Property 1: Valid credentials authenticate successfully**
   * **Validates: Requirements 1.2**
   * 
   * For any valid administrator credentials, submitting them through the login system
   * should result in successful authentication and a valid session token.
   * 
   * This property verifies that:
   * 1. Authentication succeeds with valid credentials
   * 2. A user object is returned with correct email and role
   * 3. A valid JWT access token is provided
   * 4. No error is present in the response
   */
  it('Property 1: Valid credentials authenticate successfully', async () => {
    // Skip test if credentials are not configured
    if (!TEST_ADMIN_EMAIL || !TEST_ADMIN_PASSWORD) {
      console.warn('Skipping test: TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD must be set')
      return
    }

    await fc.assert(
      fc.asyncProperty(
        // Generate the same valid credentials multiple times to test consistency
        fc.constant({ email: TEST_ADMIN_EMAIL, password: TEST_ADMIN_PASSWORD }),
        async (credentials) => {
          // Attempt login with valid credentials
          const result = await AdminAuthService.login(credentials.email, credentials.password)

          // Debug: Log failures
          if (!result.success) {
            console.error(`Login failed on iteration: ${result.error}`)
          }

          // Property: Valid credentials should always result in successful authentication
          expect(result.success).toBe(true)
          expect(result.user).toBeDefined()
          expect(result.user?.email).toBe(credentials.email)
          expect(result.user?.role).toMatch(/^(admin|super_admin)$/)
          expect(result.accessToken).toBeDefined()
          expect(result.accessToken).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/) // JWT format
          expect(result.error).toBeUndefined()

          // Verify user object has all required fields
          expect(result.user?.id).toBeDefined()
          expect(result.user?.name).toBeDefined()
          expect(result.user?.created_at).toBeDefined()

          // Clean up session after test
          await AdminAuthService.logout()
        }
      ),
      { 
        numRuns: 10 // Reduced from 100 to avoid Supabase rate limiting on auth endpoints
      }
    )
  }, 30000) // 30 second timeout for all iterations
})
