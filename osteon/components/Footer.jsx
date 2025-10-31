import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer footer-center bg-base-200 text-base-content p-10 mt-20 rounded-t-2xl border-t">
      <aside>
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-10 h-10 text-primary"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19.5 3.09L15 5.5l3 1.4V11l-3-1.4v5.5l1.47-.69a.42.42 0 0 0 .22-.37V9.32l1.79.84A.47.47 0 0 0 19 10a.5.5 0 0 0 .5-.5zm-4 7.81v-3.5L12 5.5v5.5zM20 12.5L14 15v-5.5l6-2.5zM12 12.5L6 15V9.5l6-2.5zM4 14.5v-5l6-2.5v5.5z" />
          </svg>
          <span className="text-2xl font-bold text-primary">Osteon</span>
        </div>
        <p className="font-semibold">
          Bridging the gap in healthcare awareness
        </p>
        <p className="max-w-md text-sm opacity-70">
          Providing real-time information about free government medical
          services, health camps, and medications across Nepal.
        </p>
        <p className="text-xs opacity-60 mt-2">
          © {new Date().getFullYear()} Osteon. All rights reserved.
        </p>
      </aside>
      <nav>
        <div className="grid grid-flow-col gap-6">
          <Link href="/services" className="link link-hover">
            Services
          </Link>
          <Link href="/about" className="link link-hover">
            About
          </Link>
          <Link href="/contact" className="link link-hover">
            Contact
          </Link>
          <Link href="/privacy" className="link link-hover">
            Privacy Policy
          </Link>
        </div>
      </nav>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
            aria-label="Twitter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
            </svg>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
            aria-label="Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
            </svg>
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
            aria-label="GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.840 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
            </svg>
          </a>
        </div>
      </nav>
    </footer>
  );
}
