
import Header from '@/components/Header';

export default function Home() {
  return (
    <>
      <Header />

      <main className="container">
        <div className="hero">
          <div className="eyebrow">PORTAL DE CONSULTA PRIVADA</div>

          <h1>Consultas en Línea</h1>

          <p>
            Acceda a su ficha informativa ingresando los datos de identificación solicitados. 
            Consulte la información registrada en los sistemas institucionales de Migraciones.
          </p>
        </div>

        <section className="card form">
          <h2 style={{ fontFamily: 'Manrope', marginTop: 0 }}>
            Buscar un registro
          </h2>

          <p
            style={{
              color: 'var(--muted)',
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            Ingresa el número de documento y la fecha de nacimiento
            asociados al registro.
          </p>

          <form action="/consulta">
            <div className="field">
              <label>Número de documento</label>
              <input
                name="documento"
                required
                maxLength={32}
                placeholder="Ej. CE-00012345"
              />
            </div>

            <div className="field">
              <label>Fecha de nacimiento</label>
              <input name="nacimiento" type="date" required />
            </div>

            <button className="btn" style={{ width: '100%' }}>
              Continuar con la consulta
            </button>
          </form>

          <div className="notice">
            AVISO INSTITUCIONAL: Plataforma oficial de consulta de información migratoria. 
            Servicio destinado a facilitar el acceso a los servicios y procedimientos de Migraciones.
          </div>
        </section>

        <div
          style={{
            textAlign: 'center',
            marginTop: 18,
            fontSize: 12,
            color: 'var(--muted)',
          }}
        >
          ¿Administras los registros?{' '}
          <a
            href="/admin"
            style={{ color: 'var(--blue)', fontWeight: 700 }}
          >
            Acceso administrativo
          </a>
        </div>
      </main>

      <footer
        style={{
          width: '100%',
          background: '#28609f',
          color: '#ffffff',
          padding: '22px 16px',
          textAlign: 'center',
          fontSize: 12,
          lineHeight: 1.8,
          letterSpacing: '0.5px',
        }}
      >
        PORTAL CE · GESTIÓN DE INFORMACIÓN
        <br />
        SISTEMA DE CONSULTAS · ACCESO AUTORIZACIÓN
      </footer>
    </>
  );
}
