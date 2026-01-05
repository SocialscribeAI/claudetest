/**
 * OTP VERIFICATION PAGE - app/(auth)/verify/page.tsx
 *
 * Purpose: OTP/code verification step in auth flow
 *
 * Features:
 * - 6-digit OTP input with auto-focus
 * - Resend code with countdown timer
 * - Auto-submit on complete
 * - Error handling
 */

"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const type = searchParams.get("type") || "login";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    const code = otp.join("");
    if (code.length === OTP_LENGTH && !otp.includes("")) {
      handleVerify(code);
    }
  }, [otp]);

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, type }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Invalid verification code");
      }

      // Redirect based on type
      if (type === "signup") {
        router.push("/");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      // Clear OTP on error
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < OTP_LENGTH) {
        newOtp[i] = char;
      }
    });
    setOtp(newOtp);

    // Focus last filled or last input
    const lastFilledIndex = Math.min(pastedData.length, OTP_LENGTH) - 1;
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (!res.ok) {
        throw new Error("Failed to resend code");
      }

      setResendCooldown(RESEND_COOLDOWN);
      setError("");
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    }
  };

  // Format phone for display
  const formatPhone = (p: string) => {
    if (p.length === 10) {
      return `+972 ${p.slice(1, 3)} ${p.slice(3, 6)} ${p.slice(6)}`;
    }
    return `+972 ${p}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl text-white font-bold">P</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ParentHub</h1>
          </Link>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Back button */}
          <Link
            href={type === "signup" ? "/signup" : "/login"}
            className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Change number
          </Link>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Enter verification code
          </h2>
          <p className="text-gray-500 mb-6">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-gray-700">{formatPhone(phone)}</span>
          </p>

          {/* OTP Input */}
          <div className="flex justify-center gap-3 mb-6" dir="ltr">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={isLoading}
                className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all
                  ${error ? "border-red-300 bg-red-50" : digit ? "border-pink-500 bg-pink-50" : "border-gray-300"}
                  focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed`}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Error message */}
          {error && (
            <p className="text-center text-sm text-red-500 mb-4">{error}</p>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Verifying...</span>
            </div>
          )}

          {/* Resend button */}
          <div className="text-center">
            {resendCooldown > 0 ? (
              <p className="text-gray-500">
                Resend code in <span className="font-medium">{resendCooldown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-pink-600 font-medium hover:text-pink-700"
              >
                Resend code
              </button>
            )}
          </div>
        </div>

        {/* Help text */}
        <p className="text-center mt-6 text-sm text-gray-500">
          Didn't receive the code? Check your SMS inbox or{" "}
          <Link href="/support" className="text-pink-600 hover:text-pink-700">
            contact support
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyForm />
    </Suspense>
  );
}
