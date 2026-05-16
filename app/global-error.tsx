"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// global-error.tsx catches errors in the root layout itself.
// It replaces the entire page, so it cannot use layout components.
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[global-error-boundary]", error);
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          background: "#f8fafb"
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            textAlign: "center",
            padding: "2.5rem",
            background: "#fff",
            borderRadius: "1.5rem",
            boxShadow: "0 2px 24px rgba(0,0,0,0.07)"
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#0e4f59",
              marginBottom: "1rem"
            }}
          >
            Error crítico
          </p>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#0f172a" }}>
            La aplicación encontró un problema.
          </h1>
          <p style={{ color: "#475569", lineHeight: 1.75, marginBottom: "1.5rem" }}>
            Ocurrió un error inesperado. Por favor intenta de nuevo o vuelve más tarde.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#0e4f59",
              color: "#fff",
              border: "none",
              borderRadius: "9999px",
              padding: "0.75rem 2rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Intentar de nuevo
          </button>
          {error.digest ? (
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "1rem" }}>
              Código: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
