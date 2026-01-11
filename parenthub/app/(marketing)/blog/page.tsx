"use client";

/**
 * BLOG LISTING PAGE - app/(marketing)/blog/page.tsx
 *
 * SEO-friendly blog with articles about parenting
 */

import { useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const blogPosts = [
  {
    slug: "finding-the-perfect-babysitter",
    title: "10 Tips for Finding the Perfect Babysitter",
    excerpt: "Discover the essential questions to ask and red flags to watch for when hiring a babysitter for your children.",
    category: "Childcare Tips",
    readTime: "5 min read",
    date: "Dec 15, 2024",
    image: "👶",
    featured: true,
  },
  {
    slug: "preparing-child-for-new-caregiver",
    title: "How to Prepare Your Child for a New Caregiver",
    excerpt: "Smooth transitions make everyone happier. Learn how to help your child adjust to new caregivers with ease.",
    category: "Parenting",
    readTime: "4 min read",
    date: "Dec 12, 2024",
    image: "🤗",
    featured: true,
  },
  {
    slug: "benefits-of-tutoring",
    title: "The Benefits of Early Tutoring for Children",
    excerpt: "Why investing in tutoring early can set your child up for academic success throughout their education.",
    category: "Education",
    readTime: "6 min read",
    date: "Dec 10, 2024",
    image: "📚",
    featured: true,
  },
  {
    slug: "choosing-activities-for-kids",
    title: "Choosing the Right Activities for Your Child",
    excerpt: "From sports to arts, learn how to select extracurricular activities that match your child's interests and personality.",
    category: "Activities",
    readTime: "5 min read",
    date: "Dec 8, 2024",
    image: "⚽",
  },
  {
    slug: "work-life-balance-parents",
    title: "Mastering Work-Life Balance as a Parent",
    excerpt: "Practical strategies for juggling career demands with family responsibilities without burning out.",
    category: "Lifestyle",
    readTime: "7 min read",
    date: "Dec 5, 2024",
    image: "⚖️",
  },
  {
    slug: "safety-tips-childcare",
    title: "Essential Safety Tips When Hiring Childcare",
    excerpt: "Background checks, references, and safety protocols every parent should know about.",
    category: "Safety",
    readTime: "6 min read",
    date: "Dec 2, 2024",
    image: "🛡️",
  },
  {
    slug: "nurturing-creativity",
    title: "Nurturing Your Child's Creativity",
    excerpt: "Simple ways to encourage imaginative play and creative thinking in children of all ages.",
    category: "Development",
    readTime: "4 min read",
    date: "Nov 28, 2024",
    image: "🎨",
  },
  {
    slug: "screen-time-guidelines",
    title: "Healthy Screen Time Guidelines for Kids",
    excerpt: "Finding the right balance between digital learning and unplugged play time.",
    category: "Health",
    readTime: "5 min read",
    date: "Nov 25, 2024",
    image: "📱",
  },
];

const categories = ["All", "Childcare Tips", "Parenting", "Education", "Activities", "Safety", "Health"];

export default function BlogPage() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".blog-hero > *", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.from(".featured-post", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.3,
      });

      gsap.from(".blog-post", {
        scrollTrigger: {
          trigger: ".blog-grid",
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  const featuredPosts = blogPosts.filter((p) => p.featured);
  const regularPosts = blogPosts.filter((p) => !p.featured);

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
              <Link href="/blog" className="text-pink-600 font-medium">Blog</Link>
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
      <section className="pt-32 pb-12 bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 blog-hero">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ParentHub{" "}
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Blog</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Expert advice, tips, and insights to help you navigate the journey of parenthood
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  cat === "All"
                    ? "bg-pink-500 text-white"
                    : "bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Articles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredPosts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`featured-post group ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <article
                  className={`bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 ${
                    i === 0 ? "h-full" : ""
                  }`}
                >
                  <div
                    className={`flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100 ${
                      i === 0 ? "h-64 md:h-80" : "h-40"
                    }`}
                  >
                    <span className={i === 0 ? "text-8xl" : "text-6xl"}>{post.image}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-gray-400 text-sm">{post.readTime}</span>
                    </div>
                    <h3
                      className={`font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors ${
                        i === 0 ? "text-2xl" : "text-lg"
                      }`}
                    >
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-2 mt-4 text-pink-600 text-sm font-medium">
                      Read more
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div className="blog-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-post group">
                <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
                  <div className="h-40 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <span className="text-5xl">{post.image}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-gray-400 text-sm">{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                    <p className="text-gray-400 text-xs mt-4">{post.date}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white text-gray-700 font-medium rounded-full shadow-lg hover:shadow-xl transition-all">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-white/90 mb-8">
            Get the latest parenting tips and childcare advice delivered to your inbox
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-pink-600 font-semibold rounded-full hover:shadow-xl transition-all"
            >
              Subscribe
            </button>
          </form>
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
