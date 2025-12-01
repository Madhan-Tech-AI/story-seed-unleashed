const entries = [
  { id: 1, title: 'Adventures in Space', author: 'Rahul V.', score: 8.5, status: 'Approved' },
  { id: 2, title: 'The Lost Kingdom', author: 'Meera G.', score: 7.2, status: 'Approved' },
  { id: 3, title: 'Funny Stories', author: 'Amit K.', score: 5.0, status: 'Rejected' },
  { id: 4, title: 'Ocean Dreams', author: 'Priya S.', score: 9.0, status: 'Approved' },
];

const JudgeEntries = () => (
  <div className="space-y-6 page-enter">
    <h1 className="font-display text-2xl font-bold text-foreground">Reviewed Entries</h1>
    <div className="grid gap-4">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-card p-6 rounded-2xl border border-border/50 flex justify-between items-center">
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">{entry.title}</h3>
            <p className="text-muted-foreground text-sm">By {entry.author} • Score: {entry.score}/10</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${entry.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{entry.status}</span>
        </div>
      ))}
    </div>
  </div>
);

export default JudgeEntries;
