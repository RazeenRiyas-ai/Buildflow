import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function CustomerProfile() {
    return (
        <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h1 className="text-2xl font-bold">My Profile</h1>

            <div className="grid md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {/* Profile Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="flex gap-4">
                            <Input label="First Name" defaultValue="Alex" />
                            <Input label="Last Name" defaultValue="Builder" />
                        </div>
                        <Input label="Email" defaultValue="alex@builder.com" disabled />
                        <Input label="Phone" defaultValue="+1 (555) 000-0000" />
                        <Button className="w-auto self-start">Update Profile</Button>
                    </CardContent>
                </Card>

                {/* Saved Addresses */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Saved Addresses</CardTitle>
                        <Button variant="outline" size="sm">+ Add New</Button>
                    </CardHeader>
                    <CardContent className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="p-4 border rounded-md">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold">Main Construction Site</span>
                                <Badge>Default</Badge>
                            </div>
                            <p className="text-sm text-muted">123 Construction Ave, Industrial Park<br />New York, NY 10001</p>
                        </div>
                        <div className="p-4 border rounded-md">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold">Warehouse B</span>
                            </div>
                            <p className="text-sm text-muted">450 Logistics Way<br />New Jersey, NJ 07001</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
