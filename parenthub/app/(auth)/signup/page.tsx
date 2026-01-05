/**
 * SIGNUP PAGE - app/(auth)/signup/page.tsx
 *
 * Purpose: New user registration for parents and providers
 *
 * Features:
 * - Phone number with OTP verification
 * - Name input
 * - Email (optional)
 * - Terms acceptance
 * - Provider type toggle
 */

"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isProvider = searchParams.get("type") === "provider";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    termsAccepted: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 9) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const cleanPhone = formData.phone.replace(/[^0-9]/g, "");

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: cleanPhone,
          email: formData.email || undefined,
          role: isProvider ? "PROVIDER" : "PARENT",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create account");
      }

      // Redirect to OTP verification
      router.push(`/verify?phone=${encodeURIComponent(cleanPhone)}&type=signup`);
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
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

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isProvider ? "Register as Provider" : "Create your account"}
          </h2>
          <p className="text-gray-500 mb-6">
            {isProvider
              ? "Join our network of trusted service providers"
              : "Join thousands of parents finding great care"}
          </p>

          {/* User Type Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <Link
              href="/signup"
              className={`flex-1 py-2 text-center rounded-lg text-sm font-medium transition-colors ${
                !isProvider ? "bg-white shadow-sm text-gray-900" : "text-gray-500"
              }`}
            >
              Parent
            </Link>
            <Link
              href="/signup?type=provider"
              className={`flex-1 py-2 text-center rounded-lg text-sm font-medium transition-colors ${
                isProvider ? "bg-white shadow-sm text-gray-900" : "text-gray-500"
              }`}
            >
              Provider
            </Link>
          </div>

          {errors.form && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isProvider ? "Business Name" : "Your Name"}
              </label>
              <Input
                type="text"
                placeholder={isProvider ? "Maya's Babysitting" : "Your full name"}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
              />
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex">
                <div className="flex items-center px-4 bg-gray-100 border border-e-0 border-gray-300 rounded-s-xl">
                  <span className="text-gray-600">+972</span>
                </div>
                <Input
                  type="tel"
                  placeholder="50 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-s-none"
                  error={errors.phone}
                />
              </div>
            </div>

            {/* Email Input (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-gray-400">(optional)</span>
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="mt-1 w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-pink-600 hover:text-pink-700">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-pink-600 hover:text-pink-700">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-500 -mt-2">{errors.terms}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-pink-600 font-medium hover:text-pink-700">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
