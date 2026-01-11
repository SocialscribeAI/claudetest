"use client";

/**
 * FAQ PAGE - app/(marketing)/faq/page.tsx
 *
 * Frequently asked questions with accordion
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

const faqCategories = [
  {
    name: "General",
    icon: "❓",
    questions: [
      {
        q: "What is ParentHub?",
        a: "ParentHub is a platform that connects parents with trusted childcare providers, including babysitters, tutors, nannies, and activity instructors. We verify all providers and facilitate secure connections between families and caregivers.",
      },
      {
        q: "Is ParentHub free to use?",
        a: "Yes! Parents can browse providers, read reviews, and contact caregivers for free. We offer premium features for enhanced visibility and additional tools, but the core platform is completely free for families.",
      },
      {
        q: "How do I get started?",
        a: "Simply create a free account, set your location preferences, and start browsing providers in your area. You can filter by category, availability, ratings, and more to find the perfect match for your family.",
      },
      {
        q: "Is ParentHub available in my area?",
        a: "ParentHub is currently available throughout Israel, with the highest concentration of providers in Tel Aviv, Jerusalem, and Haifa. We're expanding to new areas regularly.",
      },
    ],
  },
  {
    name: "For Parents",
    icon: "👨‍👩‍👧",
    questions: [
      {
        q: "How do I find a babysitter?",
        a: "Use our search feature to browse babysitters in your area. Filter by availability, experience, rates, and reviews. Once you find someone you like, you can view their full profile and send them a message.",
      },
      {
        q: "Are providers background checked?",
        a: "Yes! All providers on ParentHub undergo a thorough verification process including identity verification, background checks, and reference checks. Look for the 'Verified' badge on profiles.",
      },
      {
        q: "How do I contact a provider?",
        a: "Once you've found a provider you're interested in, click 'Contact' on their profile to send them a message. You can discuss availability, rates, and any specific requirements before booking.",
      },
      {
        q: "What if I'm not satisfied with a provider?",
        a: "Your satisfaction is our priority. If you have concerns about a provider, please contact our support team immediately. We take all reports seriously and will investigate promptly.",
      },
      {
        q: "Can I see reviews from other parents?",
        a: "Absolutely! Every provider profile displays reviews from verified parents who have used their services. We only show reviews from confirmed bookings to ensure authenticity.",
      },
    ],
  },
  {
    name: "For Providers",
    icon: "🧑‍🏫",
    questions: [
      {
        q: "How do I become a provider on ParentHub?",
        a: "Click 'Register as Provider' and complete our application process. This includes creating your profile, uploading credentials, and completing our verification process including background checks.",
      },
      {
        q: "How much does it cost to list my services?",
        a: "Basic listings are free! We offer premium plans with enhanced features like priority placement, featured badges, and analytics. Visit our pricing page for details.",
      },
      {
        q: "How do I get more bookings?",
        a: "Complete your profile fully, respond quickly to inquiries, gather positive reviews, and consider our premium features for increased visibility. Quality service leads to more referrals.",
      },
      {
        q: "How do payments work?",
        a: "ParentHub facilitates connections between parents and providers. Payment arrangements are made directly between you and the family. We recommend discussing rates and payment terms upfront.",
      },
      {
        q: "What verification do I need to complete?",
        a: "All providers must complete identity verification, a background check, and provide at least two professional references. Additional certifications like CPR/First Aid are recommended but not required.",
      },
    ],
  },
  {
    name: "Safety & Trust",
    icon: "🛡️",
    questions: [
      {
        q: "How does ParentHub verify providers?",
        a: "Our verification process includes: identity document verification, criminal background checks, reference verification, interview screening, and ongoing review monitoring. We take safety seriously.",
      },
      {
        q: "What safety features does ParentHub offer?",
        a: "We provide verified profiles, authentic reviews, secure messaging, and a dedicated trust & safety team. We also offer resources and guidelines for safe hiring practices.",
      },
      {
        q: "How do I report a concern?",
        a: "Click 'Report' on any profile or message to flag a concern. For urgent matters, contact our support team directly. All reports are investigated within 24 hours.",
      },
      {
        q: "Is my personal information protected?",
        a: "Yes. We use industry-standard encryption and security practices. Your personal contact information is only shared with providers you choose to contact. Read our Privacy Policy for details.",
      },
    ],
  },
  {
    name: "Account & Billing",
    icon: "💳",
    questions: [
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot Password' on the login page and enter your email. You'll receive a reset link within minutes. If you don't see it, check your spam folder.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to Settings > Account > Delete Account. Note that this action is permanent and will remove all your data, reviews, and messages from our platform.",
      },
      {
        q: "What payment methods do you accept?",
        a: "For premium features, we accept all major credit cards, PayPal, and local payment methods. All transactions are processed securely through our payment partners.",
      },
      {
        q: "How do I cancel my subscription?",
        a: "Go to Settings > Subscription > Cancel. You'll retain access to premium features until the end of your billing period. No refunds for partial months.",
      },
    ],
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".faq-hero > *", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.from(".category-tab", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        delay: 0.3,
        ease: "back.out(1.7)",
      });
    });

    return () => ctx.revert();
  }, []);

  const toggleQuestion = (key: string) => {
    const newOpen = new Set(openQuestions);
    if (newOpen.has(key)) {
      newOpen.delete(key);
    } else {
      newOpen.add(key);
    }
    setOpenQuestions(newOpen);
  };

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
              <Link href="/faq" className="text-pink-600 font-medium">FAQ</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
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
        <div className="max-w-4xl mx-auto px-4 text-center faq-hero">
          <span className="inline-block px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-6">
            Help Center
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about ParentHub
          </p>

          {/* Search */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Category Tabs */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-2">
                {faqCategories.map((cat, i) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(i)}
                    className={`category-tab w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeCategory === i
                        ? "bg-pink-100 text-pink-700"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-medium">{cat.name}</span>
                    <span className="ml-auto text-sm opacity-60">{cat.questions.length}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Questions */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">{faqCategories[activeCategory].icon}</span>
                {faqCategories[activeCategory].name}
              </h2>

              <div className="space-y-4">
                {faqCategories[activeCategory].questions.map((item, i) => {
                  const key = `${activeCategory}-${i}`;
                  const isOpen = openQuestions.has(key);

                  return (
                    <div
                      key={key}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(key)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 pr-4">{item.q}</span>
                        <svg
                          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6">
                          <p className="text-gray-600 leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all"
            >
              Contact Support
            </Link>
            <a
              href="mailto:support@parenthub.com"
              className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:border-pink-300 hover:bg-pink-50 transition-all"
            >
              Email Us
            </a>
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
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-gray-400 text-sm">© 2024 ParentHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
