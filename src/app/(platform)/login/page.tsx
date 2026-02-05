'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSignIn, useSignUp, useAuth, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import styles from './login.module.css';
import { toast } from 'sonner';

type Role = 'CUSTOMER' | 'SUPPLIER' | 'DELIVERY' | 'ADMIN';

export default function LoginPage() {
    const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
    const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
    const { isSignedIn } = useAuth();
    const router = useRouter();

    const [role, setRole] = useState<Role>('CUSTOMER');
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [code, setCode] = useState('');

    const { user } = useUser();

    // Redirect if already signed in
    useEffect(() => {
        if (isSignedIn && user) {
            const role = (user.publicMetadata.role as string) || 'CUSTOMER';
            const routes: Record<string, string> = {
                'CUSTOMER': '/customer',
                'SUPPLIER': '/supplier',
                'DELIVERY': '/delivery',
                'ADMIN': '/admin'
            };
            router.push(routes[role] || '/customer');
        }
    }, [isSignedIn, user, router]);

    if (isSignedIn) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-pulse text-primary font-medium">Redirecting...</div></div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignInLoaded || !isSignUpLoaded) return;
        setIsLoading(true);

        try {
            if (isLogin) {
                // Clerk Login
                const result = await signIn.create({ identifier: email, password });
                if (result.status === 'complete') {
                    await setActive({ session: result.createdSessionId });
                    router.push('/');
                } else {
                    console.log('Login incomplete', result);
                }
            } else {
                // Clerk Signup
                const result = await signUp.create({
                    emailAddress: email,
                    password,
                    firstName: name,
                    unsafeMetadata: { role }
                });

                // Prepare for verification
                await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
                setVerifying(true);
                toast.message('Verification code sent to your email');
            }
        } catch (err: any) {
            console.error(err);
            const errorCode = err.errors?.[0]?.code;
            if (errorCode === 'session_exists') {
                router.push('/');
                toast.success('You are already logged in');
                return;
            }
            toast.error(err.errors?.[0]?.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignUpLoaded) return;
        setIsLoading(true);

        try {
            const result = await signUp.attemptEmailAddressVerification({ code });
            if (result.status === 'complete') {
                await setSignUpActive({ session: result.createdSessionId });
                router.push('/');
            } else {
                toast.error('Verification failed');
            }
        } catch (err: any) {
            toast.error(err.errors?.[0]?.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleLabel = (r: Role) => {
        const labels = {
            'CUSTOMER': 'Customer',
            'SUPPLIER': 'Supplier',
            'DELIVERY': 'Delivery Partner',
            'ADMIN': 'Admin'
        };
        return labels[r];
    };

    if (verifying) {
        return (
            <div className={styles.container}>
                <Card className={styles.card}>
                    <CardHeader>
                        <CardTitle>Verify Email</CardTitle>
                        <CardDescription>Enter the code sent to {email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleVerify} className="space-y-4">
                            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="000000" required />
                            <Button type="submit" fullWidth disabled={isLoading}>{isLoading ? 'Verifying...' : 'Verify'}</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <CardHeader className="text-center">
                    <div className="mb-2 font-bold text-primary text-xl">BUILDFLOW</div>
                    <CardTitle>{isLogin ? 'Welcome back' : 'Create Account'}</CardTitle>
                    <CardDescription>
                        {isLogin ? 'Login to access your dashboard' : `Join as a ${getRoleLabel(role)}`}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {!isLogin && (
                        <div className={styles.roleSelector}>
                            {(['CUSTOMER', 'SUPPLIER', 'DELIVERY'] as Role[]).map((r) => (
                                <button
                                    key={r}
                                    className={`${styles.roleButton} ${role === r ? styles.activeRole : ''}`}
                                    onClick={() => setRole(r)}
                                    type="button"
                                >
                                    {getRoleLabel(r)}
                                </button>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {!isLogin && (
                                <Input
                                    id="name"
                                    label="Full Name"
                                    placeholder="Company Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            )}
                            <Input
                                id="email"
                                label="Email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Input
                                id="password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" fullWidth disabled={isLoading} className="mt-6">
                            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </Button>

                        <div className="text-center text-sm text-muted mt-4">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <span
                                className="text-primary cursor-pointer hover:underline font-medium"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </span>
                        </div>
                    </form>
                    <div id="clerk-captcha" />
                </CardContent>
            </Card>
        </div>
    );
}
