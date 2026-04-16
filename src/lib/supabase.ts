import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://ikwnsxmicvnjoioaoswr.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVhOGY3NDAxLTZmY2MtNGFkMy1iODA2LWFiYWE0YTM2Mzc4ZSJ9.eyJwcm9qZWN0SWQiOiJpa3duc3htaWN2bmpvaW9hb3N3ciIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc2MzM0ODEwLCJleHAiOjIwOTE2OTQ4MTAsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.NzoseeyMehg6Ri5k_gF5ezMvrnpakEuENliWuBmLiJc';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };