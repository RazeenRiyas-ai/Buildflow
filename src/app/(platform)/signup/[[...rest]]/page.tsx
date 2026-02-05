'use client';

import { SignUp } from "@clerk/nextjs";
import styles from '../../login/login.module.css';

export default function SignUpPage() {
    return (
        <div className={styles.container}>
            <div className="flex flex-col items-center gap-6">
                <div className="text-3xl font-black text-primary tracking-tighter">BUILDFLOW</div>
                <SignUp
                    appearance={{
                        elements: {
                            formButtonPrimary: 'bg-primary hover:bg-primary/90 transition-all',
                            card: 'shadow-2xl border-none p-4 rounded-3xl',
                            headerTitle: 'text-2xl font-black tracking-tight',
                        }
                    }}
                />
            </div>
        </div>
    );
}
