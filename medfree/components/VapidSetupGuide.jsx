"use client";

import { useState } from "react";

export default function VapidSetupGuide() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-5 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <svg
            className="w-6 h-6 text-amber-600 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h4 className="font-semibold text-amber-900 mb-2">
              🔐 VAPID Keys Required
            </h4>
            <p className="text-sm text-amber-800 mb-3">
              Push notifications require VAPID keys to be configured. Follow these steps:
            </p>
            <ol className="text-sm text-amber-800 space-y-2 list-decimal list-inside ml-2">
              <li>
                <strong>Generate keys:</strong>
                <code className="block mt-1 bg-amber-100 px-3 py-2 rounded font-mono text-xs">
                  npx web-push generate-vapid-keys
                </code>
              </li>
              <li>
                <strong>Add to .env file:</strong>
                <code className="block mt-1 bg-amber-100 px-3 py-2 rounded font-mono text-xs">
                  NEXT_PUBLIC_VAPID_PUBLIC_KEY=YOUR_KEY_HERE
                  <br />
                  VAPID_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
                </code>
              </li>
              <li>
                <strong>Restart server:</strong> Stop and run{" "}
                <code className="bg-amber-100 px-2 py-0.5 rounded font-mono text-xs">
                  npm run dev
                </code>
              </li>
            </ol>
            <p className="text-sm text-amber-800 mt-3">
              📖 See{" "}
              <code className="bg-amber-100 px-2 py-0.5 rounded font-mono">
                PUSH_NOTIFICATIONS_SETUP.md
              </code>{" "}
              for detailed instructions.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-amber-600 hover:text-amber-800 p-1 -mt-1 -mr-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
