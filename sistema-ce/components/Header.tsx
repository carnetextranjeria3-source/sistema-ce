
export default function Header() {
  return (
    <header
      style={{
        background: '#205b98',
        color: '#fff',
        minHeight: '76px',
        padding: '10px 5%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        borderBottom: '3px solid #dce8f2',
      }}
    >
      <a
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          color: '#fff',
          textDecoration: 'none',
        }}
      >
        <img
          src="/images/portal-ce-logo.png"
          alt="Logo Portal CE"
          style={{
            width: '230px',
height: '230px',
            objectFit: 'contain',
          }}
        />

        <span>
          <strong style={{ display: 'block', fontSize: '21px' }}>
            PORTAL CE
          </strong>
          <small style={{ fontSize: '9px', letterSpacing: '1.5px' }}>
            GESTIÓN PRIVADA DE REGISTROS
          </small>
        </span>
      </a>

      <span style={{ fontSize: '12px', fontWeight: 600 }}>
        CONSULTA PRIVADA
      </span>
    </header>
  );
}
