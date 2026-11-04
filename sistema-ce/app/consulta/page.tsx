
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

  const field = (label: string, value: any) => (
    <div className="ce-field">
      <span>{label}</span>
      <strong>{value || 'NO REGISTRADO'}</strong>
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
          {loading && <p className="ce-message">Buscando registro...</p>}

          {error && <div className="error">{error}</div>}

          {record && (
            <>
              <div className="ce-private-label">
                FICHA INFORMATIVA DE REGISTRO PRIVADO
              </div>

              <div className="ce-assets">
                <div className="ce-asset">
                  <b>FOTOGRAFÍA</b>
                  <div className="ce-placeholder">ARCHIVO PROTEGIDO</div>
                </div>

                <div className="ce-asset">
                  <b>FIRMA</b>
                  <div className="ce-placeholder">ARCHIVO PROTEGIDO</div>
                </div>

                <div className="ce-asset">
                  <b>HUELLA</b>
                  <div className="ce-placeholder">ARCHIVO PROTEGIDO</div>
                </div>
              </div>

              <h2 className="ce-section-title">DATOS DE LA PERSONA</h2>

              <div className="ce-grid">
                {field('NOMBRE(S)', record.firstNames)}
                {field('APELLIDO(S)', record.surnames)}
                {field('NACIONALIDAD', record.nationality)}
                {field('FECHA DE NACIMIENTO', fmt(record.birthDate))}
                {field('SEXO', record.sex)}
              </div>

              <div className="ce-divider" />

              <h2 className="ce-section-title">
                DATOS DEL REGISTRO PRIVADO
              </h2>

              <div className="ce-grid">
                {field('CALIDAD MIGRATORIA', record.migrationStatus)}
                {field('NRO. DE CARNÉ CE', record.certificateNumber)}
                {field('EMISIÓN DEL CARNÉ', fmt(record.issueDate))}
                {field('CADUCIDAD DEL CARNÉ', fmt(record.expiryDate))}
                {field('VENCIMIENTO DE RESIDENCIA', fmt(record.residenceExpiry))}
              </div>

              <div className="ce-notice">
                Esta ficha contiene información de una base de datos privada.
                No constituye un documento de identidad ni una verificación
                oficial de una autoridad migratoria. Las fotografías, firmas
                y datos biométricos permanecen protegidos y no se muestran
                en consultas públicas.
              </div>
            </>
          )}

          {!loading && !error && !record && (
            <p className="ce-message">
              Realiza una consulta para visualizar la información.
            </p>
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
          margin: 0 auto 24px;
        }

        .ce-heading span {
          color: #1763a9;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .ce-heading h1 {
          margin: 10px 0 8px;
          font-size: 27px;
          font-weight: 800;
        }

        .ce-heading p {
          color: #61748b;
          font-size: 13px;
          margin: 0;
        }

        .ce-sheet {
          width: 100%;
          max-width: 850px;
          margin: auto;
          padding: 26px;
          background: white;
          border: 1px solid #d6e0eb;
          border-radius: 12px;
          box-shadow: 0 8px 28px rgba(20, 45, 75, .07);
        }

        .ce-private-label {
          text-align: center;
          font-size: 10px;
          font-weight: 800;
          color: #1763a9;
          letter-spacing: 1.2px;
          margin-bottom: 22px;
        }

        .ce-assets {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
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
          color: #26364a;
        }

        .ce-placeholder {
          min-height: 125px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px;
          background: #f0f3f7;
          border: 1px solid #d5deea;
          color: #66778b;
          font-size: 10px;
          font-weight: 700;
          text-align: center;
        }

        .ce-section-title {
          color: #1763a9;
          text-align: center;
          font-size: 19px;
          font-weight: 800;
          margin: 25px 0 20px;
        }

        .ce-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 22px;
          row-gap: 17px;
        }

        .ce-field {
          display: flex;
          flex-direction: column;
          min-width: 0;
          gap: 7px;
        }

        .ce-field span {
          display: block;
          padding-left: 4px;
          color: #52647a;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.4;
        }

        .ce-field strong {
          display: flex;
          align-items: center;
          min-height: 44px;
          padding: 10px 13px;
          border: 1px solid #d5dce5;
          border-radius: 6px;
          background: #f0f2f5;
          color: #26364a;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .ce-divider {
          height: 1px;
          background: #b9c8d8;
          margin-top: 25px;
        }

        .ce-notice {
          margin-top: 24px;
          padding: 14px;
          border-radius: 6px;
          background: #fff6df;
          color: #75551b;
          font-size: 11px;
          line-height: 1.7;
        }

        .ce-actions {
          margin-top: 20px;
        }

        .ce-message {
          text-align: center;
          padding: 20px;
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
            gap: 8px;
          }

          .ce-placeholder {
            min-height: 90px;
            font-size: 8px;
          }

          .ce-grid {
            grid-template-columns: 1fr;
            row-gap: 14px;
          }

          .ce-section-title {
            font-size: 16px;
            margin: 22px 0 17px;
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
