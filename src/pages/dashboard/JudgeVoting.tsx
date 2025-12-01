import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const JudgeVoting = () => {
  const [score, setScore] = useState(7);
  const { toast } = useToast();
  const handleSubmit = () => {
    toast({ title: 'Review Submitted! ✓', description: 'Your evaluation has been recorded.' });
  };
  return (
    <div className="space-y-6 page-enter max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-foreground">Voting Panel</h1>
      <div className="bg-card p-6 rounded-2xl border border-border/50">
        <div className="mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">The Magical Garden of Dreams</h2>
          <p className="text-muted-foreground text-sm">By Ananya Sharma, Age 10 • Fantasy</p>
        </div>
        <div className="bg-muted/50 p-4 rounded-xl mb-6 max-h-60 overflow-y-auto">
          <p className="text-foreground leading-relaxed">Once upon a time, in a small village surrounded by rolling hills, there lived a curious girl named Maya. Every night, she dreamed of a magical garden where flowers could talk and butterflies carried messages from faraway lands...</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Score (1-10)</label>
            <div className="flex items-center gap-2">
              {[...Array(10)].map((_, i) => (
                <button key={i} onClick={() => setScore(i + 1)} className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition-all ${score >= i + 1 ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{i + 1}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Feedback</label>
            <Textarea placeholder="Provide constructive feedback for the storyteller..." rows={4} />
          </div>
          <div className="flex gap-3">
            <Button variant="hero" onClick={handleSubmit}><ThumbsUp className="w-4 h-4" />Approve</Button>
            <Button variant="outline"><ThumbsDown className="w-4 h-4" />Request Revision</Button>
            <Button variant="ghost"><ArrowRight className="w-4 h-4" />Skip</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgeVoting;
