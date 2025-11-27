import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'super_admin'
  name: string
  created_at: string
}

export interface LoginResponse {
  success: boolean
  user?: AdminUser
  accessToken?: string
  refreshToken?: string
  error?: string
}

export interface CheckAuthResponse {
  authenticated: boolean
  user?: AdminUser
  error?: string
}

/**
 * AdminAuthService handles authentication and session management for admin users.
 * It uses Supabase Auth for JWT token handling and verifies admin role from admin_users table.
 */
export class AdminAuthService {
  private static supabase = createClient(supabaseUrl, supabaseAnonKey)

  /**
   * Authenticates an admin user with email and password.
   * Verifies the user exists in admin_users table and has admin role.
   * 
   * @param email - Admin user email
   * @param password - Admin user password
   * @returns LoginResponse with user data and tokens if successful
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Validate inputs
      if (!email || !password) {
        return {
          success: false,
          error: 'Email and password are required'
        }
      }

      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError || !authData.session) {
        return {
          success: false,
          error: authError?.message || 'Invalid email or password'
        }
      }

      // Use service role key to bypass RLS for admin verification
      // This is safe because we've already authenticated the user via Supabase Auth
      const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })

      // Verify user is an admin by checking admin_users table
      const { data: adminUser, error: adminError } = await serviceClient
        .from('admin_users')
        .select('id, email, role, name, created_at')
        .eq('id', authData.user.id)
        .single()

      if (adminError || !adminUser) {
        // User authenticated but is not an admin - sign them out
        await this.supabase.auth.signOut()
        return {
          success: false,
          error: 'Access denied. Admin privileges required.'
        }
      }

      // Update last_login_at
      await this.supabase
        .from('admin_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', adminUser.id)

      return {
        success: true,
        user: adminUser as AdminUser,
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      }
    }
  }

  /**
   * Logs out the current admin user and clears the session.
   * 
   * @returns Promise<boolean> - true if logout successful
   */
  static async logout(): Promise<boolean> {
    try {
      const { error } = await this.supabase.auth.signOut()
      
      if (error) {
        console.error('Logout error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Logout error:', error)
      return false
    }
  }

  /**
   * Checks if the current session is valid and user has admin privileges.
   * Verifies JWT token and admin role.
   * 
   * @returns CheckAuthResponse with authentication status and user data
   */
  static async checkAuth(): Promise<CheckAuthResponse> {
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await this.supabase.auth.getSession()

      if (sessionError || !session) {
        return {
          authenticated: false,
          error: 'No active session'
        }
      }

      // Verify user is an admin
      const { data: adminUser, error: adminError } = await this.supabase
        .from('admin_users')
        .select('id, email, role, name, created_at')
        .eq('id', session.user.id)
        .single()

      if (adminError || !adminUser) {
        // Session exists but user is not an admin
        await this.supabase.auth.signOut()
        return {
          authenticated: false,
          error: 'Admin privileges required'
        }
      }

      return {
        authenticated: true,
        user: adminUser as AdminUser
      }
    } catch (error: any) {
      console.error('Check auth error:', error)
      return {
        authenticated: false,
        error: error.message || 'Authentication check failed'
      }
    }
  }

  /**
   * Refreshes the current session using the refresh token.
   * 
   * @returns Promise<boolean> - true if refresh successful
   */
  static async refreshSession(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.auth.refreshSession()
      
      if (error || !data.session) {
        console.error('Session refresh error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Session refresh error:', error)
      return false
    }
  }

  /**
   * Gets the current admin user from the session.
   * 
   * @returns Promise<AdminUser | null>
   */
  static async getCurrentUser(): Promise<AdminUser | null> {
    const authCheck = await this.checkAuth()
    return authCheck.authenticated ? authCheck.user || null : null
  }

  /**
   * Gets the current session access token.
   * 
   * @returns Promise<string | null>
   */
  static async getAccessToken(): Promise<string | null> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession()
      return session?.access_token || null
    } catch (error) {
      console.error('Get access token error:', error)
      return null
    }
  }
}
