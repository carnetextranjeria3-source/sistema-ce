
export default function Header() {
  return (
    <header
      className="top"
      style={{
        background: '#28609f',
        color: '#ffffff',
        minHeight: '72px',
        padding: '14px max(22px, calc((100% - 1120px) / 2))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <a
        href="/"
        className="brand"
        style={{
          color: '#ffffff',
          fontFamily: 'Manrope, sans-serif',
          fontSize: '20px',
          fontWeight: 800,
          textDecoration: 'none',
        }}
      >
        PORTAL CE
        <small
          style={{
            display: 'block',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '1.5px',
          }}
        >
          GESTIÓN PRIVADA DE REGISTROS
        </small>
      </a>

      <span style={{ fontSize: '12px', color: '#ffffff' }}>
        CONSULTA PRIVADA
      </span>
    </header>
  );
}
