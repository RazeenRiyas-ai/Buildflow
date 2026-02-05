import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h1 className="text-2xl font-bold">Platform Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>General Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Input label="Platform Name" defaultValue="Buildflow Construction Market" />
                    <Input label="Support Email" defaultValue="help@buildflow.com" />
                    <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input label="Commission Rate (%)" defaultValue="5.0" />
                        <Input label="Tax Rate (%)" defaultValue="18.0" />
                    </div>
                    <Button className="w-auto self-start">Save Changes</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Security & Access</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between py-2 border-b">
                        <span>Enable Two-Factor Auth (2FA) for Admins</span>
                        <Button size="sm" variant="outline">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between py-2 pt-4">
                        <span>Force Password Reset for All Users</span>
                        <Button size="sm" variant="destructive">Execute</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
