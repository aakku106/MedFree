#!/usr/bin/env node

/**
 * Script to generate VAPID keys for push notifications
 * Run: node scripts/generate-vapid-keys.js
 */

const webpush = require("web-push");
const fs = require("fs");
const path = require("path");

console.log("\n🔐 Generating VAPID Keys for Push Notifications...\n");

try {
  // Generate VAPID keys
  const vapidKeys = webpush.generateVAPIDKeys();

  console.log("✅ Keys generated successfully!\n");
  console.log(
    "═══════════════════════════════════════════════════════════════\n"
  );
  console.log("📋 Copy these keys to your .env file:\n");
  console.log("NEXT_PUBLIC_VAPID_PUBLIC_KEY=" + vapidKeys.publicKey);
  console.log("VAPID_PRIVATE_KEY=" + vapidKeys.privateKey);
  console.log("VAPID_EMAIL=admin@medfree.com");
  console.log(
    "\n═══════════════════════════════════════════════════════════════\n"
  );

  // Check if .env exists
  const envPath = path.join(__dirname, "..", ".env");
  const envLocalPath = path.join(__dirname, "..", ".env.local");

  let targetEnvFile = envPath;
  if (fs.existsSync(envLocalPath)) {
    targetEnvFile = envLocalPath;
  }

  if (fs.existsSync(targetEnvFile)) {
    console.log(`📝 Found environment file: ${path.basename(targetEnvFile)}\n`);

    // Read current .env content
    let envContent = fs.readFileSync(targetEnvFile, "utf8");

    // Check if VAPID keys already exist
    if (envContent.includes("NEXT_PUBLIC_VAPID_PUBLIC_KEY")) {
      console.log("⚠️  VAPID keys already exist in the file.");
      console.log(
        "   If you want to replace them, manually update the values above.\n"
      );
    } else {
      // Prompt to add keys
      console.log(
        "💡 Would you like to automatically add these keys to your .env file?"
      );
      console.log("   Press Ctrl+C to cancel, or run this command:\n");
      console.log(
        `   node -e "const fs = require('fs'); const content = fs.readFileSync('${targetEnvFile}', 'utf8'); fs.writeFileSync('${targetEnvFile}', content + '\\n# Push Notifications (VAPID)\\nNEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}\\nVAPID_PRIVATE_KEY=${vapidKeys.privateKey}\\nVAPID_EMAIL=admin@medfree.com\\n');"`
      );
      console.log("");
    }
  } else {
    console.log(
      "⚠️  No .env file found. Please create one and add the keys above.\n"
    );
  }

  console.log("📚 Next steps:");
  console.log("   1. Add the keys to your .env file");
  console.log("   2. Restart your development server (npm run dev)");
  console.log("   3. Visit /profile/notifications to test");
  console.log("   4. Grant notification permission when prompted");
  console.log("   5. You should see a success notification!\n");

  console.log("📖 For more information, see: PUSH_NOTIFICATIONS_SETUP.md\n");
} catch (error) {
  console.error("❌ Error generating VAPID keys:", error.message);

  if (error.message.includes("Cannot find module")) {
    console.log("\n💡 You need to install web-push first:");
    console.log("   npm install web-push\n");
  }

  process.exit(1);
}
