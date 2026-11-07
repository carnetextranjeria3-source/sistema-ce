
'use client';

import Header from '@/components/Header';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function Content() {
  const p = useSearchParams();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const doc = p.get('documento') || '';
  const dob = p.get('nacimiento') || '';

  useEffect(() => {
    if (!doc || !dob) return;

    setLoading(true);
    setError('');
    setResult(null);

    fetch('/api/public-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentNumber: doc,
        birthDate: dob
      })
    })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'No se encontró el registro');
        setResult(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [doc, dob]);

  const fmt = (v: string) =>
    v
      ? new Date(v).toLocaleDateString('es-PE', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          timeZone: 'UTC'
        }).toUpperCase()
      : 'NO REGISTRADO';

  const record = result?.record;

  const field = (label: string, value: any, extraClass = '') => (
    <div className={`ce-field ${extraClass}`}>
      <span className="ce-label">{label}</span>
      <div className="ce-value">
        {value || 'NO REGISTRADO'}
      </div>
    </div>
  );

  return (
    <>
      <Header />

      <main className="ce-page">
        <div className="ce-heading">
          <span>PORTAL CE · CONSULTA PRIVADA</span>
          <h1>Resultado de consulta</h1>
          <p>Información de registro privado</p>
        </div>

        <section className="ce-sheet">
          {loading && <p>Buscando registro...</p>}

          {error && <div className="error">{error}</div>}

          {record && (
            <>
              <div className="ce-private-label">
                FICHA INFORMATIVA DE REGISTRO PRIVADO
              </div>

              <div className="ce-assets">
  <div className="ce-asset">
    <b>FOTOGRAFÍA</b>
    <div className="ce-image">
      {record.photoUrl ? (
        <img src={record.photoUrl} alt="Fotografía del registro" />
      ) : (
        <span>FOTOGRAFÍA NO DISPONIBLE</span>
      )}
    </div>
  </div>

  <div className="ce-asset">
    <b>FIRMA</b>
    <div className="ce-image">
      {record.signatureUrl ? (
        <img src={record.signatureUrl} alt="Firma del registro" />
      ) : (
        <span>FIRMA NO DISPONIBLE</span>
      )}
    </div>
  </div>

  <div className="ce-asset">
    <b>HUELLA</b>
    <div className="ce-image">
      {record.biometricFileUrl ? (
        <img src={record.biometricFileUrl} alt="Huella del registro" />
      ) : (
        <span>HUELLA NO DISPONIBLE</span>
      )}
    </div>
  </div>
</div>

              <h2 className="ce-section-title">DATOS DE LA PERSONA</h2>

              <div className="ce-grid">
                {field('NOMBRE(S)', record.firstNames)}
                {field('APELLIDO(S)', record.surnames)}
                {field('NACIONALIDAD', record.nationality)}
                {field('FECHA DE NACIMIENTO', fmt(record.birthDate))}
                {field('SEXO', record.sex, 'ce-centered')}
              </div>

              <div className="ce-divider" />

              <h2 className="ce-section-title">
                DATOS DEL REGISTRO PRIVADO
              </h2>

              <div className="ce-grid">
                {field('CALIDAD MIGRATORIA', record.migrationStatus)}
                {field('NRO. DE CARNÉ CE', record.certificateNumber)}
                {field('EMISIÓN DEL REGISTRO', fmt(record.issueDate))}
                {field('CADUCIDAD DEL REGISTRO', fmt(record.expiryDate))}
                {field('VENCIMIENTO DE RESIDENCIA', fmt(record.residenceExpiry), 'ce-centered')}
              </div>

              <div className="ce-notice" style={{ backgroundColor: '#e3f4e7', color: '#245c35' }}>
                Esta ficha contiene información registrada en los sistemas institucionales. 
                Los datos personales y biométricos se encuentran protegidos conforme a la normativa vigente. 
                Su acceso está sujeto a los controles de seguridad y autorización correspondientes.
              </div>
            </>
          )}

          {!loading && !error && !record && (
            <p>Realiza una consulta para visualizar la información.</p>
          )}

          <div className="ce-actions">
            <a href="/" className="btn secondary">NUEVA CONSULTA</a>
          </div>
        </section>
      </main>

      <footer className="ce-footer">
        PORTAL CE · SISTEMA PRIVADO DE CONSULTAS
      </footer>

      <style jsx>{`
        .ce-page {
          min-height: 80vh;
          padding: 32px 16px 55px;
          background: #edf2f8;
          color: #172d49;
        }

        .ce-heading {
          text-align: center;
          margin: 0 auto 25px;
        }

        .ce-heading span {
          color: #1763a9;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .ce-heading h1 {
          margin: 10px 0;
          font-family: Manrope, sans-serif;
          font-size: 27px;
          font-weight: 800;
        }

        .ce-heading p {
          color: #61748b;
          font-size: 13px;
        }

        .ce-sheet {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 850px;
  margin: 0 auto;
  padding: 26px;
  background: #fff;
  border: 1px solid #d6e0eb;
  border-radius: 13px;
  box-shadow: 0 8px 28px rgba(20, 45, 75, .07);
}

.ce-sheet::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('/images/portal-ce-logo.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: min(65%, 430px);
  opacity: .07;
  pointer-events: none;
  z-index: 0;
}

.ce-sheet > * {
  position: relative;
  z-index: 1;
}

        .ce-private-label {
          text-align: center;
          font-size: 10px;
          font-weight: 800;
          color: #1763a9;
          letter-spacing: 1.3px;
          margin-bottom: 22px;
        }

        .ce-assets {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
          padding-bottom: 22px;
          border-bottom: 2px solid #b9c8d8;
        }

        .ce-asset {
          min-width: 0;
          text-align: center;
          font-size: 12px;
        }

        .ce-asset b {
          display: block;
          margin-bottom: 9px;
          font-size: 12px;
        }

        .ce-image {
  position: relative;
  height: 125px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 5px;
  background: #f0f3f7;
  border: 1px solid #d5deea;
  color: #66778b;
  font-size: 10px;
  text-align: center;
}

.ce-image::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('/images/portal-ce-marca-agua.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100px auto;
  opacity: .12;
  pointer-events: none;
  z-index: 0;
}

.ce-image img,
.ce-image span {
  position: relative;
  z-index: 1;
}

.ce-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.ce-image span {
  font-size: 10px;
  font-weight: 700;
}

        .ce-section-title {
          color: #1763a9;
          text-align: center;
          font-family: Manrope, sans-serif;
          font-size: 19px;
          font-weight: 800;
          margin: 25px 0 20px;
        }

        .ce-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 22px;
          row-gap: 18px;
        }

        .ce-field {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          min-width: 0;
          gap: 7px;
        }

        .ce-label {
          display: block;
          width: 100%;
          padding-left: 2px;
          color: #52647a;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.4;
          text-align: left;
        }

        .ce-value {
          display: block;
          width: 100%;
          min-height: 48px;
          padding: 13px 14px;
          border: 1px solid #d5dce5;
          border-radius: 6px;
          background: #f0f2f5;
          color: #26364a;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.45;
          overflow-wrap: anywhere;
          white-space: normal;
        }

        .ce-centered {
          grid-column: 1 / -1;
          width: 50%;
          justify-self: center;
        }

        .ce-centered .ce-label {
          text-align: center;
        }

        .ce-centered .ce-value {
          text-align: center;
        }

        .ce-divider {
          height: 1px;
          width: 100%;
          background: #b9c8d8;
          margin-top: 25px;
        }

        .ce-notice {
          margin-top: 24px;
          padding: 14px;
          border-radius: 7px;
          background: #fff6df;
          color: #75551b;
          font-size: 11px;
          line-height: 1.7;
        }

        .ce-actions {
          margin-top: 18px;
        }

        .ce-footer {
          padding: 20px;
          background: #174a78;
          color: white;
          text-align: center;
          font-size: 11px;
          letter-spacing: 1px;
        }

        @media (max-width: 600px) {
          .ce-page {
            padding: 22px 10px 35px;
          }

          .ce-sheet {
            padding: 16px;
          }

          .ce-assets {
            gap: 7px;
          }

          .ce-image {
  height: 90px;
}

          .ce-grid {
            grid-template-columns: 1fr;
            row-gap: 15px;
          }

          .ce-centered {
            grid-column: auto;
            width: 100%;
          }

          .ce-section-title {
            font-size: 16px;
          }

          .ce-value {
            min-height: 45px;
          }
        }
      `}</style>
    </>
  );
}

export default function Consulta() {
  return (
    <Suspense fallback={<p>Cargando consulta...</p>}>
      <Content />
    </Suspense>
  );
}
