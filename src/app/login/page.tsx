"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          router.push("/");
          router.refresh();
        } else {
          setMessage("Registration submitted. Check your email to confirm your account before logging in.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#08111F",
      color: "#F5F7FB",
      display: "grid",
      placeItems: "center",
      padding: 20,
      fontFamily: "Arial, sans-serif",
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%",
        maxWidth: 420,
        boxSizing: "border-box",
        background: "#111D2E",
        border: "1px solid #29384D",
        borderRadius: 18,
        padding: 30,
      }}>
        <p style={{ color: "#D4AF37", letterSpacing: 3, fontSize: 12 }}>
          MOHA TECH
        </p>
        <h1 style={{ fontSize: 27, marginBottom: 8 }}>
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p style={{ color: "#9AABC0", lineHeight: 1.6 }}>
          Secure access to your business command center.
        </p>

        <label style={{ display: "block", marginTop: 22 }}>
          Email address
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={field}
          />
        </label>

        <label style={{ display: "block", marginTop: 16 }}>
          Password
          <input
            required
            type="password"
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={field}
          />
        </label>

        {message && (
          <p role="status" style={{
            color: "#E3B84D",
            fontSize: 13,
            lineHeight: 1.6,
            overflowWrap: "anywhere",
          }}>
            {message}
          </p>
        )}

        <button type="submit" disabled={loading} style={{
          width: "100%",
          marginTop: 22,
          padding: 13,
          background: "#D4AF37",
          color: "#08111F",
          border: 0,
          borderRadius: 8,
          fontWeight: 700,
          cursor: "pointer",
        }}>
          {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Register"}
        </button>

        <p style={{ color: "#9AABC0", fontSize: 14, marginTop: 22 }}>
          {mode === "login" ? "New here?" : "Already registered?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setMessage("");
            }}
            style={{
              background: "none",
              border: 0,
              color: "#D4AF37",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </p>
      </form>
    </main>
  );
}

const field: React.CSSProperties = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: 8,
  padding: 12,
  borderRadius: 8,
  border: "1px solid #34445B",
  background: "#0B1626",
  color: "#F5F7FB",
};
