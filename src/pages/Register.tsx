import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, User, FileText, ArrowRight, ArrowLeft, Loader2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Event {
  id: string;
  name: string;
  description: string | null;
}

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Story Details', icon: FileText },
  { id: 3, title: 'Review & Submit', icon: Check },
];

const WEBHOOK_URL = 'https://kamalesh-tech-aiii.app.n8n.cloud/webhook/youtube-upload';

const Register = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    city: '',
  });
  const [storyDetails, setStoryDetails] = useState<{
    title: string;
    category: string;
    description: string;
    videoFile: File | null;
  }>({
    title: '',
    category: '',
    description: '',
    videoFile: null,
  });

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (user?.email && !personalInfo.email) {
      setPersonalInfo(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, name, description')
        .eq('is_active', true);
      
      if (!error && data) {
        setEvents(data);
      }
    };
    fetchEvents();
  }, []);

  // Redirect to login if not authenticated (after loading completes)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to register for the competition.',
        variant: 'destructive',
      });
      navigate('/user');
    }
  }, [isLoading, isAuthenticated, navigate, toast]);

  const validateStep1 = () => {
    const { firstName, lastName, email, phone, age, city } = personalInfo;
    if (!firstName || !lastName || !email || !phone || !age || !city) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all personal information fields before continuing.',
        variant: 'destructive',
      });
      return false;
    }
    if (!selectedEventId) {
      toast({
        title: 'Event Required',
        description: 'Please select an event to participate in.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const { title, category, description, videoFile } = storyDetails;
    if (!title || !category || !description || !videoFile) {
      toast({
        title: 'Missing story details',
        description: 'Please complete all story fields and upload a video before submitting.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const submitRegistration = async () => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to submit.',
        variant: 'destructive',
      });
      return false;
    }

    setIsSubmitting(true);

    try {
      // 1. Save registration to Supabase
      const { error: dbError } = await supabase.from('registrations').insert({
        user_id: user.id,
        event_id: selectedEventId,
        first_name: personalInfo.firstName,
        last_name: personalInfo.lastName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        age: parseInt(personalInfo.age),
        city: personalInfo.city,
        story_title: storyDetails.title,
        category: storyDetails.category,
        story_description: storyDetails.description,
      });

      if (dbError) {
        console.error('Database error:', dbError);
        toast({
          title: 'Registration Failed',
          description: 'Could not save registration. Please try again.',
          variant: 'destructive',
        });
        return false;
      }

      // 2. Send data + video to webhook
      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('event_id', selectedEventId);
      formData.append('first_name', personalInfo.firstName);
      formData.append('last_name', personalInfo.lastName);
      formData.append('email', personalInfo.email);
      formData.append('phone', personalInfo.phone);
      formData.append('age', personalInfo.age);
      formData.append('city', personalInfo.city);
      formData.append('story_title', storyDetails.title);
      formData.append('category', storyDetails.category);
      formData.append('story_description', storyDetails.description);
      
      if (storyDetails.videoFile) {
        formData.append('video', storyDetails.videoFile);
      }

      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          body: formData,
        });
      } catch (webhookError) {
        console.error('Webhook error:', webhookError);
        // Don't fail the whole registration if webhook fails
      }

      return true;
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      const success = await submitRegistration();
      if (success) {
        setIsComplete(true);
        toast({
          title: 'Registration Successful! 🎉',
          description: 'Your story has been submitted successfully.',
        });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-warm">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render form if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (isComplete) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-warm">
        <div className="max-w-md w-full mx-auto p-8 text-center animate-scale-in">
          <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 success-tick">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Registration Complete!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your registration has been submitted successfully. Check your email for confirmation
            and next steps.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link to="/user/dashboard" className="flex-1">
              <Button variant="hero" size="lg" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-warm page-enter">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Join the <span className="text-gradient">Competition</span>
            </h1>
            <p className="text-muted-foreground">
              Complete your registration in 3 simple steps
            </p>
          </div>

          {/* Progress Steps */}
          <div className="relative mb-12">
            <div className="flex justify-between items-center">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500',
                      currentStep > step.id
                        ? 'bg-green-500 text-primary-foreground'
                        : currentStep === step.id
                        ? 'bg-primary text-primary-foreground shadow-glow'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'mt-2 text-sm font-medium',
                      currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
            {/* Progress Line */}
            <div className="absolute top-7 left-0 right-0 h-0.5 bg-muted -z-0">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border/50">
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  Personal Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      placeholder="Enter first name"
                      value={personalInfo.firstName}
                      onChange={(e) =>
                        setPersonalInfo((prev) => ({ ...prev, firstName: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      placeholder="Enter last name"
                      value={personalInfo.lastName}
                      onChange={(e) =>
                        setPersonalInfo((prev) => ({ ...prev, lastName: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={personalInfo.email}
                    onChange={(e) =>
                      setPersonalInfo((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={personalInfo.phone}
                    onChange={(e) =>
                      setPersonalInfo((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input
                      type="number"
                      placeholder="Enter age"
                      min={5}
                      max={18}
                      value={personalInfo.age}
                      onChange={(e) =>
                        setPersonalInfo((prev) => ({ ...prev, age: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      placeholder="Your city"
                      value={personalInfo.city}
                      onChange={(e) =>
                        setPersonalInfo((prev) => ({ ...prev, city: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Select Event</Label>
                  <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                    <SelectTrigger className="w-full">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Choose an event to participate" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  Story Details
                </h2>
                <div className="space-y-2">
                  <Label>Story Title</Label>
                  <Input
                    placeholder="Enter your story title"
                    value={storyDetails.title}
                    onChange={(e) =>
                      setStoryDetails((prev) => ({ ...prev, title: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                    value={storyDetails.category}
                    onChange={(e) =>
                      setStoryDetails((prev) => ({ ...prev, category: e.target.value }))
                    }
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Family">Family</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Humor">Humor</option>
                    <option value="Mystery">Mystery</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Story Description (Brief)</Label>
                  <textarea
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground resize-none"
                    rows={4}
                    placeholder="Tell us briefly what your story is about..."
                    value={storyDetails.description}
                    onChange={(e) =>
                      setStoryDetails((prev) => ({ ...prev, description: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Upload Story Video (Required)</Label>
                  <input
                    id="story-video-input"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setStoryDetails((prev) => ({ ...prev, videoFile: file }));
                    }}
                    required
                  />
                  <label
                    htmlFor="story-video-input"
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer block"
                  >
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Click to browse and upload your story video (required)
                    </p>
                    {storyDetails.videoFile && (
                      <p className="text-xs text-foreground mt-2">
                        Selected: {storyDetails.videoFile.name}
                      </p>
                    )}
                  </label>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  Review &amp; Confirm
                </h2>
                <p className="text-muted-foreground">
                  Please review your details before submitting your registration.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Personal Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Name</span>
                        <span className="font-medium text-foreground">
                          {personalInfo.firstName} {personalInfo.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium text-foreground">{personalInfo.email}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium text-foreground">{personalInfo.phone}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Age</span>
                        <span className="font-medium text-foreground">{personalInfo.age}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">City</span>
                        <span className="font-medium text-foreground">{personalInfo.city}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Event</span>
                        <span className="font-medium text-foreground">
                          {events.find(e => e.id === selectedEventId)?.name || 'Not selected'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Story Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Title</span>
                        <span className="font-medium text-foreground">{storyDetails.title}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium text-foreground">
                          {storyDetails.category}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground block">Description</span>
                        <p className="font-medium text-foreground text-sm bg-muted/40 rounded-lg p-3">
                          {storyDetails.description}
                        </p>
                      </div>
                      <div className="flex justify-between gap-4 items-center">
                        <span className="text-muted-foreground">Video</span>
                        <span className="font-medium text-foreground truncate max-w-[200px]">
                          {storyDetails.videoFile?.name ?? 'No file selected'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  By clicking <span className="font-semibold">Submit Registration</span>, you
                  confirm that all details provided are accurate.
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1 || isSubmitting}
                className={cn(currentStep === 1 && 'invisible')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button variant="hero" onClick={handleNext} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : currentStep === 3 ? (
                  'Submit Registration'
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
