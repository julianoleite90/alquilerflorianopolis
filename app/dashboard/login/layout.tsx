// Layout vazio para a página de login - não usa o layout do dashboard
// Este layout sobrescreve o layout do dashboard para esta rota específica
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

