"use client";

/**
 * ANIMATED LANDING PAGE - app/(marketing)/page.tsx
 *
 * Features:
 * - GSAP ScrollTrigger animations
 * - Parallax effects
 * - Animated counters
 * - Staggered reveals
 * - Smooth scroll
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      const heroTl = gsap.timeline();
      heroTl
        .from(".hero-badge", { y: -50, opacity: 0, duration: 0.8, ease: "back.out(1.7)" })
        .from(".hero-title", { y: 100, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.5")
        .from(".hero-subtitle", { y: 50, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .from(".hero-cta", { y: 30, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
        .from(".hero-image", { scale: 0.8, opacity: 0, duration: 1, ease: "elastic.out(1, 0.5)" }, "-=0.8")
        .from(".floating-card", { y: 50, opacity: 0, duration: 0.6, stagger: 0.15, ease: "back.out(1.7)" }, "-=0.5");

      // Floating animation for cards
      gsap.to(".floating-card", {
        y: -10,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.3, from: "random" },
      });

      // Features scroll animation
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Stats counter animation
      const statNumbers = document.querySelectorAll(".stat-number");
      statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute("data-target") || "0");
        gsap.fromTo(
          stat,
          { textContent: 0 },
          {
            textContent: target,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Stats bar animation
      gsap.from(".stat-item", {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
      });

      // How it works steps
      gsap.from(".step-item", {
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: "top 75%",
        },
        x: -100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Step connector line animation
      gsap.from(".step-line", {
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: "top 75%",
        },
        scaleX: 0,
        duration: 1.5,
        ease: "power2.inOut",
        transformOrigin: "left center",
      });

      // Testimonials
      gsap.from(".testimonial-card", {
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 80%",
        },
        y: 80,
        opacity: 0,
        rotation: -5,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

      // CTA section
      gsap.from(".cta-content", {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Parallax effect on scroll
      gsap.to(".parallax-bg", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: 200,
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
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
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background elements */}
        <div className="parallax-bg absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-start">
              <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                Trusted by 10,000+ parents
              </div>

              <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                Find{" "}
                <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">
                  Perfect Care
                </span>{" "}
                for Your Child
              </h1>

              <p className="hero-subtitle text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Connect with verified babysitters, tutors, and child care professionals in your area.
                Quality care, just a tap away.
              </p>

              <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/search"
                  className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Find Providers
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/signup?type=provider"
                  className="hero-cta px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:border-pink-300 hover:bg-pink-50 transition-all duration-300"
                >
                  I&apos;m a Provider
                </Link>
              </div>
            </div>

            {/* Hero Image with floating cards */}
            <div className="relative">
              <div className="hero-image relative mx-auto w-full max-w-lg">
                <div className="aspect-square bg-gradient-to-br from-pink-100 via-rose-50 to-white rounded-3xl shadow-2xl shadow-pink-500/10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-9xl">👨‍👩‍👧‍👦</span>
                  </div>
                </div>

                {/* Floating cards */}
                <div className="floating-card absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Verified</p>
                    <p className="text-sm text-gray-500">Background checked</p>
                  </div>
                </div>

                <div className="floating-card absolute top-1/4 -right-8 bg-white rounded-2xl shadow-xl p-4">
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">4.9 avg rating</p>
                </div>

                <div className="floating-card absolute -bottom-4 left-1/4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["🧑", "👩", "👨"].map((emoji, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center border-2 border-white"
                      >
                        <span>{emoji}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">500+</p>
                    <p className="text-sm text-gray-500">Near you</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to find{" "}
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                trusted care
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform connects you with verified professionals who love what they do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🔍",
                title: "Smart Search",
                desc: "Find providers by location, availability, and specialization",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: "✅",
                title: "Verified Profiles",
                desc: "All providers are background-checked and reviewed",
                gradient: "from-green-500 to-emerald-500",
              },
              {
                icon: "⭐",
                title: "Real Reviews",
                desc: "Honest feedback from parents in your community",
                gradient: "from-yellow-500 to-orange-500",
              },
              {
                icon: "📍",
                title: "Location Based",
                desc: "Find care providers within walking distance",
                gradient: "from-pink-500 to-rose-500",
              },
              {
                icon: "💬",
                title: "Direct Contact",
                desc: "Message providers directly through the app",
                gradient: "from-purple-500 to-violet-500",
              },
              {
                icon: "🛡️",
                title: "Safe & Secure",
                desc: "Your data is protected with enterprise security",
                gradient: "from-indigo-500 to-blue-500",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="feature-card group bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-500 hover:-translate-y-2"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 md:py-32 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-white/5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Trusted by thousands</h2>
            <p className="text-xl text-white/80">Join the fastest-growing parenting community</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: 10000, suffix: "+", label: "Active Parents" },
              { number: 2500, suffix: "+", label: "Verified Providers" },
              { number: 50000, suffix: "+", label: "Successful Bookings" },
              { number: 4.9, suffix: "", label: "Average Rating", decimal: true },
            ].map((stat, i) => (
              <div key={i} className="stat-item text-center">
                <div className="text-4xl md:text-6xl font-bold mb-2">
                  <span className="stat-number" data-target={stat.decimal ? "49" : stat.number}>
                    0
                  </span>
                  {stat.decimal && <span className="text-3xl">.</span>}
                  {stat.suffix}
                </div>
                <p className="text-white/80 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="step-line hidden lg:block absolute top-24 left-1/6 right-1/6 h-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" />

            <div className="grid lg:grid-cols-3 gap-12">
              {[
                {
                  step: 1,
                  title: "Search & Browse",
                  desc: "Enter your location and browse through hundreds of verified child care professionals",
                  icon: "🔍",
                },
                {
                  step: 2,
                  title: "Compare & Choose",
                  desc: "Read reviews, check availability, and find the perfect match for your family",
                  icon: "⚖️",
                },
                {
                  step: 3,
                  title: "Connect & Book",
                  desc: "Contact providers directly and schedule care with confidence",
                  icon: "🤝",
                },
              ].map((item) => (
                <div key={item.step} className="step-item text-center relative">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl flex items-center justify-center text-4xl shadow-lg shadow-pink-500/30 relative z-10">
                      {item.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-pink-600 shadow-lg z-20">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 max-w-sm mx-auto">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">What parents say</h2>
            <p className="text-xl text-gray-600">Real stories from real families</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Cohen",
                role: "Mom of 2",
                image: "👩",
                quote:
                  "ParentHub made finding a reliable babysitter so easy! We found Maya within days and she's been amazing with our kids.",
              },
              {
                name: "David Levi",
                role: "Dad of 3",
                image: "👨",
                quote:
                  "The verified profiles give us peace of mind. We've used the platform for tutoring and it's been fantastic.",
              },
              {
                name: "Rachel Ben",
                role: "Single Mom",
                image: "👩‍🦱",
                quote:
                  "As a single parent, I needed flexible, trustworthy care. ParentHub connected me with the perfect nanny.",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="testimonial-card bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 2px, transparent 2px)", backgroundSize: "30px 30px" }} />

        <div className="cta-content max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to find the perfect care for your child?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of happy parents who trust ParentHub for their childcare needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="group px-10 py-4 bg-white text-pink-600 font-semibold rounded-full hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Get Started Free
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-pink-600 transition-all duration-300"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">👶</span>
                </div>
                <span className="text-xl font-bold">ParentHub</span>
              </Link>
              <p className="text-gray-400 mb-4 max-w-sm">
                Connecting parents with trusted child care professionals since 2024.
              </p>
              <div className="flex gap-4">
                {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                  <a
                    key={social}
                    href={`https://${social}.com`}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <span className="text-lg">
                      {social === "facebook" && "f"}
                      {social === "twitter" && "𝕏"}
                      {social === "instagram" && "📷"}
                      {social === "linkedin" && "in"}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/search" className="text-gray-400 hover:text-white transition-colors">Search</Link></li>
                <li><Link href="/map" className="text-gray-400 hover:text-white transition-colors">Map View</Link></li>
                <li><Link href="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">© 2024 ParentHub. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Made with</span>
              <span className="text-red-500">❤️</span>
              <span className="text-gray-400 text-sm">for parents</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
