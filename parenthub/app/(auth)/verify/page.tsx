/**
 * OTP VERIFICATION PAGE - app/(auth)/verify/page.tsx
 *
 * Purpose: OTP/code verification step in auth flow
 *
 * Features:
 * - 6-digit OTP input (auto-focus between digits)
 * - Resend code option with countdown timer
 * - Auto-submit on complete
 * - Error state for invalid code
 * - Back button to change phone/email
 *
 * URL params:
 * - phone or email: the identifier being verified
 * - type: "login" or "signup"
 *
 * Components used:
 * - OTPInput
 * - Button
 * - CountdownTimer
 *
 * API calls:
 * - POST /api/auth/verify-otp
 * - POST /api/auth/resend-otp
 *
 * Analytics events:
 * - otp_submit
 * - otp_resend
 * - otp_success
 * - otp_fail
 */

export default function VerifyPage() {
  return (
    <main>
      <h1>Verify</h1>
      {/* TODO: Implement OTP verification page */}
    </main>
  );
}
