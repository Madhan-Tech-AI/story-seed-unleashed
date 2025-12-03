import { Users, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

const users = [
  { id: 1, name: 'Ananya Sharma', email: 'ananya@example.com', age: 10, registrations: 5, status: 'Active' },
  { id: 2, name: 'Arjun Patel', email: 'arjun@example.com', age: 12, registrations: 3, status: 'Active' },
  { id: 3, name: 'Priya Reddy', email: 'priya@example.com', age: 9, registrations: 7, status: 'Active' },
  { id: 4, name: 'Vikram Singh', email: 'vikram@example.com', age: 11, registrations: 2, status: 'Inactive' },
];

const AdminUsers = () => (
  <div className="space-y-6 page-enter">
    <div className="flex justify-between items-center">
      <h1 className="font-display text-2xl font-bold text-foreground">Manage Users</h1>
      <div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search users..." className="pl-9" /></div>
    </div>
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50"><tr><th className="text-left p-4 font-medium text-foreground">User</th><th className="text-left p-4 font-medium text-foreground">Age</th><th className="text-left p-4 font-medium text-foreground">Registrations</th><th className="text-left p-4 font-medium text-foreground">Status</th></tr></thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-border/50">
              <td className="p-4"><div><p className="font-medium text-foreground">{user.name}</p><p className="text-muted-foreground text-sm">{user.email}</p></div></td>
              <td className="p-4 text-muted-foreground">{user.age} years</td>
              <td className="p-4 text-muted-foreground">{user.registrations}</td>
              <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>{user.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminUsers;
