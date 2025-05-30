'use client';

import { SignIn } from "@clerk/nextjs";
import { motion } from "@/lib/motion";
import Head from "next/head";

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>Sign In | Vibe Check</title>
        <meta name="description" content="Sign in to create and join quizzes on Vibe Check." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex h-screen items-center justify-center bg-gray-900 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md rounded-2xl shadow-2xl bg-gray-800 border border-gray-700 p-6"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-white mb-1">Vibe Check</h1>
            <p className="text-gray-400 text-sm">Sign in to create and join quizzes</p>
          </div>

          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-transparent shadow-none border-none",
                headerTitle: "text-white text-xl font-semibold",
                headerSubtitle: "text-gray-400 text-sm",
                formButtonPrimary: "bg-purple-600 hover:bg-purple-700 text-white font-medium",
                socialButtonsBlockButton: "border-gray-600 text-white hover:bg-gray-700",
                formFieldInput: "bg-gray-700 border border-gray-600 text-white placeholder-gray-400",
                formFieldLabel: "text-gray-300 text-sm",
                footer: "text-gray-400 text-xs mt-4",
                footerActionLink: "text-purple-400 hover:text-purple-300 font-medium",
              },
            }}
          />
        </motion.div>
      </div>
    </>
  );
}
