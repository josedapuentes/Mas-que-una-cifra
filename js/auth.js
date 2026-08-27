/* =====================================================================
   MÓDULO DE AUTENTICACIÓN - SUPABASE AUTH
   Requiere que js/db.js se cargue antes para tener SUPABASE_URL y SUPABASE_KEY
   Requiere que el CDN de @supabase/supabase-js esté cargado en el HTML
   ===================================================================== */

let supabaseClient = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  // Verificar que la librería CDN de Supabase se cargó
  if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
    throw new Error('La librería de Supabase no se cargó. Verifica tu conexión a internet.');
  }

  // Verificar que db.js definió las constantes
  if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_KEY === 'undefined') {
    throw new Error('Las credenciales de Supabase no están definidas. Verifica que js/db.js se cargó antes.');
  }

  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  return supabaseClient;
}

const AUTH = {
  login: async (email, password) => {
    const sb = getSupabaseClient();
    return await sb.auth.signInWithPassword({
      email: email,
      password: password
    });
  },

  logout: async () => {
    const sb = getSupabaseClient();
    const { error } = await sb.auth.signOut();
    if (!error) {
      window.location.href = 'login.html';
    }
    return { error };
  },

  getSession: async () => {
    const sb = getSupabaseClient();
    const { data: { session }, error } = await sb.auth.getSession();
    return session;
  },

  getUserProfile: async (userId) => {
    const sb = getSupabaseClient();
    const { data, error } = await sb
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  requireAuth: async () => {
    const session = await AUTH.getSession();
    if (!session) {
      window.location.href = 'login.html';
      return null;
    }
    
    // Si hay sesión, intentamos cargar el perfil para obtener el rol real
    const { data: profile } = await AUTH.getUserProfile(session.user.id);
    
    return { 
      session, 
      user: session.user,
      profile: profile || { role: 'oacp_general', full_name: 'Usuario OACP', department: 'OACP' }
    };
  }
};
