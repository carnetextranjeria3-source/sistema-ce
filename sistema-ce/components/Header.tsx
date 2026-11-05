export default function Header() {
  return (
    <header
      style={{
        background: '#205b98',
        color: '#fff',
        minHeight: '76px',
        padding: '12px 5%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        borderBottom: '4px solid #dce8f2',
      }}
    >
      <a
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#fff',
          textDecoration: 'none',
        }}
      >
        <span
          style={{
            width: '43px',
            height: '43px',
            border: '2px solid #fff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '17px',
            fontWeight: 900,
          }}
        >
          CE
        </span>

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
