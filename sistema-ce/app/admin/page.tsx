
'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Header from '@/components/Header';

type PrivateFile = {
  publicId: string;
  format: string;
};

type RecordForm = {
  documentType: string;
  documentNumber: string;
  firstNames: string;
  surnames: string;
  nationality: string;
  birthDate: string;
  sex: string;
  migrationStatus: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  residenceExpiry: string;
  photo: PrivateFile;
  signature: PrivateFile;
  biometricFile: PrivateFile;
  active: boolean;
};

type Row = {
  _id: string;
  documentNumber: string;
  firstNames: string;
  surnames: string;
  active: boolean;
};

const blank: RecordForm = {
  documentType: 'Carné de extranjería',
  documentNumber: '',
  firstNames: '',
  surnames: '',
  nationality: '',
  birthDate: '',
  sex: '',
  migrationStatus: '',
  certificateNumber: '',
  issueDate: '',
  expiryDate: '',
  residenceExpiry: '',
  photo: { publicId: '', format: '' },
  signature: { publicId: '', format: '' },
  biometricFile: { publicId: '', format: '' },
  active: true,
};

function dateValue(value: unknown) {
  return value ? String(value).slice(0, 10) : '';
}

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<RecordForm>({ ...blank });
  const [editing, setEditing] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState('');

  function notify(text: string, error = false) {
    setMessage(text);
    setIsError(error);
  }

  async function load() {
    const response = await fetch('/api/records', {
      cache: 'no-store',
    });

    if (!response.ok) {
      setAuth(false);
      return;
    }

    const data = await response.json();
    setRows(Array.isArray(data) ? data : []);
    setAuth(true);
  }

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch('/api/auth/me', {
          cache: 'no-store',
        });

        const data = await response.json();

        if (data.authenticated) {
          await load();
        }
      } catch {
        setAuth(false);
      } finally {
        setChecking(false);
      }
    }

    checkSession();
  }, []);

  function change<K extends keyof RecordForm>(
    key: K,
    value: RecordForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    notify('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        notify(data.error || 'Credenciales incorrectas', true);
        return;
      }

      setPassword('');
      await load();
    } catch {
      notify('Error de conexión al iniciar sesión', true);
    } finally {
      setBusy(false);
    }
  }

  async function upload(
    kind: 'photo' | 'signature' | 'biometricFile',
    file?: File
  ) {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      notify('El archivo supera el máximo de 5 MB', true);
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      notify('Selecciona una imagen JPG, PNG o WEBP', true);
      return;
    }

    setUploading(kind);
    notify('');

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('kind', kind);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });

      const data = await response.json();

      if (!response.ok) {
        notify(data.error || 'No se pudo cargar el archivo', true);
        return;
      }

      change(kind, {
        publicId: data.publicId,
        format: data.format,
      });

      notify('Archivo cargado. Guarda el registro para asociarlo.');
    } catch {
      notify('Error al cargar el archivo', true);
    } finally {
      setUploading('');
    }
  }

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    notify('');

    try {
      const payload = {
        ...form,
        // El número del carné sirve también como identificador de consulta.
        documentNumber: form.documentNumber.trim(),
        certificateNumber: form.documentNumber.trim(),
      };

      const url = editing
        ? `/api/records/${editing}`
        : '/api/records';

      const response = await fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        notify(data.error || 'No se pudo guardar el registro', true);
        return;
      }

      notify('Registro guardado correctamente.');
      setForm({ ...blank });
      setEditing('');
      await load();
    } catch {
      notify('Error de conexión al guardar', true);
    } finally {
      setBusy(false);
    }
  }

  function edit(record: any) {
    const number =
      record.documentNumber || record.certificateNumber || '';

    setForm({
      ...blank,
      ...record,
      documentType: record.documentType || 'Carné de extranjería',
      documentNumber: number,
      certificateNumber: number,
      birthDate: dateValue(record.birthDate),
      issueDate: dateValue(record.issueDate),
      expiryDate: dateValue(record.expiryDate),
      residenceExpiry: dateValue(record.residenceExpiry),
      photo: record.photo || { publicId: '', format: '' },
      signature: record.signature || { publicId: '', format: '' },
      biometricFile: record.biometricFile || {
        publicId: '',
        format: '',
      },
    });

    setEditing(record._id);
    notify('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar definitivamente este registro?')) return;

    try {
      const response = await fetch(`/api/records/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        notify('No se pudo eliminar el registro', true);
        return;
      }

      notify('Registro eliminado.');
      await load();
    } catch {
      notify('Error al eliminar el registro', true);
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuth(false);
    setRows([]);
    setForm({ ...blank });
  }

  function input(
    label: string,
    key: keyof RecordForm,
    type = 'text',
    required = false
  ) {
    return (
      <div className="field" key={key}>
        <label>{label}</label>
        <input
          type={type}
          required={required}
          value={(form[key] as string) || ''}
          onChange={(e) =>
            change(key, e.target.value as RecordForm[typeof key])
          }
        />
      </div>
    );
  }

  function fileInput(
    key: 'photo' | 'signature' | 'biometricFile',
    label: string
  ) {
    const uploaded = Boolean(form[key]?.publicId);

    return (
      <div className="upload" key={key}>
        <label>{label}</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={uploading !== ''}
          onChange={(e) => upload(key, e.target.files?.[0])}
        />
        <small>
          {uploading === key
            ? 'Cargando archivo...'
            : uploaded
              ? `Archivo cargado: ${form[key].format || 'imagen'}`
              : 'Sin archivo seleccionado'}
        </small>
      </div>
    );
  }

  if (checking) {
    return (
      <>
        <Header />
        <main className="container">
          <section className="card">Verificando acceso...</section>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="container">
        <div className="hero">
          <div className="eyebrow">Administración privada</div>
          <h1>Panel de registros</h1>
          <p>Gestión de registros y archivos asociados.</p>
        </div>

        {!auth ? (
          <section className="card form">
            <h2>Acceso administrativo</h2>

            <form onSubmit={login}>
              <div className="field">
                <label>Correo administrador</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Contraseña</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {message && (
                <div className="error">{message}</div>
              )}

              <button className="btn" disabled={busy}>
                {busy ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
          </section>
        ) : (
          <>
            <div className="actions" style={{ justifyContent: 'flex-end' }}>
              <button className="btn secondary" onClick={logout}>
                Cerrar sesión
              </button>
            </div>

            <div className="admin-layout">
              <aside className="sidebar">
                <strong>PORTAL CE</strong>
                <p>Administración privada de registros.</p>
                <p>
                  Registros: <b>{rows.length}</b>
                </p>
                <p>Archivos restringidos a personal autorizado.</p>
              </aside>

              <div style={{ display: 'grid', gap: 18 }}>
                <section className="card">
                  <h2 style={{ marginTop: 0 }}>
                    {editing ? 'Editar registro' : 'Crear registro'}
                  </h2>

                  <form onSubmit={save}>
                    <h3 className="section-title">
                      Datos de la persona
                    </h3>

                    <div className="grid">
                      {input('Nombres', 'firstNames', 'text', true)}
                      {input('Apellidos', 'surnames', 'text', true)}
                      {input('Nacionalidad', 'nationality', 'text', true)}
                      {input('Fecha de nacimiento', 'birthDate', 'date', true)}

                      <div className="field">
                        <label>Sexo</label>
                        <select
                          value={form.sex}
                          onChange={(e) => change('sex', e.target.value)}
                        >
                          <option value="">No especificado</option>
                          <option>Femenino</option>
                          <option>Masculino</option>
                          <option>Otro</option>
                        </select>
                      </div>

                      {input(
                        'Nro. de Carné CE',
                        'documentNumber',
                        'text',
                        true
                      )}
                    </div>

                    <h3 className="section-title">
                      Datos del carné de extranjería
                    </h3>

                    <div className="grid">
                      {input(
                        'Calidad migratoria',
                        'migrationStatus',
                        'text',
                        true
                      )}
                      {input('Emisión del carné', 'issueDate', 'date')}
                      {input('Caducidad del carné', 'expiryDate', 'date')}
                      {input(
                        'Vencimiento de residencia',
                        'residenceExpiry',
                        'date'
                      )}
                    </div>

                    <h3 className="section-title">
                      Archivos privados asociados
                    </h3>

                    <div className="upload-grid">
                      {fileInput('photo', 'Fotografía')}
                      {fileInput('signature', 'Firma')}
                      {fileInput('biometricFile', 'Huella / archivo biométrico')}
                    </div>

                    <div className="field">
                      <label>
                        <input
                          type="checkbox"
                          checked={form.active}
                          onChange={(e) =>
                            change('active', e.target.checked)
                          }
                        />
                        Registro activo para consulta
                      </label>
                    </div>

                    {message && (
                      <div className={isError ? 'error' : 'success'}>
                        {message}
                      </div>
                    )}

                    <div className="actions">
                      <button
                        className="btn"
                        disabled={busy || uploading !== ''}
                      >
                        {busy
                          ? 'Guardando...'
                          : editing
                            ? 'Guardar cambios'
                            : 'Guardar registro'}
                      </button>

                      <button
                        type="button"
                        className="btn secondary"
                        onClick={() => {
                          setForm({ ...blank });
                          setEditing('');
                          notify('');
                        }}
                      >
                        Limpiar formulario
                      </button>
                    </div>
                  </form>
                </section>

                <section className="card">
                  <h2 style={{ marginTop: 0 }}>
                    Registros existentes
                  </h2>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Nro. de Carné CE</th>
                          <th>Nombre</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>

                      <tbody>
                        {rows.map((record) => (
                          <tr key={record._id}>
                            <td>{record.documentNumber}</td>
                            <td>
                              {record.firstNames} {record.surnames}
                            </td>
                            <td>
                              {record.active ? 'Activo' : 'Inactivo'}
                            </td>
                            <td>
                              <div className="actions" style={{ margin: 0 }}>
                                <button
                                  type="button"
                                  className="btn secondary"
                                  onClick={() => edit(record)}
                                >
                                  Editar
                                </button>

                                <button
                                  type="button"
                                  className="btn danger"
                                  onClick={() => remove(record._id)}
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {!rows.length && (
                      <p>Todavía no hay registros.</p>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        Portal CE · Acceso administrativo restringido
      </footer>
    </>
  );
}
