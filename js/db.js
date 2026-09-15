/* =====================================================================
   MÓDULO DE INTEGRACIÓN CON SUPABASE - MÁS QUE UNA CIFRA
   ===================================================================== */

const SUPABASE_URL = "https://crvjcjtfjlxhyayvnczq.supabase.co";
const SUPABASE_KEY = "sb_publishable_z6TohrCmlskwYgGVCoLDbw_jzePljei";

// El cliente supabase se inicializa en js/auth.js usando estas constantes
// Las funciones de DB usan getSupabaseClient() definido en auth.js

const DB = {
  // Función para leer registros desde Supabase
  fetchRecords: async (tableName = 'registros_historias') => {
    try {
      const sb = getSupabaseClient();
      const { data, error, status } = await sb
        .from(tableName)
        .select(`
          *,
          perfil:creado_por ( full_name, role )
        `)
        .order('creado_el', { ascending: false });
      
      return { ok: !error, status, data: error ? [] : data, error };
    } catch (err) {
      return { ok: false, error: err };
    }
  },

  getStoryByCode: async (codigo) => {
    const sb = getSupabaseClient();
    const { data, error } = await sb
      .from('registros_historias')
      .select('*')
      .eq('codigo_registro', codigo)
      .single();
    return data;
  },

  saveStory: async (storyData, profile) => {
    const sb = getSupabaseClient();
    const nuevoCodigo = "MQUC-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 9000) + 1000);
    const estado = profile.role === "admin" ? "Verificado" : "En Proceso";

    let foto_url = storyData.foto_url || null;

    if (storyData.foto && typeof storyData.foto.name === 'string') {
      const fileExt = storyData.foto.name.split('.').pop();
      const fileName = `${nuevoCodigo}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await sb.storage
        .from('fotos')
        .upload(filePath, storyData.foto);

      if (!uploadError) {
        const { data: publicData } = sb.storage
          .from('fotos')
          .getPublicUrl(filePath);
        foto_url = publicData.publicUrl;
      }
    }

    const { data, error } = await sb
      .from('registros_historias')
      .insert([
        {
          codigo_registro: nuevoCodigo,
          nombre_persona: storyData.nombre,
          edad: parseInt(storyData.edad) || null,
          region: storyData.region,
          municipio: storyData.municipio,
          fecha_hecho: storyData.fecha || new Date().toISOString().split("T")[0],
          categoria: storyData.categoria,
          tipo_caso: storyData.tipo_caso || 'Entrega digna',
          relato: storyData.relato,
          foto_url: foto_url,
          estado_verificacion: estado,
          creado_por: profile.id
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateStory: async (id, storyData, profile) => {
    const sb = getSupabaseClient();
    
    // Check if there's a new photo to upload
    let foto_url_update = {};
    if (storyData.foto && typeof storyData.foto.name === 'string') {
      const fileExt = storyData.foto.name.split('.').pop();
      const fileName = `Update_${id}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await sb.storage
        .from('fotos')
        .upload(fileName, storyData.foto);

      if (!uploadError) {
        const { data: publicData } = sb.storage
          .from('fotos')
          .getPublicUrl(fileName);
        foto_url_update = { foto_url: publicData.publicUrl };
      }
    }

    const { data, error } = await sb
      .from('registros_historias')
      .update({
        nombre_persona: storyData.nombre,
        edad: parseInt(storyData.edad) || null,
        region: storyData.region,
        municipio: storyData.municipio,
        fecha_hecho: storyData.fecha,
        categoria: storyData.categoria,
        tipo_caso: storyData.tipo_caso,
        relato: storyData.relato,
        ...foto_url_update
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateStatus: async (id, nuevoEstado) => {
    const sb = getSupabaseClient();
    const { data, error } = await sb
      .from('registros_historias')
      .update({ estado_verificacion: nuevoEstado })
      .eq('id', id)
      .select();
    
    return !error;
  },

  deleteStory: async (id) => {
    const sb = getSupabaseClient();
    const { error } = await sb
      .from('registros_historias')
      .delete()
      .eq('id', id);
    return !error;
  }
};

