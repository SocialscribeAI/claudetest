/**
 * LOGIN PAGE - app/(auth)/login/page.tsx
 *
 * Purpose: User login page for parents and providers
 *
 * Features:
 * - Phone number input with country code
 * - Email login option
 * - OTP verification flow
 * - "Remember me" option
 * - Link to signup
 * - Social login (future: Google, Apple)
 * - Redirect after successful login
 *
 * Components used:
 * - PhoneInput
 * - EmailInput
 * - Button
 * - OTPInput (after submit)
 *
 * API calls:
 * - POST /api/auth/login (initiate login)
 * - POST /api/auth/verify-otp (verify OTP)
 *
 * Analytics events:
 * - login_start
 * - login_complete
 * - login_fail
 */

export default function LoginPage() {
  return (
    <main>
      <h1>Login</h1>
      {/* TODO: Implement login page */}
    </main>
  );
}
