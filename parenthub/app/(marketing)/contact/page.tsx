"use client";

/**
 * CONTACT PAGE - app/(marketing)/contact/page.tsx
 *
 * Contact form with animated elements
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-hero > *", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.from(".contact-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.3,
        ease: "back.out(1.7)",
      });

      gsap.from(".contact-form", {
        x: 50,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Us",
      desc: "support@parenthub.com",
      detail: "We respond within 24 hours",
    },
    {
      icon: "📱",
      title: "Call Us",
      desc: "+972-3-123-4567",
      detail: "Sun-Thu, 9AM-6PM IST",
    },
    {
      icon: "📍",
      title: "Visit Us",
      desc: "Tel Aviv, Israel",
      detail: "By appointment only",
    },
    {
      icon: "💬",
      title: "Live Chat",
      desc: "In-app support",
      detail: "Available 24/7",
    },
  ];

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
              <Link href="/contact" className="text-pink-600 font-medium">Contact</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900">Log in</Link>
              <Link href="/signup" className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <div className="max-w-4xl mx-auto px-4 text-center contact-hero">
          <span className="inline-block px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-6">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            We&apos;d love to{" "}
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              hear from you
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Have questions? Need help? Want to partner with us? We&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, i) => (
              <div
                key={i}
                className="contact-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center text-3xl">
                  {method.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{method.title}</h3>
                <p className="text-pink-600 font-medium">{method.desc}</p>
                <p className="text-gray-500 text-sm mt-1">{method.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a message</h2>
              <p className="text-lg text-gray-600 mb-8">
                Fill out the form and our team will get back to you within 24 hours.
                We&apos;re here to help with any questions about our platform, providers,
                or how to get started.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🤝</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Partnership Inquiries</h3>
                    <p className="text-gray-600 text-sm">
                      Interested in partnering with ParentHub? Let us know about your organization.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📰</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Media & Press</h3>
                    <p className="text-gray-600 text-sm">
                      For press inquiries, reach out to press@parenthub.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💼</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Careers</h3>
                    <p className="text-gray-600 text-sm">
                      Want to join our team? Check out our open positions at careers@parenthub.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form bg-white rounded-3xl shadow-xl p-8 lg:p-10">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                    className="text-pink-600 font-medium hover:text-pink-700"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all"
                  >
                    Send Message
                  </button>

                  <p className="text-center text-sm text-gray-500">
                    By submitting, you agree to our{" "}
                    <Link href="/privacy" className="text-pink-600 hover:underline">Privacy Policy</Link>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl h-80 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl mb-4 block">📍</span>
              <p className="text-gray-700 font-medium">ParentHub Headquarters</p>
              <p className="text-gray-500">Tel Aviv, Israel</p>
            </div>
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
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            </div>
            <p className="text-gray-400 text-sm">© 2024 ParentHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
