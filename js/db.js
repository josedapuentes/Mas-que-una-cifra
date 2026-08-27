/* =====================================================================
   MÓDULO DE INTEGRACIÓN DIRECTA CON SUPABASE REST API & LOCAL STORAGE
   ===================================================================== */

const SUPABASE_URL = "https://crvjcjtfjlxhyayvnczq.supabase.co";
const SUPABASE_KEY = "sb_publishable_z6TohrCmlskwYgGVCoLDbw_jzePljei";

// Semilla local por defecto
const INITIAL_STORIES = [
  {
    id: "mquc-001",
    codigo: "MQUC-2026-001",
    nombre: "María Esperanza Benítez",
    edad: 48,
    region: "Catatumbo",
    municipio: "Tibú",
    fecha: "2021-05-14",
    categoria: "Líder Comunitaria",
    relato: "Promotora de proyectos comunitarios de sustitución de cultivos y tejedora de paz en la vereda Caño Indio.",
    estado: "Verificado",
    creadoPor: "OACP General"
  },
  {
    id: "mquc-002",
    codigo: "MQUC-2026-002",
    nombre: "Javier Orlando Montes",
    edad: 32,
    region: "Montes de María",
    municipio: "San Jacinto",
    fecha: "2019-11-03",
    categoria: "Gestor Cultural",
    relato: "Músico gaitero y formador tradicional que enseñó a más de 120 jóvenes el arte de la música folclórica como alternativa de vida.",
    estado: "Verificado",
    creadoPor: "Admin"
  },
  {
    id: "mquc-003",
    codigo: "MQUC-2026-003",
    nombre: "Carmen Alicia Guanga",
    edad: 55,
    region: "Pacifico Nariñense",
    municipio: "Tumaco",
    fecha: "2022-02-28",
    categoria: "Defensora del Territorio",
    relato: "Lideresa étnica afrodescendiente comprometida con la soberanía alimentaria y la preservación ambiental de los manglares.",
    estado: "En Proceso",
    creadoPor: "OACP General"
  }
];

const DB = {
  // Función asíncrona para consultar directamente Supabase en vivo
  fetchFromSupabase: async (tableName = 'Datos entregas dignas - OACP') => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?select=*`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      const data = await response.json();
      return { ok: response.ok, status: response.status, data };
    } catch (err) {
      return { ok: false, error: err };
    }
  },

  getStories: () => {
    const data = localStorage.getItem("MQUC_STORIES");
    if (!data) {
      localStorage.setItem("MQUC_STORIES", JSON.stringify(INITIAL_STORIES));
      return INITIAL_STORIES;
    }
    return JSON.parse(data);
  },

  getStoryByCode: (codigo) => {
    const stories = DB.getStories();
    return stories.find(s => s.codigo === codigo || s.id === codigo);
  },

  saveStory: async (story) => {
    const stories = DB.getStories();
    const newStory = {
      id: "mquc-" + Date.now(),
      codigo: "MQUC-2026-" + String(Math.floor(Math.random() * 900) + 100),
      fecha: new Date().toISOString().split("T")[0],
      estado: story.creadoPor === "Admin" ? "Verificado" : "En Proceso",
      ...story
    };
    stories.unshift(newStory);
    localStorage.setItem("MQUC_STORIES", JSON.stringify(stories));

    // Intenta enviar la historia directamente a Supabase vía REST
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/Datos%20entregas%20dignas%20-%20OACP`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          codigo_registro: newStory.codigo,
          nombre_persona: newStory.nombre,
          edad: parseInt(newStory.edad) || 0,
          region: newStory.region,
          municipio: newStory.municipio,
          fecha_hecho: newStory.fecha,
          categoria: newStory.categoria,
          relato: newStory.relato,
          estado_verificacion: newStory.estado
        })
      });
    } catch (e) {
      console.log("Inserción remota Supabase omitida:", e);
    }

    return newStory;
  },

  updateStatus: (codigo, nuevoEstado) => {
    const stories = DB.getStories();
    const index = stories.findIndex(s => s.codigo === codigo);
    if (index !== -1) {
      stories[index].estado = nuevoEstado;
      localStorage.setItem("MQUC_STORIES", JSON.stringify(stories));
      return true;
    }
    return false;
  },

  deleteStory: (codigo) => {
    let stories = DB.getStories();
    stories = stories.filter(s => s.codigo !== codigo);
    localStorage.setItem("MQUC_STORIES", JSON.stringify(stories));
  },

  getRole: () => {
    return localStorage.getItem("MQUC_ROLE") || "oacp";
  },

  setRole: (role) => {
    localStorage.setItem("MQUC_ROLE", role);
  }
};
