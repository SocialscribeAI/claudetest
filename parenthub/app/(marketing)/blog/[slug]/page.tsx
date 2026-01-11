"use client";

/**
 * BLOG POST PAGE - app/(marketing)/blog/[slug]/page.tsx
 *
 * Individual blog article with rich content
 */

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import gsap from "gsap";

const blogPosts: Record<string, {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  author: { name: string; role: string; avatar: string };
  content: string[];
}> = {
  "finding-the-perfect-babysitter": {
    title: "10 Tips for Finding the Perfect Babysitter",
    excerpt: "Discover the essential questions to ask and red flags to watch for when hiring a babysitter for your children.",
    category: "Childcare Tips",
    readTime: "5 min read",
    date: "December 15, 2024",
    image: "👶",
    author: { name: "Maya Cohen", role: "ParentHub Founder", avatar: "👩‍💼" },
    content: [
      "Finding the right babysitter is one of the most important decisions you'll make as a parent. After all, you're entrusting someone with your most precious treasure—your children. Here are our top 10 tips to help you find the perfect match.",
      "## 1. Start with Referrals",
      "The best babysitters often come through word of mouth. Ask friends, family, neighbors, and colleagues for recommendations. People you trust can vouch for someone's reliability and character.",
      "## 2. Check References Thoroughly",
      "Always ask for at least three references and actually call them. Ask specific questions about punctuality, how they handle emergencies, and how children responded to them.",
      "## 3. Conduct a Background Check",
      "This is non-negotiable. Use a reputable service to verify the candidate's criminal history, driving record (if they'll be transporting children), and identity verification.",
      "## 4. Look for Relevant Experience",
      "A great babysitter should have experience with children of similar ages to yours. Someone excellent with toddlers might not be the best fit for teenagers, and vice versa.",
      "## 5. Assess Their Training",
      "CPR and first aid certification should be requirements. Additional training in early childhood education or special needs care can be valuable bonuses.",
      "## 6. Do a Trial Run",
      "Before committing to regular care, do a paid trial while you're home. This lets you observe how they interact with your children in real scenarios.",
      "## 7. Trust Your Instincts",
      "If something feels off during the interview or trial, trust that feeling. Your parental instincts exist for a reason.",
      "## 8. Discuss Expectations Clearly",
      "Be explicit about house rules, screen time limits, dietary restrictions, bedtime routines, and discipline approaches. Alignment here prevents future conflicts.",
      "## 9. Agree on Communication",
      "Establish how often you expect updates and through what medium. Some parents prefer texts with photos; others want minimal contact unless necessary.",
      "## 10. Set Up for Success",
      "Provide clear emergency contacts, pediatrician information, and a tour of safety equipment locations. A prepared babysitter is a confident babysitter.",
      "## Using ParentHub to Find Care",
      "ParentHub makes this process easier by providing verified profiles, authentic reviews from other parents, and background-checked providers. Start your search today and find peace of mind.",
    ],
  },
  "preparing-child-for-new-caregiver": {
    title: "How to Prepare Your Child for a New Caregiver",
    excerpt: "Smooth transitions make everyone happier. Learn how to help your child adjust to new caregivers with ease.",
    category: "Parenting",
    readTime: "4 min read",
    date: "December 12, 2024",
    image: "🤗",
    author: { name: "Dr. Sarah Ben", role: "Child Psychologist", avatar: "👩‍⚕️" },
    content: [
      "Change can be challenging for children of any age. When introducing a new caregiver, thoughtful preparation can make the transition smoother for everyone involved.",
      "## Understanding Your Child's Perspective",
      "Children thrive on routine and familiarity. A new caregiver represents the unknown, which can trigger anxiety. Acknowledge these feelings as valid.",
      "## Start the Conversation Early",
      "Talk about the upcoming change in age-appropriate terms. For toddlers, this might be the day before. For older children, a week's notice allows them to process.",
      "## Meet Before the Big Day",
      "Arrange a casual meeting where your child can interact with the new caregiver while you're present. A park playdate or visit to your home works well.",
      "## Create Transition Rituals",
      "Special goodbye routines—like a secret handshake or phrase—give children a sense of control and connection during separations.",
      "## Leave Comfort Items",
      "A favorite toy, blanket, or photo of family can provide comfort when you're not there. Let your child choose what stays with them.",
      "## Keep Goodbyes Short",
      "Prolonged goodbyes often increase anxiety. Be warm but brief, reassure them you'll return, and leave confidently.",
      "## Communicate with Your Caregiver",
      "Share your child's likes, dislikes, fears, and comforts. The more a caregiver knows, the better they can support your child.",
      "## Expect Some Regression",
      "It's normal for children to show temporary behavioral changes during transitions. Increased clinginess, sleep disturbances, or acting out typically resolve within weeks.",
      "## Celebrate Small Wins",
      "Acknowledge when your child handles the transition well. Positive reinforcement builds confidence for future changes.",
    ],
  },
  "benefits-of-tutoring": {
    title: "The Benefits of Early Tutoring for Children",
    excerpt: "Why investing in tutoring early can set your child up for academic success throughout their education.",
    category: "Education",
    readTime: "6 min read",
    date: "December 10, 2024",
    image: "📚",
    author: { name: "David Levi", role: "Education Specialist", avatar: "👨‍🏫" },
    content: [
      "The early years of education lay the foundation for lifelong learning. Early tutoring can provide targeted support that helps children build confidence and strong academic skills.",
      "## Building Strong Foundations",
      "Basic literacy and numeracy skills developed in early childhood predict later academic success. Tutoring reinforces these crucial building blocks.",
      "## Personalized Attention",
      "Classroom teachers often have 20+ students. Tutors provide one-on-one focus, adapting to your child's specific learning style and pace.",
      "## Identifying Gaps Early",
      "A skilled tutor can spot learning gaps before they become significant problems. Early intervention prevents small struggles from becoming major obstacles.",
      "## Boosting Confidence",
      "When children understand material thoroughly, they participate more in class and approach challenges with confidence rather than fear.",
      "## Developing Study Skills",
      "Beyond subject matter, tutors teach valuable skills like organization, time management, and effective study techniques that serve children throughout their education.",
      "## Making Learning Enjoyable",
      "A great tutor makes learning fun and engaging. When children enjoy the process, they develop intrinsic motivation to learn.",
      "## Supporting Different Learning Needs",
      "Children with ADHD, dyslexia, or other learning differences often benefit tremendously from tutoring that accommodates their specific needs.",
      "## When to Consider Tutoring",
      "Signs your child might benefit include: homework struggles, declining grades, lost interest in school, or requesting help themselves.",
      "## Finding the Right Tutor",
      "Look for tutors with relevant qualifications, experience with your child's age group, and a teaching style that matches your child's personality.",
    ],
  },
};

