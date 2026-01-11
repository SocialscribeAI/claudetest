"use client";

/**
 * ABOUT PAGE - app/(marketing)/about/page.tsx
 *
 * Company story, mission, team, and values
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from(".about-hero-content > *", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Story section
      gsap.from(".story-text", {
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top 80%",
        },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".story-image", {
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top 80%",
        },
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Values cards
      gsap.from(".value-card", {
        scrollTrigger: {
          trigger: valuesRef.current,
          start: "top 80%",
        },
        y: 80,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
      });

      // Team members
      gsap.from(".team-member", {
        scrollTrigger: {
          trigger: teamRef.current,
          start: "top 75%",
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "back.out(1.7)",
      });
    });

    return () => ctx.revert();
  }, []);

  const values = [
    {
      icon: "💝",
      title: "Trust First",
      desc: "Every provider is thoroughly vetted. We believe trust is the foundation of great care.",
    },
    {
      icon: "🌟",
      title: "Quality Matters",
      desc: "We maintain high standards because your children deserve nothing less.",
    },
    {
      icon: "🤝",
      title: "Community Driven",
      desc: "Built by parents, for parents. Our community shapes everything we do.",
    },
    {
      icon: "🔒",
      title: "Safety Always",
      desc: "Background checks, reviews, and verification keep families safe.",
    },
    {
      icon: "💡",
      title: "Innovation",
      desc: "We continuously improve to make finding care easier and better.",
    },
    {
      icon: "❤️",
      title: "Compassion",
      desc: "We understand the challenges of parenting and build with empathy.",
    },
  ];

  const team = [
    { name: "Maya Cohen", role: "CEO & Co-Founder", emoji: "👩‍💼", bio: "Former pediatric nurse turned entrepreneur" },
    { name: "David Levi", role: "CTO & Co-Founder", emoji: "👨‍💻", bio: "Tech veteran with 15 years experience" },
    { name: "Sarah Ben", role: "Head of Operations", emoji: "👩‍🔧", bio: "Operations expert passionate about families" },
    { name: "Tom Shapira", role: "Head of Product", emoji: "👨‍🎨", bio: "Product designer and father of twins" },
    { name: "Rachel Gold", role: "Head of Trust & Safety", emoji: "👩‍⚖️", bio: "Former child welfare specialist" },
    { name: "Avi Stern", role: "Head of Marketing", emoji: "👨‍💼", bio: "Marketing leader and community builder" },
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
              <Link href="/about" className="text-pink-600 font-medium">About</Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
              <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</Link>
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
      <section ref={heroRef} className="pt-32 pb-20 bg-gradient-to-br from-pink-50 via-rose-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center about-hero-content">
          <span className="inline-block px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-6">
            Our Story
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Built by parents,{" "}
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              for parents
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We started ParentHub because we knew there had to be a better way to find trusted childcare.
            Our mission is to give every parent peace of mind.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section ref={storyRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="story-text">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                From frustrated parents to industry pioneers
              </h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  In 2023, our founders Maya and David were new parents struggling to find reliable childcare.
                  Between endless Facebook groups, word-of-mouth recommendations, and anxiety-inducing interviews,
                  they knew there had to be a better way.
                </p>
                <p>
                  That frustration sparked ParentHub. We built a platform where trust is verified,
                  not assumed. Where reviews come from real parents, not anonymous strangers.
                  Where finding care is as easy as it should be.
                </p>
                <p>
                  Today, we&apos;ve connected over 10,000 families with verified care providers.
                  But we&apos;re just getting started.
                </p>
              </div>
            </div>
            <div className="story-image">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-pink-100 via-rose-50 to-pink-50 rounded-3xl shadow-2xl shadow-pink-500/10 flex items-center justify-center">
                  <span className="text-9xl">👨‍👩‍👧</span>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">✅</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">10,000+</p>
                      <p className="text-sm text-gray-500">Families served</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section ref={valuesRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <div
                key={i}
                className="value-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section ref={teamRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The passionate people behind ParentHub</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div
                key={i}
                className="team-member bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 text-center"
              >
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center text-4xl">
                  {member.emoji}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                <p className="text-pink-600 font-medium text-sm mb-2">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join our growing community</h2>
          <p className="text-xl text-white/90 mb-8">
            Whether you&apos;re a parent looking for care or a provider ready to make a difference
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-pink-600 font-semibold rounded-full hover:shadow-xl transition-all"
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-pink-600 transition-all"
            >
              Contact Us
            </Link>
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
