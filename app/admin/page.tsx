export default function AdminDashboard() {
  return (
    <div style={{ padding: '2.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span style={{ background: '#ef4444', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>ROL: ADMINISTRADOR</span>
          <h1 style={{ fontFamily: 'serif', fontSize: '2.2rem', marginTop: '0.5rem', color: '#fff' }}>Panel Principal de Administración</h1>
        </div>
        <a href="/" className="btn btn-secondary">← Volver al Inicio</a>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">3,842</div>
          <div className="stat-label">Total Expedientes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#10b981' }}>3,710</div>
          <div className="stat-label">Registros Verificados</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#3b82f6' }}>132</div>
          <div className="stat-label">Pendientes de Aprobación</div>
        </div>
      </div>

      <section style={{ background: '#131b2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#fbbf24' }}>Acciones de Administrador</h2>
        <ul style={{ color: '#94a3b8', lineHeight: '2' }}>
          <li>✓ Gestión global de roles de usuario (Admin / OACP General)</li>
          <li>✓ Auditoría y aprobación final de relatos de memoria histórica</li>
          <li>✓ Eliminación y archivado de expedientes duplicados</li>
          <li>✓ Exportación de bases de datos en formatos JSON, CSV y SQL</li>
        </ul>
      </section>
    </div>
  );
}