// Default content for posts without full data
const defaultPost = {
  title: "Article Coming Soon",
  excerpt: "This article is being prepared.",
  category: "General",
  readTime: "5 min read",
  date: "2024",
  image: "📝",
  author: { name: "ParentHub Team", role: "Content Team", avatar: "👥" },
  content: [
    "This article is currently being written. Check back soon for valuable parenting insights and tips.",
    "In the meantime, explore our other articles for helpful advice on childcare, education, and family life.",
  ],
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts[slug] || { ...defaultPost, title: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".post-header > *", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.from(".post-content", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
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

      {/* Article Header */}
      <header className="pt-32 pb-12 bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <div className="max-w-4xl mx-auto px-4 post-header">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-6 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <span className="text-gray-400">{post.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">{post.title}</h1>

          <p className="text-xl text-gray-600 mb-8">{post.excerpt}</p>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center text-2xl">
              {post.author.avatar}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{post.author.name}</p>
              <p className="text-gray-500 text-sm">{post.author.role} • {post.date}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-4xl mx-auto px-4 -mt-4">
        <div className="h-64 md:h-96 bg-gradient-to-br from-pink-100 via-rose-50 to-pink-50 rounded-3xl flex items-center justify-center shadow-lg">
          <span className="text-9xl">{post.image}</span>
        </div>
      </div>

      {/* Article Content */}
      <article className="post-content max-w-3xl mx-auto px-4 py-16">
        <div className="prose prose-lg prose-pink max-w-none">
          {post.content.map((block, i) => {
            if (block.startsWith("## ")) {
              return (
                <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                  {block.replace("## ", "")}
                </h2>
              );
            }
            return (
              <p key={i} className="text-gray-600 mb-4 leading-relaxed">
                {block}
              </p>
            );
          })}
        </div>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="font-semibold text-gray-900 mb-4">Share this article</p>
          <div className="flex gap-3">
            {["Twitter", "Facebook", "LinkedIn", "Email"].map((platform) => (
              <button
                key={platform}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-pink-100 hover:text-pink-600 transition-colors"
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* Author Bio */}
        <div className="mt-12 p-8 bg-gray-50 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
              {post.author.avatar}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{post.author.name}</p>
              <p className="text-pink-600 text-sm mb-2">{post.author.role}</p>
              <p className="text-gray-600">
                Writing about parenting, childcare, and family life. Passionate about helping families thrive.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(blogPosts)
              .filter(([key]) => key !== slug)
              .slice(0, 3)
              .map(([key, relatedPost]) => (
                <Link key={key} href={`/blog/${key}`} className="group">
                  <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
                    <div className="h-40 flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
                      <span className="text-5xl">{relatedPost.image}</span>
                    </div>
                    <div className="p-6">
                      <span className="text-pink-600 text-sm font-medium">{relatedPost.category}</span>
                      <h3 className="text-lg font-bold text-gray-900 mt-2 group-hover:text-pink-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find trusted childcare?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of parents who trust ParentHub
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-pink-600 font-semibold rounded-full hover:shadow-xl transition-all"
          >
            Get Started Free
          </Link>
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
