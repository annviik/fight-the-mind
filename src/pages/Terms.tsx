import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";

const Terms = () => {
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
              Terms of Service
            </h1>

            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p className="text-sm text-muted-foreground">
                Last updated: January 12, 2026
              </p>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mt-8 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing and using Fight The Mind, you accept and agree to be bound by
                  the terms and provision of this agreement. If you do not agree to abide by
                  these terms, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mt-8 mb-4">
                  2. Description of Service
                </h2>
                <p>
                  Fight The Mind is a mental health support platform that connects users with
                  licensed mental health professionals and provides a community space for
                  sharing personal mental health journeys. We are not a substitute for
                  professional medical advice, diagnosis, or treatment.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mt-8 mb-4">
                  3. User Responsibilities
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must be at least 18 years old to use this service</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You agree to provide accurate and complete information</li>
                  <li>You will not use the platform to harass, abuse, or harm others</li>
                  <li>You will not share content that is illegal, harmful, or inappropriate</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mt-8 mb-4">
                  4. Therapist Verification
                </h2>
                <p>
                  We make reasonable efforts to verify the credentials of mental health
                  professionals on our platform. However, users should independently verify
                  the qualifications of any therapist before engaging their services.
                  Verified therapists display a verification badge on their profile.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mt-8 mb-4">
                  5. Community Guidelines
                </h2>
                <p>
                  When sharing stories or commenting, users must:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be respectful and supportive of others</li>
                  <li>Not share personally identifiable information about others</li>
                  <li>Not promote self-harm or harmful behaviors</li>
                  <li>Report any concerning content to our moderation team</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mt-8 mb-4">
                  6. Limitation of Liability
                </h2>
                <p>
                  Fight The Mind is provided "as is" without any warranties. We are not
                  liable for any damages arising from your use of the platform or your
                  interactions with therapists or other users.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mt-8 mb-4">
                  7. Contact
                </h2>
                <p>
                  For questions about these terms, please contact us at{" "}
                  <a href="mailto:legal@fightthemind.com" className="text-primary hover:underline">
                    legal@fightthemind.com
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

export default Terms;

