import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join MedFree to access free health services near you
          </p>
        </div>

        {/* Clerk Sign Up Component */}
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl",
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          redirectUrl="/services"
          afterSignUpUrl="/services"
        />

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{" "}
          <a
            href="/sign-in"
            className="text-emerald-600 hover:text-emerald-700 font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
