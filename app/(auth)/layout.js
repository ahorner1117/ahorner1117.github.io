/**
 * Auth Layout
 * Simplified layout - AuthProvider now only wraps pages that need it
 * This prevents loading Firebase on all routes
 */

export default function AuthLayout({ children }) {
  return <>{children}</>;
}
