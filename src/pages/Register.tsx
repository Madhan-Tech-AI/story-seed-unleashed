import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, User, FileText, CreditCard, ArrowRight, ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Story Details', icon: FileText },
  { id: 3, title: 'Payment', icon: CreditCard },
];

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please log in to register for competitions.',
        variant: 'destructive',
      });
      navigate('/user');
    }
  }, [isAuthenticated, loading, navigate, toast]);

  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    city: '',
    storyTitle: '',
    category: '',
    storyDescription: '',
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.age || !formData.city) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return false;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.storyTitle || !formData.category || !formData.storyDescription) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all story details.',
          variant: 'destructive',
        });
        return false;
      }
      if (!videoFile) {
        toast({
          title: 'Missing Video',
          description: 'Please upload your video story.',
          variant: 'destructive',
        });
        return false;
      }
    }
    
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) {
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to register for competitions.',
        variant: 'destructive',
      });
      navigate('/user');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting registration submission...');
      
      // Save to Supabase (without video)
      console.log('Saving to database...');
      const { data: insertData, error: dbError } = await supabase
        .from('registrations')
        .insert({
          user_id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          age: parseInt(formData.age),
          city: formData.city,
          story_title: formData.storyTitle,
          category: formData.category,
          story_description: formData.storyDescription,
          yt_link: null,
        })
        .select();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }
      
      console.log('Database save successful:', insertData);

      // Send to webhook (with video)
      console.log('Sending to webhook...');
      const webhookFormData = new FormData();
      webhookFormData.append('user_id', user.id);
      webhookFormData.append('firstName', formData.firstName);
      webhookFormData.append('lastName', formData.lastName);
      webhookFormData.append('email', formData.email);
      webhookFormData.append('phone', formData.phone);
      webhookFormData.append('age', formData.age);
      webhookFormData.append('city', formData.city);
      webhookFormData.append('title', formData.storyTitle);
      webhookFormData.append('category', formData.category);
      webhookFormData.append('description', formData.storyDescription);
      
      if (videoFile) {
        webhookFormData.append('video', videoFile);
        console.log('Video file attached:', videoFile.name);
      }

      try {
        const webhookResponse = await fetch('https://kamalesh-tech-aiii.app.n8n.cloud/webhook/youtube-upload', {
          method: 'POST',
          body: webhookFormData,
        });

        if (!webhookResponse.ok) {
          console.error('Webhook submission failed with status:', webhookResponse.status);
        } else {
          console.log('Webhook submission successful');
        }
      } catch (webhookError) {
        console.error('Webhook error (non-blocking):', webhookError);
        // Don't throw - webhook failure shouldn't block registration
      }

      setIsComplete(true);
      toast({
        title: 'Registration Successful! 🎉',
        description: 'Welcome to Story Seed Studio! Your submission has been received.',
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'There was an error submitting your registration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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
            Your registration has been submitted successfully. Check your email for confirmation and next steps.
          </p>
          <div className="space-y-4">
            <Link to="/user/dashboard">
              <Button variant="hero" size="lg" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
            <Link to="/">
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
              {steps.map((step, index) => (
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
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input 
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input 
                    type="email" 
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input 
                    type="tel" 
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
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
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input 
                      placeholder="Your city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
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
                    value={formData.storyTitle}
                    onChange={(e) => handleInputChange('storyTitle', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select 
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
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
                    value={formData.storyDescription}
                    onChange={(e) => handleInputChange('storyDescription', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Upload Video Story</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        {videoFile ? videoFile.name : 'Click to upload your video story'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        MP4, MOV, or AVI (max 500MB)
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  Payment Details
                </h2>
                <div className="bg-muted/50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-muted-foreground">Registration Fee</span>
                    <span className="font-semibold text-foreground">₹299</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span className="font-semibold text-foreground">₹50</span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-xl text-primary">₹349</span>
                    </div>
                  </div>
                </div>

                {/* Payment Simulation */}
                <div className="border border-border rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-foreground">Payment Method</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {['UPI', 'Card', 'Net Banking'].map((method) => (
                      <button
                        key={method}
                        className="p-4 border-2 border-border rounded-xl hover:border-primary transition-colors text-center"
                      >
                        <CreditCard className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-sm text-foreground">{method}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    This is a simulated payment. No actual transaction will occur.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={cn(currentStep === 1 && 'invisible')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button variant="hero" onClick={handleNext} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : currentStep === 3 ? 'Complete Registration' : 'Next'}
                {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>

          {/* Terms Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            By registering, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">
              Terms & Conditions
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
