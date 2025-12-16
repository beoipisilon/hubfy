import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Hubfy Task Manager',
    description: 'Sistema de gestão de tarefas',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
        <body>{children}</body>
        </html>
    )
}