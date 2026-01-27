import './globals.css'

export const metadata = {
  title: 'LearnAI - AI-Powered Learning Platform',
  description: 'AI learning platform with study planning, notes summarization, exam prep, and doubt solving chatbot',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}