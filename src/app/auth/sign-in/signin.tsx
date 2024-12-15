"use client";

import { FcGoogle } from "react-icons/fc";
import { useTransition, useState } from "react";
import { handleGoogleSignIn } from "@/src/lib/auth/googleSignInServerAction";
import { handleEmailSignIn } from "@/src/lib/auth/emailSignInServerAction";
import { motion } from "framer-motion";

export const SignInPage: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({ email: "" });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      startTransition(async () => {
        await handleEmailSignIn(formData.email);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <motion.div 
          className="signin-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="signin-header">
            <h2>Welcome to Gavin's</h2>
            <p>Sign in to access your AI tools</p>
          </div>

          <div className="signin-methods">
            <button 
              className="google-signin"
              onClick={() => handleGoogleSignIn()}
              disabled={isPending}
            >
              <FcGoogle className="google-icon" />
              <span>Continue with Google</span>
            </button>

            <div className="divider">
              <span>or continue with email</span>
            </div>

            <form className="email-signin-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  maxLength={320}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ email: e.target.value })}
                  disabled={isPending}
                  required
                />
                <motion.button
                  className="submit-button"
                  type="submit"
                  disabled={isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isPending ? (
                    <span className="loading">Signing in...</span>
                  ) : (
                    <span>Continue with Email</span>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
