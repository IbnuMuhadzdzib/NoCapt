import { createClient } from "@supabase/supabase-js";
const supabaseUrl = 'https://mjbqxialtlejhhdvtamm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qYnF4aWFsdGxlamhoZHZ0YW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MTMwMDQsImV4cCI6MjA3NjQ4OTAwNH0.LTK6-6RTmiJNDj9mr-UuA9E3vrMAUcIK7UonTbrWM-c'
export const supabase = createClient(supabaseUrl, supabaseKey);