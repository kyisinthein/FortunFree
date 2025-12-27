// Configuration with Supabase credentials 
export const config = { 
  supabase: { 
    url: 'https://kofcitribiroufhhecem.supabase.co', 
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvZmNpdHJpYmlyb3VmaGhlY2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3OTc2NDIsImV4cCI6MjA1OTM3MzY0Mn0.fWTWnbpSBS5QCDi81n9goKA8dW7pqxE0MNntpj8y-1Y' 
  }, 
  deepseek: { 
    apiKey: 'sk-8e8b3cf59fb74f49be40ce28c96ccf49' 
  } 
}; 
 
// Validation 
if (!config.supabase.url || !config.supabase.anonKey) { 
  throw new Error('Missing Supabase configuration'); 
} 
 
if (!config.deepseek.apiKey) { 
  console.warn('Missing DeepSeek API key'); 
}