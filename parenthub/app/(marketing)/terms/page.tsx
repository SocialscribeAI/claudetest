"use client";

/**
 * TERMS OF SERVICE PAGE - app/(marketing)/terms/page.tsx
 */

import { useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function TermsPage() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".legal-hero > *", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">👶</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                ParentHub
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
              <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
            </div>
            <Link href="/signup" className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center legal-hero">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: December 15, 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              Welcome to ParentHub. By accessing or using our platform, you agree to be bound by these
              Terms of Service. Please read them carefully.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-6">
              By creating an account or using ParentHub, you acknowledge that you have read, understood,
              and agree to be bound by these Terms. If you do not agree, please do not use our platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-6">
              ParentHub is a platform that connects parents seeking childcare services with providers
              offering such services. We facilitate connections but are not a party to any agreements
              between users. We do not employ, recommend, or endorse any specific providers.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. User Accounts</h2>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Registration</h3>
            <p className="text-gray-600 mb-4">
              To use certain features, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information</li>
              <li>Keep your password secure and confidential</li>
              <li>Be responsible for all activity under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Account Types</h3>
            <p className="text-gray-600 mb-6">
              <strong>Parents:</strong> Accounts for individuals seeking childcare services.<br />
              <strong>Providers:</strong> Accounts for individuals or organizations offering childcare services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. User Conduct</h2>
            <p className="text-gray-600 mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Violate any applicable laws or regulations</li>
              <li>Provide false or misleading information</li>
              <li>Impersonate any person or entity</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Post inappropriate, offensive, or illegal content</li>
              <li>Spam or send unsolicited communications</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the platform for any unlawful purpose</li>
              <li>Interfere with the proper functioning of the platform</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. Provider Requirements</h2>
            <p className="text-gray-600 mb-4">Providers must:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Be at least 18 years old</li>
              <li>Complete our verification process</li>
              <li>Provide accurate information about qualifications and experience</li>
              <li>Maintain any required licenses or certifications</li>
              <li>Comply with all applicable laws regarding childcare services</li>
              <li>Respond to inquiries in a timely and professional manner</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">6. Payments</h2>
            <p className="text-gray-600 mb-6">
              ParentHub facilitates connections between parents and providers. Payment arrangements for
              childcare services are made directly between users. We are not responsible for any payment
              disputes. Premium features are billed according to the plan selected and are non-refundable
              except as required by law.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">7. Content and Reviews</h2>
            <p className="text-gray-600 mb-6">
              Users may post reviews, comments, and other content. You grant ParentHub a non-exclusive,
              worldwide, royalty-free license to use, display, and distribute your content. Reviews must
              be honest and based on actual experiences. We reserve the right to remove content that
              violates these terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-600 mb-6">
              THE PLATFORM IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THE
              ACCURACY, RELIABILITY, OR COMPLETENESS OF ANY INFORMATION. WE DO NOT ENDORSE ANY PROVIDERS
              AND ARE NOT RESPONSIBLE FOR THE QUALITY OF SERVICES PROVIDED BY USERS.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 mb-6">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, PARENTHUB SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE
              PLATFORM OR ANY SERVICES OBTAINED THROUGH IT.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">10. Indemnification</h2>
            <p className="text-gray-600 mb-6">
              You agree to indemnify and hold harmless ParentHub, its officers, directors, employees,
              and agents from any claims, damages, losses, or expenses arising from your use of the
              platform or violation of these terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">11. Termination</h2>
            <p className="text-gray-600 mb-6">
              We may suspend or terminate your account at any time for violations of these terms or for
              any other reason at our sole discretion. Upon termination, your right to use the platform
              ceases immediately.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-600 mb-6">
              We reserve the right to modify these terms at any time. We will notify users of material
              changes. Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">13. Governing Law</h2>
            <p className="text-gray-600 mb-6">
              These terms shall be governed by the laws of Israel. Any disputes shall be resolved in the
              courts of Tel Aviv, Israel.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">14. Contact Information</h2>
            <p className="text-gray-600 mb-2">
              For questions about these Terms, please contact us:
            </p>
            <ul className="list-none text-gray-600 space-y-1 mb-6">
              <li>Email: legal@parenthub.com</li>
              <li>Address: Tel Aviv, Israel</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                <span className="text-white">👶</span>
              </div>
              <span className="font-bold">ParentHub</span>
            </Link>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-white">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-gray-400 text-sm">© 2024 ParentHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
