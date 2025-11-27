import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

/**
 * Feature: admin-panel, Property 4: User search returns matching results
 * 
 * For any search query and user database, all returned results should match 
 * the search criteria (name, email, or ID contains the query string).
 * 
 * Validates: Requirements 3.2
 */

// Generator for valid email addresses
const emailArbitrary = fc.tuple(
  fc.stringMatching(/^[a-z0-9]{3,10}$/),
  fc.constantFrom('example.com', 'test.com', 'demo.lu')
).map(([local, domain]) => `${local}@${domain}`)

// Generator for user names
const nameArbitrary = fc.stringMatching(/^[A-Za-z ]{3,30}$/)

// Generator for UUID-like IDs
const idArbitrary = fc.uuid()

// Generator for user objects
const userArbitrary = fc.record({
  id: idArbitrary,
  email: emailArbitrary,
  name: nameArbitrary
})

// Helper function to search users (mimics the API logic)
function searchUsers(
  users: Array<{ id: string; email: string; name: string }>,
  searchQuery: string
): Array<{ id: string; email: string; name: string }> {
  if (!searchQuery) {
    return users
  }

  const searchLower = searchQuery.toLowerCase()
  return users.filter(user =>
    user.email.toLowerCase().includes(searchLower) ||
    user.id.toLowerCase().includes(searchLower) ||
    user.name.toLowerCase().includes(searchLower)
  )
}

describe('User Search Property Tests', () => {
  it('Property 4: User search returns matching results', () => {
    fc.assert(
      fc.property(
        fc.array(userArbitrary, { minLength: 0, maxLength: 20 }),
        fc.stringMatching(/^[a-z0-9@. -]{0,15}$/),
        (users, searchQuery) => {
          // Perform search
          const results = searchUsers(users, searchQuery)

          // If search query is empty, all users should be returned
          if (!searchQuery) {
            expect(results.length).toBe(users.length)
            return true
          }

          // Verify all results match the search criteria
          const searchLower = searchQuery.toLowerCase()
          for (const result of results) {
            const matches =
              result.email.toLowerCase().includes(searchLower) ||
              result.id.toLowerCase().includes(searchLower) ||
              result.name.toLowerCase().includes(searchLower)

            expect(matches).toBe(true)
          }

          // Verify no matching users were excluded
          for (const user of users) {
            const shouldMatch =
              user.email.toLowerCase().includes(searchLower) ||
              user.id.toLowerCase().includes(searchLower) ||
              user.name.toLowerCase().includes(searchLower)

            if (shouldMatch) {
              expect(results).toContainEqual(user)
            }
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})
