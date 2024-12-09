
import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Meu Site</title>
      </head>
      <body>
        <header>
          <h1>Bem-vindo ao Meu Site</h1>
        </header>
        <main>{children}</main>
        <footer>
          <p>© 2024 Meu App</p>
        </footer>
      </body>
    </html>
  )
}
