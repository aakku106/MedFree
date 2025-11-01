import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to access your health services dashboard
          </p>
        </div>

        {/* Clerk Sign In Component */}
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl",
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          redirectUrl="/services"
          afterSignInUrl="/services"
        />

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-8">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-emerald-600 hover:text-emerald-700 font-medium">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
