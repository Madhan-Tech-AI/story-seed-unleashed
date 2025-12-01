import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, User, FileText, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Story Details', icon: FileText },
  { id: 3, title: 'Payment', icon: CreditCard },
];

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
      toast({
        title: 'Registration Successful! 🎉',
        description: 'Welcome to Story Seed Studio! Check your email for confirmation.',
      });
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
            <Link to="/user">
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
                    <Input placeholder="Enter first name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input placeholder="Enter last name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input type="tel" placeholder="+91 98765 43210" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input type="number" placeholder="Enter age" min={5} max={18} />
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input placeholder="Your city" />
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
                  <Input placeholder="Enter your story title" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground">
                    <option>Select category</option>
                    <option>Fantasy</option>
                    <option>Adventure</option>
                    <option>Family</option>
                    <option>Sci-Fi</option>
                    <option>Humor</option>
                    <option>Mystery</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Story Description (Brief)</Label>
                  <textarea
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground resize-none"
                    rows={4}
                    placeholder="Tell us briefly what your story is about..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Upload Story (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Drag & drop your file here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      PDF, DOC, or DOCX (max 10MB)
                    </p>
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
              <Button variant="hero" onClick={handleNext}>
                {currentStep === 3 ? 'Complete Registration' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
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
