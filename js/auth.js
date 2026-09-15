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
  login: async (emailOrUsername, password) => {
    const sb = getSupabaseClient();
    
    let email = emailOrUsername.trim();

    // Si no tiene @, asumimos que es un nombre de usuario
    // Buscamos su correo real en la tabla profiles por full_name
    if (!email.includes('@')) {
      const { data: profileData } = await sb
        .from('profiles')
        .select('email')
        .ilike('full_name', email)
        .single();
      
      if (profileData && profileData.email) {
        email = profileData.email;
      } else {
        return { data: null, error: { message: 'No se encontró un usuario con ese nombre. Intenta con tu correo electrónico.' } };
      }
    }

    return await sb.auth.signInWithPassword({
      email: email,
      password: password
    });
  },

  registerUser: async (username, realEmail, password) => {
    // Usamos un cliente secundario para no cerrar la sesión del admin actual
    const tempSb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { storageKey: 'temp_signup_session', persistSession: false }
    });

    const { data, error } = await tempSb.auth.signUp({
      email: realEmail,
      password: password,
      options: {
        data: {
          full_name: username,
          role: 'oacp_general'
        }
      }
    });

    // Después de crear el usuario, guardamos el perfil
    if (!error && data.user) {
      const sb = getSupabaseClient(); // sesión del admin
      await sb.from('profiles').upsert({
        id: data.user.id,
        full_name: username,
        email: realEmail,
        role: 'oacp_general'
      });
    }
    
    return { data, error };
  },

  getAllUsers: async () => {
    const sb = getSupabaseClient();
    const { data, error } = await sb
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data || [], error };
  },

  updateUser: async (userId, updates) => {
    const sb = getSupabaseClient();
    const { data, error } = await sb
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  deleteUser: async (userId) => {
    const sb = getSupabaseClient();
    const { error } = await sb
      .from('profiles')
      .delete()
      .eq('id', userId);
    return { error };
  },

  updateUserPassword: async (userId, newPassword) => {
    const sb = getSupabaseClient();
    const { data: { session } } = await sb.auth.getSession();
    
    // Si el usuario cambia su propia contraseña -> Usa la API nativa de Supabase Auth
    if (session && session.user && session.user.id === userId) {
      const { data, error } = await sb.auth.updateUser({ password: newPassword });
      return { data, error };
    }
    
    // Si un Administrador cambia la contraseña de otro usuario vía RPC
    const { data, error } = await sb.rpc('admin_update_user_password', {
      target_user_id: userId,
      new_password: newPassword
    });

    if (error && error.message && error.message.includes('Could not find the function')) {
      return { 
        data: null, 
        error: { 
          message: 'La función RPC no existe en Supabase aún. Copia y ejecuta el script SQL en el SQL Editor de Supabase.' 
        } 
      };
    }
    
    return { data, error };
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
    
    const { data: profile } = await AUTH.getUserProfile(session.user.id);
    
    return { 
      session, 
      user: session.user,
      profile: profile || { role: 'oacp_general', full_name: 'Usuario OACP', department: 'OACP' }
    };
  }
};
