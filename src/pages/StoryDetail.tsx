import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Clock,
  User,
  Heart,
  MessageCircle,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { storiesApi, StoryDetail as StoryDetailType } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const StoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<StoryDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchStory();
    }
  }, [id]);

  const fetchStory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await storiesApi.getById(Number(id));
      setStory(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load story");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like stories.",
        variant: "destructive",
      });
      return;
    }

    if (!story) return;

    setIsLiking(true);
    try {
      const result = await storiesApi.toggleLike(story.id);
      setStory((prev) =>
        prev
          ? {
              ...prev,
              likes: result.liked ? prev.likes + 1 : prev.likes - 1,
              userLiked: result.liked,
            }
          : null
      );
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      toast({
        title: "Comment required",
        description: "Please write a comment before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated && !commentAuthor.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name or sign in to comment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingComment(true);
    try {
      await storiesApi.addComment(Number(id), {
        content: commentContent,
        authorName: isAuthenticated ? `${user?.firstName} ${user?.lastName}` : commentAuthor,
      });

      toast({
        title: "Comment added",
        description: "Your comment has been posted.",
      });

      setCommentContent("");
      setCommentAuthor("");
      fetchStory(); // Refresh to get new comment
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !story) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="flex items-center justify-center gap-2 text-destructive mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error</span>
          </div>
          <p className="text-muted-foreground mb-4">{error || "Story not found"}</p>
          <Button asChild variant="outline">
            <Link to="/stories">Back to Stories</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="py-12">
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
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                {story.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                {story.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {story.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {story.readTime}
                </span>
                <span>{story.date}</span>
              </div>
            </motion.header>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg max-w-none mb-12"
            >
              {story.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-foreground/90 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4 py-6 border-t border-b border-border mb-12"
            >
              <Button
                variant={story.userLiked ? "default" : "outline"}
                onClick={handleLike}
                disabled={isLiking}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${story.userLiked ? "fill-current" : ""}`}
                />
                {story.likes} {story.likes === 1 ? "Like" : "Likes"}
              </Button>
              <span className="flex items-center gap-1 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                {Array.isArray(story.comments) ? story.comments.length : story.comments} Comments
              </span>
            </motion.div>

            {/* Comments Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                Comments
              </h2>

              {/* Comment Form */}
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmitComment} className="space-y-4">
                    {!isAuthenticated && (
                      <div className="space-y-2">
                        <Label htmlFor="authorName">Your Name</Label>
                        <Input
                          id="authorName"
                          placeholder="Enter your name..."
                          value={commentAuthor}
                          onChange={(e) => setCommentAuthor(e.target.value)}
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="comment">Your Comment</Label>
                      <Textarea
                        id="comment"
                        placeholder="Share your thoughts..."
                        rows={3}
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                      />
                    </div>
                    <Button type="submit" disabled={isSubmittingComment}>
                      {isSubmittingComment ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Post Comment
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Comments List */}
              {Array.isArray(story.comments) && story.comments.length > 0 ? (
                <div className="space-y-4">
                  {story.comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <span className="font-medium text-foreground">
                              {comment.author}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {comment.date}
                            </span>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm pl-10">
                          {comment.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </motion.section>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default StoryDetail;

