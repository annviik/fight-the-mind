import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Smile,
  Meh,
  Frown,
  CloudRain,
  Sun,
  Loader2,
  Plus,
  Calendar,
  TrendingUp,
  Heart,
  Zap,
  Moon,
  Coffee,
  Dumbbell,
  Users,
  Book,
  Music,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { moodApi, MoodEntry } from "@/lib/api";
import { Link } from "react-router-dom";

const moodOptions = [
  { value: 1, icon: CloudRain, label: "Very Low", color: "text-red-500", bg: "bg-red-500/10 hover:bg-red-500/20" },
  { value: 2, icon: Frown, label: "Low", color: "text-orange-500", bg: "bg-orange-500/10 hover:bg-orange-500/20" },
  { value: 3, icon: Meh, label: "Okay", color: "text-yellow-500", bg: "bg-yellow-500/10 hover:bg-yellow-500/20" },
  { value: 4, icon: Smile, label: "Good", color: "text-lime-500", bg: "bg-lime-500/10 hover:bg-lime-500/20" },
  { value: 5, icon: Sun, label: "Great", color: "text-green-500", bg: "bg-green-500/10 hover:bg-green-500/20" },
];

const energyOptions = [
  { value: 1, icon: Moon, label: "Exhausted" },
  { value: 2, icon: Coffee, label: "Tired" },
  { value: 3, icon: Meh, label: "Moderate" },
  { value: 4, icon: Zap, label: "Energetic" },
  { value: 5, icon: Sun, label: "Very High" },
];

const activityOptions = [
  { id: "exercise", icon: Dumbbell, label: "Exercise" },
  { id: "social", icon: Users, label: "Social" },
  { id: "reading", icon: Book, label: "Reading" },
  { id: "music", icon: Music, label: "Music" },
  { id: "sleep", icon: Moon, label: "Good Sleep" },
  { id: "nature", icon: Sun, label: "Nature" },
];

const MoodTracker = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<number | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadEntries();
    }
  }, [isAuthenticated]);

  const loadEntries = async () => {
    setIsLoadingEntries(true);
    try {
      const data = await moodApi.getEntries(14);
      setEntries(data);
    } catch {
      // Silently fail - entries are optional
    } finally {
      setIsLoadingEntries(false);
    }
  };

  const toggleActivity = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((a) => a !== activityId)
        : [...prev, activityId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: "Select a mood",
        description: "Please select how you're feeling today.",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your mood entries.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await moodApi.log({
        mood: selectedMood,
        energy: selectedEnergy || undefined,
        notes: notes || undefined,
        activities: selectedActivities.length > 0 ? selectedActivities : undefined,
      });

      toast({
        title: "Mood logged!",
        description: "Your mood has been recorded successfully.",
      });

      // Reset form
      setSelectedMood(null);
      setSelectedEnergy(null);
      setSelectedActivities([]);
      setNotes("");
      setShowForm(false);

      // Reload entries
      loadEntries();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to log mood",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodIcon = (value: number) => {
    const mood = moodOptions.find((m) => m.value === value);
    return mood ? mood.icon : Meh;
  };

  const getMoodColor = (value: number) => {
    const mood = moodOptions.find((m) => m.value === value);
    return mood ? mood.color : "text-muted-foreground";
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
                Track Your Mood
              </h1>
              <p className="text-muted-foreground mb-8">
                Sign in to start tracking your daily mood and see patterns over time.
              </p>
              <div className="flex gap-3 justify-center">
                <Button asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/signup">Create Account</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Heart className="w-4 h-4" />
                <span>Mood Tracker</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                How are you feeling?
              </h1>
              <p className="text-muted-foreground">
                Track your daily mood to understand your emotional patterns.
              </p>
            </motion.div>

            {/* Log Mood Form */}
            {showForm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Log Today's Mood
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Mood Selection */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">
                        How are you feeling right now?
                      </Label>
                      <div className="flex gap-3 flex-wrap">
                        {moodOptions.map((mood) => (
                          <button
                            key={mood.value}
                            onClick={() => setSelectedMood(mood.value)}
                            className={`flex flex-col items-center gap-1 p-4 rounded-xl transition-all ${mood.bg} ${
                              selectedMood === mood.value
                                ? "ring-2 ring-primary scale-105"
                                : "opacity-70 hover:opacity-100"
                            }`}
                          >
                            <mood.icon className={`w-8 h-8 ${mood.color}`} />
                            <span className="text-xs font-medium">{mood.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Energy Level */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">
                        Energy level (optional)
                      </Label>
                      <div className="flex gap-2 flex-wrap">
                        {energyOptions.map((energy) => (
                          <button
                            key={energy.value}
                            onClick={() =>
                              setSelectedEnergy(
                                selectedEnergy === energy.value ? null : energy.value
                              )
                            }
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                              selectedEnergy === energy.value
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <energy.icon className="w-4 h-4" />
                            <span className="text-sm">{energy.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Activities */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">
                        What did you do today? (optional)
                      </Label>
                      <div className="flex gap-2 flex-wrap">
                        {activityOptions.map((activity) => (
                          <button
                            key={activity.id}
                            onClick={() => toggleActivity(activity.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                              selectedActivities.includes(activity.id)
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <activity.icon className="w-4 h-4" />
                            <span className="text-sm">{activity.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes" className="text-base font-medium mb-3 block">
                        Notes (optional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="How was your day? What's on your mind?"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      onClick={handleSubmit}
                      disabled={!selectedMood || isSubmitting}
                      className="w-full"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Log Mood
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8"
              >
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Sun className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Mood logged!
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Great job tracking your mood today.
                    </p>
                    <Button variant="outline" onClick={() => setShowForm(true)}>
                      Log Another Entry
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Need to Talk? */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                <CardContent className="py-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-semibold text-foreground mb-1">
                        Need to talk through how you're feeling?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Chat with our wellness companion for support and coping strategies.
                      </p>
                    </div>
                    <Button asChild>
                      <Link to="/wellness-checkin">
                        Start a Conversation
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Entries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Recent Entries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingEntries ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : entries.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No mood entries yet. Start tracking to see your history!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {entries.slice(0, 7).map((entry) => {
                        const MoodIcon = getMoodIcon(entry.mood);
                        return (
                          <div
                            key={entry.id}
                            className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                          >
                            <div className={`p-2 rounded-full bg-background ${getMoodColor(entry.mood)}`}>
                              <MoodIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground">
                                {moodOptions.find((m) => m.value === entry.mood)?.label || "Unknown"}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {entry.formattedDate}
                                {entry.notes && ` • ${entry.notes}`}
                              </p>
                            </div>
                            {entry.activities.length > 0 && (
                              <div className="hidden sm:flex gap-1">
                                {entry.activities.slice(0, 3).map((actId) => {
                                  const activity = activityOptions.find((a) => a.id === actId);
                                  return activity ? (
                                    <div
                                      key={actId}
                                      className="p-1.5 rounded bg-background"
                                      title={activity.label}
                                    >
                                      <activity.icon className="w-3 h-3 text-muted-foreground" />
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MoodTracker;

