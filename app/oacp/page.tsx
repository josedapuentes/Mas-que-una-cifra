export default function OACPDashboard() {
  return (
    <div style={{ padding: '2.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span style={{ background: '#3b82f6', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>ROL: OACP GENERAL</span>
          <h1 style={{ fontFamily: 'serif', fontSize: '2.2rem', marginTop: '0.5rem', color: '#fff' }}>Portal Institucional OACP</h1>
          <p style={{ color: '#94a3b8' }}>Oficina del Alto Comisionado para la Paz</p>
        </div>
        <a href="/" className="btn btn-secondary">← Volver al Inicio</a>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">12</div>
          <div className="stat-label">Regiones Asignadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#fbbf24' }}>48</div>
          <div className="stat-label">Expedientes Ingresados este Mes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#10b981' }}>100%</div>
          <div className="stat-label">Cumplimiento Institucional</div>
        </div>
      </div>

      <section style={{ background: '#131b2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#3b82f6' }}>Funcionalidades OACP General</h2>
        <ul style={{ color: '#94a3b8', lineHeight: '2' }}>
          <li>✓ Documentación y creación de nuevos expedientes comunitarios</li>
          <li>✓ Edición y rectificación de testimonios de memoria</li>
          <li>✓ Carga de soportes documentales y archivos de verificación</li>
          <li>✓ Generación de reportes territoriales para la Mesa de Paz</li>
        </ul>
      </section>
    </div>
  );
}
