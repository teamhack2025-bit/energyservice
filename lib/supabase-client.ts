import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Get current authenticated user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  return user
}

// Get customer ID for authenticated user
export async function getCurrentCustomerId(): Promise<string | null> {
  const user = await getCurrentUser()
  if (!user) {
    console.log('No authenticated user found')
    return null
  }
  
  console.log('Looking up customer for user:', user.id, user.email)
  
  // First try to find by auth_user_id (if linked)
  const { data: customerByAuth, error: authError } = await supabase
    .from('customers')
    .select('id')
    .eq('auth_user_id', user.id)
    .maybeSingle()
  
  if (customerByAuth) {
    console.log('Found customer by auth_user_id:', customerByAuth.id)
    return customerByAuth.id
  }
  
  // Fallback: Look up customer by email
  const { data: customer, error } = await supabase
    .from('customers')
    .select('id')
    .eq('email', user.email)
    .maybeSingle()
  
  if (error) {
    console.error('Error getting customer:', error)
    return null
  }
  
  if (customer) {
    console.log('Found customer by email:', customer.id)
  } else {
    console.log('No customer found for email:', user.email)
  }
  
  return customer?.id || null
}

// Get customer data for authenticated user
export async function getCurrentCustomerData() {
  const user = await getCurrentUser()
  if (!user) {
    console.log('No authenticated user found')
    return null
  }
  
  console.log('Getting customer data for user:', user.id, user.email)
  
  // First try to find by auth_user_id (if linked)
  const { data: customerByAuth, error: authError } = await supabase
    .from('customers')
    .select('*')
    .eq('auth_user_id', user.id)
    .maybeSingle()
  
  if (customerByAuth) {
    console.log('Found customer by auth_user_id:', customerByAuth)
    return customerByAuth
  }
  
  // Fallback: Look up customer by email
  const { data: customer, error } = await supabase
    .from('customers')
    .select('*')
    .eq('email', user.email)
    .maybeSingle()
  
  if (error) {
    console.error('Error getting customer data:', error)
    return null
  }
  
  if (customer) {
    console.log('Found customer by email:', customer)
  } else {
    console.log('No customer found for email:', user.email)
  }
  
  return customer
}
