
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
          <p>Ficha informativa de registro privado</p>
        </div>

        <section className="ce-sheet">
          {loading && <p>Buscando registro...</p>}

          {error && <div className="error">{error}</div>}

          {record && (
            <>
              <div className="ce-private-label">
                FICHA INFORMATIVA · NO ES UN DOCUMENTO OFICIAL
              </div>

              <div className="ce-assets">
                <div className="ce-asset">
                  <b>FOTOGRAFÍA</b>
                  <div className="ce-placeholder">ACCESO RESTRINGIDO</div>
                </div>

                <div className="ce-asset">
                  <b>FIRMA</b>
                  <div className="ce-placeholder">ACCESO RESTRINGIDO</div>
                </div>

                <div className="ce-asset">
                  <b>HUELLA</b>
                  <div className="ce-placeholder">ACCESO RESTRINGIDO</div>
                </div>
              </div>

              <h2 className="ce-section-title">DATOS DE LA PERSONA</h2>

              <div className="ce-grid">
                {field('NOMBRE(S)', record.firstNames)}
                {field('APELLIDO(S)', record.surnames)}
                {field('NACIONALIDAD', record.nationality)}
                {field('FECHA DE NACIMIENTO', fmt(record.birthDate))}
                {field('SEXO', record.sex)}
                {field('TIPO DE DOCUMENTO', record.documentType)}
                {field('NÚMERO DE DOCUMENTO', record.documentNumber)}
              </div>

              <h2 className="ce-section-title">
                DATOS DEL REGISTRO PRIVADO
              </h2>

              <div className="ce-grid">
                {field('CALIDAD O CONDICIÓN REGISTRADA', record.migrationStatus)}
                {field('NÚMERO DE REFERENCIA', record.certificateNumber)}
                {field('FECHA DE EMISIÓN', fmt(record.issueDate))}
                {field('FECHA DE CADUCIDAD', fmt(record.expiryDate))}
                {field('VENCIMIENTO DE RESIDENCIA', fmt(record.residenceExpiry))}
              </div>

              <div className="ce-notice">
                Esta ficha presenta información de una base de datos privada.
                No constituye un carné de extranjería, documento de identidad
                ni verificación oficial de una autoridad migratoria.
                Los archivos fotográficos, firmas y datos biométricos
                permanecen protegidos y no se exponen en consultas públicas.
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
          margin: 0 auto 24px;
        }

        .ce-heading span {
          color: #1763a9;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .ce-heading h1 {
          margin: 9px 0;
          font-size: 27px;
          font-weight: 800;
        }

        .ce-heading p {
          color: #61748b;
          font-size: 13px;
        }

        .ce-sheet {
          max-width: 850px;
          margin: auto;
          padding: 24px;
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
          letter-spacing: 1px;
          margin-bottom: 20px;
        }

        .ce-assets {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          padding-bottom: 20px;
          border-bottom: 2px solid #b9c8d8;
        }

        .ce-asset {
          text-align: center;
          font-size: 12px;
        }

        .ce-placeholder {
          min-height: 125px;
          margin-top: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px;
          background: #f0f3f7;
          border: 1px solid #d5deea;
          color: #66778b;
          font-size: 10px;
          font-weight: 700;
        }

        .ce-section-title {
          color: #1763a9;
          text-align: center;
          font-size: 19px;
          font-weight: 800;
          margin: 22px 0 15px;
        }

        .ce-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .ce-field {
          min-width: 0;
        }

        .ce-field span {
          display: block;
          margin: 0 0 5px 7px;
          color: #52647a;
          font-size: 11px;
          font-weight: 600;
        }

        .ce-field strong {
          display: flex;
          align-items: center;
          min-height: 43px;
          padding: 9px 12px;
          border: 1px solid #d5dce5;
          border-radius: 5px;
          background: #edf0f4;
          color: #26364a;
          font-size: 14px;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        .ce-notice {
          margin-top: 22px;
          padding: 13px;
          border-radius: 6px;
          background: #fff6df;
          color: #75551b;
          font-size: 11px;
          line-height: 1.6;
        }

        .ce-actions {
          margin-top: 20px;
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
          .ce-sheet {
            padding: 15px;
          }

          .ce-assets {
            gap: 7px;
          }

          .ce-placeholder {
            min-height: 90px;
            font-size: 8px;
          }

          .ce-grid {
            grid-template-columns: 1fr;
          }

          .ce-section-title {
            font-size: 16px;
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
