import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";

const Privacy = () => {
  return (
    <Layout>
      <section className="py-12 min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-serif font-bold text-foreground mb-8">
              Privacy Policy
            </h1>

            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p className="text-sm text-muted-foreground">
                Last updated: January 12, 2026
              </p>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mt-8 mb-4">
                  1. Information We Collect
                </h2>
                <p>We collect information you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account information (name, email, password)</li>
                  <li>Profile information for therapists (credentials, specialties, location)</li>
                  <li>Stories and comments you share on the platform</li>
                  <li>Communications with therapists or our support team</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mt-8 mb-4">
                  2. How We Use Your Information
                </h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Connect you with mental health professionals in your area</li>
                  <li>Enable community features like story sharing and comments</li>
                  <li>Send you important updates about your account</li>
                  <li>Protect the safety and security of our users</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mt-8 mb-4">
                  3. Information Sharing
                </h2>
                <p>
                  We do not sell your personal information. We may share your information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With therapists you choose to contact</li>
                  <li>When you share stories or comments publicly</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect the rights and safety of our users</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mt-8 mb-4">
                  4. Data Security
                </h2>
                <p>
                  We implement appropriate security measures to protect your personal
                  information. Passwords are encrypted and we use secure connections
                  for data transmission. However, no method of transmission over the
                  Internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mt-8 mb-4">
                  5. Your Rights
                </h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of your data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mt-8 mb-4">
                  6. Anonymous Sharing
                </h2>
                <p>
                  When you share stories anonymously, your identity is not displayed
                  publicly. However, we may retain internal records linking stories
                  to accounts for moderation purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mt-8 mb-4">
                  7. Contact Us
                </h2>
                <p>
                  For privacy-related questions, please contact us at{" "}
                  <a href="mailto:privacy@fightthemind.com" className="text-primary hover:underline">
                    privacy@fightthemind.com
                  </a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;

