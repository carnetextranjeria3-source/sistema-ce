import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Portal CE | Consulta privada', description: 'Portal privado para consulta de fichas informativas y gestión de registros autorizados.', robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html>; }
