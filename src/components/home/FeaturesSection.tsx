import { motion } from "framer-motion";
import { Heart, MapPin, Users, Shield, Smile } from "lucide-react";

const features = [
  {
    icon: Smile,
    title: "Track Your Mood",
    description:
      "Log your daily emotions, energy levels, and activities. Discover patterns and gain insights into your mental wellness.",
  },
  {
    icon: Heart,
    title: "Share Your Story",
    description:
      "Express your mental health journey in a safe, judgment-free environment. Your story could help someone else.",
  },
  {
    icon: MapPin,
    title: "Find Support Nearby",
    description:
      "Connect with licensed therapists and psychologists in your area who understand your unique needs.",
  },
  {
    icon: Users,
    title: "Join a Community",
    description:
      "Connect with others who understand what you're going through. You're never alone in this journey.",
  },
  {
    icon: Shield,
    title: "Safe & Anonymous",
    description:
      "Share anonymously if you prefer. Your privacy and safety are our top priorities.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const FeaturesSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-primary uppercase tracking-wide"
          >
            Why Fight The Mind?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-2 mb-4"
          >
            A Space for Healing & Connection
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            We believe that sharing our struggles is the first step toward healing.
            Here's how we help.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 card-shadow hover:card-shadow-hover group text-center"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
