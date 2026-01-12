import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Clock, User, Heart, MessageCircle, Search, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { storiesApi, Story } from "@/lib/api";

const categories = [
  "All",
  "Depression",
  "Anxiety",
  "Recovery",
  "Personal Growth",
  "OCD",
  "Grief",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Stories = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStories();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const fetchStories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await storiesApi.getAll({
        category: selectedCategory,
        search: searchQuery,
      });
      setStories(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stories");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-12 pb-8 hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Community Stories
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Real experiences from people who've walked similar paths. Your story
              could be the light someone else needs.
            </p>
            <Button size="lg" variant="accent" asChild>
              <Link to="/share-story">Share Your Story</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search stories..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="flex items-center justify-center gap-2 text-destructive mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchStories} variant="outline">
                Try Again
              </Button>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No stories found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {stories.map((story) => (
                <motion.div key={story.id} variants={cardVariants}>
                  <Link to={`/stories/${story.id}`}>
                    <Card className="h-full bg-card border-border hover:border-primary/30 transition-all duration-300 card-shadow hover:card-shadow-hover group cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {story.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {story.date}
                          </span>
                        </div>
                        <h3 className="text-lg font-serif font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {story.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                          {story.excerpt}
                        </p>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between pt-0 pb-6">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {story.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {story.readTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className={`w-3 h-3 ${story.userLiked ? "fill-primary text-primary" : ""}`} />
                            {story.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {story.comments}
                          </span>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Stories;
