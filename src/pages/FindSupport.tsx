import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MapPin,
  Search,
  Star,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
  LocateFixed,
  ShieldCheck,
} from "lucide-react";
import { therapistApi, Therapist } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { MessageTherapistDialog } from "@/components/MessageTherapistDialog";

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

const FindSupport = () => {
  const [location, setLocation] = useState("");
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!location.trim()) {
      toast({
        title: "Location required",
        description: "Please enter a city or zip code to search.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await therapistApi.search({
        location: location.trim(),
        verified: verifiedOnly || undefined,
      });
      setTherapists(results);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search therapists");
      toast({
        title: "Search failed",
        description: "Unable to search therapists. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location detection.",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding to get city name
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county;
          const state = data.address?.state;
          
          if (city) {
            setLocation(state ? `${city}, ${state}` : city);
            toast({
              title: "Location detected",
              description: `Found: ${city}${state ? `, ${state}` : ""}`,
            });
          } else {
            setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          }
        } catch {
          toast({
            title: "Location detected",
            description: "Using your coordinates for search.",
          });
        }
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        let message = "Unable to get your location.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Location access was denied. Please enable it in your browser settings.";
        }
        toast({
          title: "Location error",
          description: message,
          variant: "destructive",
        });
      }
    );
  };

  const handleMessage = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setIsMessageDialogOpen(true);
  };

  const handleCall = (therapist: Therapist) => {
    if (therapist.phone) {
      window.location.href = `tel:${therapist.phone}`;
    } else {
      toast({
        title: "Phone unavailable",
        description: "Phone contact is not available for this therapist. Try sending a message instead.",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (checked: boolean) => {
    setVerifiedOnly(checked);
    if (hasSearched) {
      // Re-search with new filter
      setIsLoading(true);
      therapistApi
        .search({
          location: location.trim(),
          verified: checked || undefined,
        })
        .then((results) => {
          setTherapists(results);
        })
        .catch((err) => {
          toast({
            title: "Filter failed",
            description: err instanceof Error ? err.message : "Failed to apply filter.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
  <>
    <Layout>
      {/* Hero */}
      <section className="pt-12 pb-16 hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" />
              <span>Find Support Near You</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Connect with Therapists in Your Area
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find licensed psychologists and therapists who understand your needs
              and are ready to help you on your journey to wellness.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter your city or zip code..."
                    className="pl-12 pr-12 h-12 text-base"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={isLoading || isLocating}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={handleGetLocation}
                    disabled={isLoading || isLocating}
                    title="Use my location"
                  >
                    {isLocating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LocateFixed className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <Button type="submit" size="lg" className="h-12" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Find Therapists
                    </>
                  )}
                </Button>
              </div>

              {/* Verified Filter */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <Checkbox
                  id="verifiedOnly"
                  checked={verifiedOnly}
                  onCheckedChange={(checked) => handleFilterChange(checked as boolean)}
                />
                <label
                  htmlFor="verifiedOnly"
                  className="text-sm text-muted-foreground cursor-pointer flex items-center gap-1"
                >
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Show only verified therapists
                </label>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 text-destructive mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {hasSearched && !error && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  Therapists near "{location}"
                </h2>
                <p className="text-muted-foreground">
                  {therapists.length} professional{therapists.length !== 1 ? "s" : ""} found
                  {verifiedOnly && " (verified only)"}
                </p>
              </div>
              <div className="hidden md:flex gap-2">
                <Button variant="secondary" size="sm">
                  Sort by: Rating
                </Button>
              </div>
            </div>

            {therapists.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {verifiedOnly
                    ? "No verified therapists found in this area. Try unchecking the verified filter."
                    : "No therapists found in this area. Try searching a different location."}
                </p>
                <Button variant="outline" onClick={() => setHasSearched(false)}>
                  Search Again
                </Button>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {therapists.map((therapist) => (
                  <motion.div key={therapist.id} variants={cardVariants}>
                    <Card className="overflow-hidden border-border hover:border-primary/30 transition-all duration-300 card-shadow hover:card-shadow-hover">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          {/* Avatar / Photo */}
                          <div className="w-20 h-20 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                            {therapist.photoUrl ? (
                              <img
                                src={therapist.photoUrl}
                                alt={therapist.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-2xl font-serif font-bold text-primary">
                                {therapist.name
                                  .replace("Dr. ", "")
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            )}
                            {therapist.verified && (
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4 text-primary-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Link
                                    to={`/therapist/${therapist.id}`}
                                    className="font-serif font-semibold text-foreground text-lg hover:text-primary transition-colors"
                                  >
                                    {therapist.name}
                                  </Link>
                                  {therapist.verified && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                      <ShieldCheck className="w-3 h-3" />
                                      Verified
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {therapist.title}
                                </p>
                              </div>
                              {therapist.available ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                                  <CheckCircle className="w-3 h-3" />
                                  Available
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                                  <Clock className="w-3 h-3" />
                                  Waitlist
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="flex items-center gap-1 text-foreground">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                {therapist.rating.toFixed(1)}
                                <span className="text-muted-foreground">
                                  ({therapist.reviews})
                                </span>
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                {therapist.city}, {therapist.state}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">
                              {therapist.specialties.map((specialty) => (
                                <span
                                  key={specialty}
                                  className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>

                            <div className="flex gap-2 mt-4">
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => handleMessage(therapist)}
                              >
                                <Mail className="w-4 h-4 mr-1" />
                                Message
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleCall(therapist)}
                              >
                                <Phone className="w-4 h-4 mr-1" />
                                Call
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Before Search - Info Section */}
      {!hasSearched && !error && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-2">
                  Enter Your Location
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tell us where you are, or use the location button to auto-detect.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-2">
                  Verified Professionals
                </h3>
                <p className="text-sm text-muted-foreground">
                  Filter for verified therapists with confirmed credentials.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-2">
                  Connect & Heal
                </h3>
                <p className="text-sm text-muted-foreground">
                  Reach out directly and start your healing journey.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
    <MessageTherapistDialog
      therapist={selectedTherapist}
      open={isMessageDialogOpen}
      onOpenChange={setIsMessageDialogOpen}
    />
  </>
  );
};

export default FindSupport;
