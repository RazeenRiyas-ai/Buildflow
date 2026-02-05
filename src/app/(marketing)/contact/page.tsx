import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function ContactPage() {
    return (
        <div className="container py-20">
            <div className="max-w-xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 text-center">Get in Touch</h1>
                <p className="text-center text-muted-foreground mb-12">
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>

                <Card>
                    <CardContent className="p-8 space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Input label="Name" placeholder="Your name" />
                            <Input label="Email" placeholder="john@example.com" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Message</label>
                            <textarea
                                className="w-full min-h-[150px] p-3 rounded-md border text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="How can we help you?"
                                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                            ></textarea>
                        </div>

                        <Button fullWidth>SendMessage</Button>
                    </CardContent>
                </Card>

                <div className="mt-12 text-center text-sm text-muted">
                    <p>Or email us directly at <a href="mailto:hello@buildflow.com" className="text-primary hover:underline">hello@buildflow.com</a></p>
                </div>
            </div>
        </div>
    );
}
