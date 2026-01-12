import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  MapPin,
  Star,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Calendar,
  Award,
} from "lucide-react";
import { therapistApi, Therapist } from "@/lib/api";
import { MessageTherapistDialog } from "@/components/MessageTherapistDialog";

const TherapistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTherapist();
    }
  }, [id]);

  const fetchTherapist = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await therapistApi.getById(Number(id));
      setTherapist(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load therapist");
    } finally {
      setIsLoading(false);
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

  if (error || !therapist) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="flex items-center justify-center gap-2 text-destructive mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error</span>
          </div>
          <p className="text-muted-foreground mb-4">{error || "Therapist not found"}</p>
          <Button asChild variant="outline">
            <Link to="/find-support">Back to Search</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button variant="ghost" size="sm" asChild className="mb-6">
                <Link to="/find-support">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Search
                </Link>
              </Button>
            </motion.div>

            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="overflow-hidden mb-8">
                <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5" />
                <CardContent className="relative pt-0 pb-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar / Photo */}
                    <div className="-mt-16 md:-mt-12 flex-shrink-0">
                      <div className="w-32 h-32 rounded-2xl bg-background border-4 border-background shadow-lg flex items-center justify-center relative overflow-hidden">
                        {therapist.photoUrl ? (
                          <img
                            src={therapist.photoUrl}
                            alt={therapist.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl font-serif font-bold text-primary">
                            {therapist.name
                              .replace("Dr. ", "")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        )}
                        {therapist.verified && (
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 pt-4 md:pt-2">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                              {therapist.name}
                            </h1>
                            {therapist.verified && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                <ShieldCheck className="w-4 h-4" />
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-lg text-muted-foreground mb-3">
                            {therapist.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-foreground">
                              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                              <span className="font-semibold">{therapist.rating.toFixed(1)}</span>
                              <span className="text-muted-foreground">
                                ({therapist.reviews} reviews)
                              </span>
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              {therapist.city}, {therapist.state}
                            </span>
                            {therapist.available ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                Accepting new clients
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                Waitlist only
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => setIsMessageDialogOpen(true)}>
                            <Mail className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                          {therapist.phone && (
                            <Button variant="outline" asChild>
                              <a href={`tel:${therapist.phone}`}>
                                <Phone className="w-4 h-4 mr-2" />
                                Call
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="md:col-span-2 space-y-6"
              >
                {/* About */}
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
                      About
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {therapist.bio || 
                        `${therapist.name} is a dedicated mental health professional committed to helping individuals navigate life's challenges. With expertise in ${therapist.specialties.join(", ")}, they provide compassionate, evidence-based care tailored to each client's unique needs.`}
                    </p>
                  </CardContent>
                </Card>

                {/* Specialties */}
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-serif font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      Specialties
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {therapist.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                {/* Contact Card */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      {therapist.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${therapist.email}`} className="hover:text-primary">
                            {therapist.email}
                          </a>
                        </div>
                      )}
                      {therapist.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${therapist.phone}`} className="hover:text-primary">
                            {therapist.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{therapist.city}, {therapist.state}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Book Appointment CTA */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6 text-center">
                    <Calendar className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">
                      Ready to start?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Send a message to schedule your first consultation.
                    </p>
                    <Button onClick={() => setIsMessageDialogOpen(true)} className="w-full">
                      Get in Touch
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <MessageTherapistDialog
        therapist={therapist}
        open={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
      />
    </Layout>
  );
};

export default TherapistProfile;

