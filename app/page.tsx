import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos, error } = await supabase.from('todos').select()
  const { data: historias } = await supabase.from('registros_historias').select()

  return (
    <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ color: '#fbbf24', fontSize: '2rem' }}>Más que una cifra — Conexión Backend Supabase</h1>
        <p style={{ color: '#94a3b8' }}>Oficina del Alto Comisionado para la Paz (OACP)</p>
      </header>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#f8fafc' }}>
          Lista de Tareas Institucionales (`todos`)
        </h2>
        
        {error && (
          <p style={{ color: '#f43f5e' }}>Nota: Conéctate a Supabase ejecutando los scripts SQL en `bd/schema.sql` y `bd/seed.sql`.</p>
        )}

        <ul style={{ listStyleType: 'square', paddingLeft: '1.5rem', color: '#e2e8f0' }}>
          {todos && todos.length > 0 ? (
            todos.map((todo: any) => (
              <li key={todo.id} style={{ margin: '0.5rem 0' }}>
                <strong>{todo.name}</strong> {todo.is_complete ? "✓ (Completada)" : "⏳ (Pendiente)"}
              </li>
            ))
          ) : (
            <li>No hay tareas registradas aún o la tabla está en inicialización.</li>
          )}
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#f8fafc' }}>
          Expedientes de Historias (`registros_historias`)
        </h2>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {historias && historias.length > 0 ? (
            historias.map((story: any) => (
              <div key={story.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#fbbf24' }}>{story.codigo_registro}</span>
                <h3 style={{ margin: '0.5rem 0', color: '#fff' }}>{story.nombre_persona}</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{story.municipio}, {story.region}</p>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '0.5rem' }}>{story.relato}</p>
              </div>
            ))
          ) : (
            <p style={{ color: '#94a3b8' }}>Ejecuta el script SQL en Supabase para ver las historias sembradas.</p>
          )}
        </div>
      </section>
    </main>
  )
}
