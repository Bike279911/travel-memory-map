import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#f8f5ed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      padding: '48px',
    }}>
      <p style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '80px',
        fontWeight: 300,
        color: '#d4cfc3',
        margin: '0 0 8px',
        lineHeight: 1,
      }}>
        404
      </p>
      <h1 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '24px',
        fontWeight: 400,
        color: '#322e2b',
        margin: '0 0 12px',
      }}>
        Country not found
      </h1>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '14px',
        color: '#9b9282',
        margin: '0 0 28px',
      }}>
        This country code doesn't exist in our database.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          background: '#322e2b',
          color: '#f8f5ed',
          borderRadius: '8px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '14px',
          fontWeight: 500,
          textDecoration: 'none',
        }}
      >
        Back to map
      </Link>
    </main>
  )
}
