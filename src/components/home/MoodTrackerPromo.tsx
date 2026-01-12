import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Smile, 
  Meh, 
  Frown, 
  Sun, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const moodEmojis = [
  { icon: Frown, color: "text-orange-500", bg: "bg-orange-500/10" },
  { icon: Meh, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { icon: Smile, color: "text-lime-500", bg: "bg-lime-500/10" },
  { icon: Sun, color: "text-green-500", bg: "bg-green-500/10" },
];

export const MoodTrackerPromo = () => {
  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border border-primary/20 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-12 lg:p-16">
            {/* Content */}
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 w-fit"
              >
                <Sparkles className="w-4 h-4" />
                <span>New Feature</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6"
              >
                Understand your mind with{" "}
                <span className="text-gradient">Mood Tracking</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground mb-8 leading-relaxed"
              >
                Track your daily mood, energy levels, and activities to discover patterns 
                in your mental wellness. Gain insights that help you understand what 
                affects your emotional well-being.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" asChild>
                  <Link to="/mood-tracker">
                    Start Tracking <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/signup">Create Free Account</Link>
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex gap-8 mt-10"
              >
                <div>
                  <p className="text-2xl font-bold text-foreground">Daily</p>
                  <p className="text-sm text-muted-foreground">Check-ins</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">Patterns</p>
                  <p className="text-sm text-muted-foreground">Discovered</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">Free</p>
                  <p className="text-sm text-muted-foreground">Forever</p>
                </div>
              </motion.div>
            </div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center justify-center"
            >
              <div className="relative w-full max-w-sm">
                {/* Mock Mood Card */}
                <div className="bg-card rounded-2xl border border-border shadow-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Today's Mood</p>
                      <p className="text-xs text-muted-foreground">January 12, 2026</p>
                    </div>
                  </div>

                  {/* Mood Selection Preview */}
                  <div className="flex justify-between mb-6">
                    {moodEmojis.map((mood, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className={`p-3 rounded-xl ${mood.bg} ${i === 2 ? "ring-2 ring-primary scale-110" : ""}`}
                      >
                        <mood.icon className={`w-6 h-6 ${mood.color}`} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Activity Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["Exercise", "Good Sleep", "Social"].map((tag, i) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>

                  {/* Mini Chart */}
                  <div className="bg-muted/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-foreground">Weekly Trend</span>
                    </div>
                    <div className="flex items-end gap-1 h-12">
                      {[3, 4, 3, 4, 5, 4, 5].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height * 20}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.9 + i * 0.05 }}
                          className={`flex-1 rounded-t ${i === 6 ? "bg-primary" : "bg-primary/40"}`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2 }}
                  className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                >
                  ✨ Free to use!
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

