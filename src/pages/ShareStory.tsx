import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Heart,
  PenLine,
  ArrowLeft,
  Loader2,
  Shield,
  Users,
  Sparkles,
} from "lucide-react";
import { storiesApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Depression",
  "Anxiety",
  "Recovery",
  "Personal Growth",
  "OCD",
  "Grief",
  "PTSD",
  "Relationships",
  "Other",
];

const ShareStory = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [agreedToGuidelines, setAgreedToGuidelines] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please give your story a title.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim() || content.length < 50) {
      toast({
        title: "Story too short",
        description: "Please write at least 50 characters to share your story.",
        variant: "destructive",
      });
      return;
    }

    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a category for your story.",
        variant: "destructive",
      });
      return;
    }

    const effectiveAuthor = isAnonymous
      ? "Anonymous"
      : isAuthenticated
      ? `${user?.firstName} ${user?.lastName?.charAt(0)}.`
      : authorName;

    if (!effectiveAuthor.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name or choose to post anonymously.",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToGuidelines) {
      toast({
        title: "Guidelines required",
        description: "Please agree to the community guidelines.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await storiesApi.create({
        title,
        content,
        category,
        authorName: effectiveAuthor,
      });

      toast({
        title: "Story shared!",
        description: "Thank you for sharing your journey with our community.",
      });

      navigate("/stories");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to share story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="py-12 min-h-[calc(100vh-4rem)] hero-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button variant="ghost" size="sm" asChild className="mb-6">
                <Link to="/stories">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Stories
                </Link>
              </Button>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <PenLine className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                Share Your Story
              </h1>
              <p className="text-muted-foreground">
                Your experience could be the light that guides someone else through their darkness.
              </p>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
              <Card className="text-center p-4">
                <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                <h3 className="font-medium text-sm">Safe Space</h3>
                <p className="text-xs text-muted-foreground">Share anonymously if you prefer</p>
              </Card>
              <Card className="text-center p-4">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <h3 className="font-medium text-sm">Supportive Community</h3>
                <p className="text-xs text-muted-foreground">Connect with others who understand</p>
              </Card>
              <Card className="text-center p-4">
                <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
                <h3 className="font-medium text-sm">Make an Impact</h3>
                <p className="text-xs text-muted-foreground">Help others feel less alone</p>
              </Card>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-border card-shadow">
                <CardHeader>
                  <CardTitle className="font-serif text-center flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    Your Journey
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Story Title *</Label>
                      <Input
                        id="title"
                        placeholder="Give your story a meaningful title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Your Story *</Label>
                      <Textarea
                        id="content"
                        placeholder="Share your experience, your struggles, and what helped you along the way. Your story matters..."
                        rows={10}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isSubmitting}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {content.length} characters (minimum 50)
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="anonymous"
                          checked={isAnonymous}
                          onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                          disabled={isSubmitting}
                        />
                        <label
                          htmlFor="anonymous"
                          className="text-sm font-medium cursor-pointer"
                        >
                          Post anonymously
                        </label>
                      </div>

                      {!isAnonymous && !isAuthenticated && (
                        <div className="space-y-2">
                          <Label htmlFor="authorName">Your Name *</Label>
                          <Input
                            id="authorName"
                            placeholder="How should we display your name? (e.g., Sarah M.)"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            disabled={isSubmitting}
                          />
                        </div>
                      )}

                      {!isAnonymous && isAuthenticated && (
                        <p className="text-sm text-muted-foreground">
                          Posting as: <strong>{user?.firstName} {user?.lastName?.charAt(0)}.</strong>
                        </p>
                      )}
                    </div>

                    <div className="flex items-start space-x-3 pt-4">
                      <Checkbox
                        id="guidelines"
                        checked={agreedToGuidelines}
                        onCheckedChange={(checked) =>
                          setAgreedToGuidelines(checked as boolean)
                        }
                        disabled={isSubmitting}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="guidelines"
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          I agree to the community guidelines
                        </label>
                        <p className="text-xs text-muted-foreground">
                          My story is respectful, doesn't include harmful content, and
                          I have the right to share it.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sharing your story...
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4 mr-2" />
                          Share My Story
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ShareStory;

