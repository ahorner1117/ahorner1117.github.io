"use client";

import { AuthProvider } from "context";

export default function AuthLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
