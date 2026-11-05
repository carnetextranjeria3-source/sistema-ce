
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
          color: '#fff',
          textDecoration: 'none',
        }}
      >
        <img
          src="/images/portal-ce-logo.png"
          alt="Logo"
          style={{
            width: '190px',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
            flexShrink: 0,
          }}
        />
      </a>

      <span style={{ fontSize: '12px', fontWeight: 600 }}>
        CONSULTA
      </span>
    </header>
  );
}
