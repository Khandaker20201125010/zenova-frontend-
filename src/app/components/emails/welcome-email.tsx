/* eslint-disable react/no-unescaped-entities */
// components/emails/welcome-email.tsx
interface WelcomeEmailProps {
  name: string
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#3b82f6", padding: "40px", textAlign: "center" }}>
        <h1 style={{ color: "white", margin: 0 }}>Welcome to SaaS Platform!</h1>
      </div>
      <div style={{ padding: "40px", backgroundColor: "#f9fafb" }}>
        <h2 style={{ color: "#111827", marginTop: 0 }}>
          Hi {name},
        </h2>
        <p style={{ color: "#6b7280", lineHeight: "1.6" }}>
          Thank you for joining SaaS Platform! We're excited to have you on board.
        </p>
        <p style={{ color: "#6b7280", lineHeight: "1.6" }}>
          Get started by exploring our features:
        </p>
        <ul style={{ color: "#6b7280", lineHeight: "1.6" }}>
          <li>Dashboard analytics</li>
          <li>Product management</li>
          <li>Order tracking</li>
          <li>Blog system</li>
        </ul>
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <a
            href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Go to Dashboard
          </a>
        </div>
      </div>
      <div style={{ backgroundColor: "#f3f4f6", padding: "20px", textAlign: "center" }}>
        <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
          © {new Date().getFullYear()} SaaS Platform. All rights reserved.
        </p>
        <p style={{ color: "#6b7280", fontSize: "12px", margin: "10px 0 0" }}>
          If you didn't create this account, please ignore this email.
        </p>
      </div>
    </div>
  )
}