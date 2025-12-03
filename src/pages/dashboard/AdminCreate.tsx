import { useState } from 'react';
import { PlusCircle, Upload, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const AdminCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsSubmitting(false);
    setIsComplete(true);
    toast({ title: 'Competition Created! 🎉', description: 'The new competition is now live.' });
  };
  return (
    <div className="space-y-6 page-enter max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-foreground">Create Competition</h1>
      {isComplete ? (
        <div className="bg-card p-8 rounded-2xl border border-border/50 text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 success-tick"><Check className="w-8 h-8 text-green-600" /></div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">Competition Created!</h2>
          <p className="text-muted-foreground mb-4">Your new competition is now live and accepting registrations.</p>
          <Button variant="hero" onClick={() => setIsComplete(false)}>Create Another</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-2xl border border-border/50 space-y-4">
          <div className="space-y-2"><label className="text-sm font-medium">Competition Name</label><Input placeholder="e.g., Summer Championship 2025" required /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-sm font-medium">Start Date</label><Input type="date" required /></div>
            <div className="space-y-2"><label className="text-sm font-medium">End Date</label><Input type="date" required /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-sm font-medium">Prize Pool</label><Input placeholder="₹50,000" required /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Category</label>
              <select className="w-full h-10 px-3 rounded-lg border border-input bg-background"><option>All Categories</option><option>Fantasy</option><option>Adventure</option><option>Sci-Fi</option></select>
            </div>
          </div>
          <div className="space-y-2"><label className="text-sm font-medium">Description</label><Textarea placeholder="Competition details..." rows={4} /></div>
          <div className="space-y-2"><label className="text-sm font-medium">Banner Image</label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" /><p className="text-sm text-muted-foreground">Click to upload</p>
            </div>
          </div>
          <Button type="submit" variant="hero" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <><PlusCircle className="w-4 h-4" />Create Competition</>}
          </Button>
        </form>
      )}
    </div>
  );
};

export default AdminCreate;
