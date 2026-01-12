import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Loader2, Send, CheckCircle, MessageCircle } from "lucide-react";
import { messagesApi, Therapist } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface MessageTherapistDialogProps {
  therapist: Therapist | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const subjectOptions = [
  "Initial Consultation Request",
  "Availability Inquiry",
  "Insurance & Payment Questions",
  "Specialty/Approach Questions",
  "Other",
];

export function MessageTherapistDialog({
  therapist,
  open,
  onOpenChange,
}: MessageTherapistDialogProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [senderName, setSenderName] = useState(
    isAuthenticated ? `${user?.firstName} ${user?.lastName}` : ""
  );
  const [senderEmail, setSenderEmail] = useState(
    isAuthenticated ? user?.email || "" : ""
  );
  const [senderPhone, setSenderPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const resetForm = () => {
    if (!isAuthenticated) {
      setSenderName("");
      setSenderEmail("");
    }
    setSenderPhone("");
    setSubject("");
    setMessage("");
    setIsSuccess(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetForm, 300); // Reset after dialog closes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!therapist) return;

    if (!senderName.trim() || !senderEmail.trim() || !subject || !message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await messagesApi.send({
        therapistId: therapist.id,
        senderName,
        senderEmail,
        senderPhone: senderPhone || undefined,
        subject,
        message,
      });

      setIsSuccess(true);
      toast({
        title: "Message sent!",
        description: `Your inquiry has been sent to ${result.therapistName}.`,
      });
    } catch (error) {
      toast({
        title: "Failed to send",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!therapist) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif">
            <MessageCircle className="w-5 h-5 text-primary" />
            Message {therapist.name}
          </DialogTitle>
          <DialogDescription>
            Send an inquiry to this therapist. They will respond via email.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Message Sent Successfully!
            </h3>
            <p className="text-muted-foreground mb-6">
              {therapist.name} will review your message and respond to{" "}
              <strong>{senderEmail}</strong> soon.
            </p>
            <Button onClick={handleClose}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="senderName">Your Name *</Label>
                <Input
                  id="senderName"
                  placeholder="John Doe"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderPhone">Phone (optional)</Label>
                <Input
                  id="senderPhone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderEmail">Your Email *</Label>
              <Input
                id="senderEmail"
                type="email"
                placeholder="john@example.com"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select value={subject} onValueChange={setSubject} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject..." />
                </SelectTrigger>
                <SelectContent>
                  {subjectOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Tell the therapist a bit about yourself and what you're looking for help with..."
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Your contact information will be shared with {therapist.name} so they can respond.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

