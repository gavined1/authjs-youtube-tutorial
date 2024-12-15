"use client";

import { SignInButton } from "@/src/components/sign-in-button";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheck } from 'react-icons/fi';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient opacity-30" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.2] bg-[length:40px_40px] [mask-image:linear-gradient(180deg,white,transparent)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <div className="mb-8 animate-float">
              <span className="inline-flex items-center px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                <span className="text-sm font-medium text-white">New Feature: AI Video Generation</span>
                <FiArrowRight className="ml-2 w-4 h-4 text-white" />
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold gradient-text mb-6 text-glow">
              Advanced AI Tools for Creative Professionals
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your creative workflow with our suite of AI-powered tools. Generate images, 
              create videos, enhance photos, and edit with precision - all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <SignInButton className="glass-button bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90" />
              <button className="glass-button">
                View Documentation
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Built for Developers</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Everything you need to implement authentication in your application,
              with a focus on security, performance, and developer experience.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass-card p-8 hover:bg-white/[0.15] transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 text-4xl">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Simple Credit Packages</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              One-time credit purchases. Use your credits anytime for any AI generation.
              <br />
              <span className="text-white/60">Generation costs: Video ($0.50) • Image ($0.002) • Enhancement ($0.025)</span>
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                className={`glass-card p-8 relative ${
                  plan.popular 
                    ? 'bg-white/[0.08] backdrop-blur-xl border-white/20' 
                    : 'bg-white/[0.03] border-white/10'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {plan.popular && (
                  <>
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/25 to-purple-500/25 rounded-2xl blur-xl" />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium text-white/80 border border-white/20">
                      Most Popular
                    </div>
                  </>
                )}
                <h3 className="text-2xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className={`text-5xl font-bold mb-6 ${plan.popular ? 'text-white' : 'text-white/80'}`}>
                  {plan.price !== null ? `$${plan.price}` : 'Custom'}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-300">
                      <FiCheck className={`w-5 h-5 ${plan.popular ? 'text-blue-400' : 'text-blue-400/60'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  className={`w-full glass-button ${
                    plan.popular 
                      ? 'bg-white/10 hover:bg-white/20 border-white/20' 
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: "🎨",
    title: "Text to Image",
    description: "Generate stunning images from text descriptions using state-of-the-art AI models."
  },
  {
    icon: "🎬",
    title: "Video Generation",
    description: "Create professional videos with AI-powered tools and effects."
  },
  {
    icon: "✨",
    title: "Image Enhancement",
    description: "Enhance and restore images with advanced AI algorithms."
  },
  {
    icon: "🖌️",
    title: "AI Image Editor",
    description: "Professional-grade image editing powered by AI. Smart object removal, background replacement, and artistic filters."
  }
];

const pricingPlans = [
  {
    name: "Try it out",
    price: 0,
    popular: false,
    features: [
      "$1 free credits to start",
      "≈ 2 AI videos",
      "≈ 40 image enhancements",
      "Credits never expire",
      "Community support"
    ]
  },
  {
    name: "$3 Credits",
    price: 3,
    popular: true,
    features: [
      "$3 worth of credits",
      "≈ 6 AI videos",
      "≈ 120 image enhancements",
      "Credits never expire",
      "Priority support"
    ]
  },
  {
    name: "$5 Credits",
    price: 5,
    popular: false,
    features: [
      "$5 worth of credits",
      "≈ 10 AI videos",
      "≈ 200 image enhancements",
      "Credits never expire",
      "Priority support"
    ]
  }
];

export default Home;
