import { Link } from "react-router-dom";
import { Heart, Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">
                Fight The Mind
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A safe space for mental health stories, support, and connection. You're not alone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/stories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Stories
                </Link>
              </li>
              <li>
                <Link to="/find-support" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Find Support
                </Link>
              </li>
              <li>
                <Link to="/therapist-signup" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  For Therapists
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">Crisis Support</h4>
            <p className="text-sm text-muted-foreground mb-3">
              If you're in crisis, please reach out:
            </p>
            <div className="space-y-2">
              <a
                href="tel:988"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Phone className="w-4 h-4" />
                988 Suicide & Crisis Lifeline
              </a>
              <a
                href="mailto:support@fightthemind.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                support@fightthemind.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fight The Mind. All rights reserved. Made with{" "}
            <Heart className="w-4 h-4 inline text-accent" /> for mental health awareness.
          </p>
        </div>
      </div>
    </footer>
  );
};
