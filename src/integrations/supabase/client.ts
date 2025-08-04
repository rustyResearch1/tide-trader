import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bjgayswhifoubltaaexg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqZ2F5c3doaWZvdWJsdGFhZXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMjE5NjgsImV4cCI6MjA2OTg5Nzk2OH0.hqxde3kXAf5lHRCjzlXYaMEKMHG3Yo0xWEzSZOMzpCM'

export const supabase = createClient(supabaseUrl, supabaseKey)