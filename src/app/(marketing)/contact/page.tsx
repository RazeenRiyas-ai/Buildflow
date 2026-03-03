import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="container py-20">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6" style={{ letterSpacing: '-0.02em', color: 'var(--foreground)' }}>Get in Touch</h1>
                    <p className="text-xl" style={{ color: 'var(--muted-foreground)' }}>
                        Have questions about Buildflow? Our team is here to help you optimize your supply chain.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 2fr)', gap: '4rem' }}>

                    {/* Contact Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                            <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
                                Fill out the form and our sales or support team will get back to you within 24 hours.
                            </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', backgroundColor: 'var(--muted)', borderRadius: '50%', color: 'var(--primary)' }}>
                                <Phone size={24} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', color: 'var(--foreground)' }}>Call Us</div>
                                <div style={{ color: 'var(--muted-foreground)' }}>+1 (555) 123-4567</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', backgroundColor: 'var(--muted)', borderRadius: '50%', color: 'var(--primary)' }}>
                                <Mail size={24} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', color: 'var(--foreground)' }}>Email Us</div>
                                <div style={{ color: 'var(--muted-foreground)' }}>hello@buildflow.com</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', backgroundColor: 'var(--muted)', borderRadius: '50%', color: 'var(--primary)' }}>
                                <MapPin size={24} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', color: 'var(--foreground)' }}>Headquarters</div>
                                <div style={{ color: 'var(--muted-foreground)', lineHeight: '1.5' }}>
                                    123 Construction Blvd<br />
                                    Suite 400<br />
                                    San Francisco, CA 94103
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <Card style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
                        <CardContent className="p-8" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <Input label="First Name" placeholder="John" />
                                <Input label="Last Name" placeholder="Doe" />
                            </div>

                            <Input label="Email Address" placeholder="john@company.com" />

                            <Input label="Company Name" placeholder="BuildCo Inc." />

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Message</label>
                                <textarea
                                    className="w-full min-h-[150px] p-4 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="How can we help you?"
                                    style={{
                                        borderColor: 'var(--border)',
                                        backgroundColor: 'var(--background)',
                                        color: 'var(--foreground)',
                                        fontFamily: 'inherit',
                                        transition: 'border-color 0.2s ease'
                                    }}
                                ></textarea>
                            </div>

                            <Button size="lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                                Send Message <Send size={18} />
                            </Button>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
