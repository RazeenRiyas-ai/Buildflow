import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function AdminUsersPage() {
    const users = [
        { id: 1, name: 'ZamZam Constructions', role: 'Supplier', status: 'Active', joined: 'Oct 20, 2024' },
        { id: 2, name: 'Alex Builder', role: 'Customer', status: 'Active', joined: 'Oct 21, 2024' },
        { id: 3, name: 'Mike R.', role: 'Delivery', status: 'Onboarding', joined: 'Oct 23, 2024' },
        { id: 4, name: 'City Infra Ltd', role: 'Customer', status: 'Suspended', joined: 'Sep 12, 2024' },
    ];

    return (
        <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">User Management</h1>
                <div className="flex gap-2">
                    <Button variant="outline">Export CSV</Button>
                    <Button>+ Add Admin</Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-left border-collapse" style={{ width: '100%' }}>
                        <thead className="bg-muted text-muted-foreground text-sm uppercase">
                            <tr>
                                <th className="p-4 font-medium">User</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Joined</th>
                                <th className="p-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="p-4 font-medium">{user.name}</td>
                                    <td className="p-4">{user.role}</td>
                                    <td className="p-4">
                                        <Badge variant={user.status === 'Active' ? 'success' : user.status === 'Onboarding' ? 'warning' : 'destructive'}>
                                            {user.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-muted">{user.joined}</td>
                                    <td className="p-4 text-right">
                                        <Button size="sm" variant="ghost">Edit</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
