'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './sidebar.module.css';
import { UserButton, SignOutButton } from '@clerk/nextjs';

interface SidebarItem {
    label: string;
    href: string;
}

interface SidebarProps {
    items: SidebarItem[];
    role: string;
    username?: string;
}

export function Sidebar({ items, role, username = 'User' }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <Link href="/" className={styles.logo}>BUILDFLOW</Link>
            </div>

            <nav className={styles.nav}>
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className={styles.user}>
                <div className="flex items-center gap-3 w-full">
                    <UserButton
                        afterSignOutUrl="/login"
                        appearance={{
                            elements: {
                                avatarBox: "h-10 w-10 rounded-full border-2 border-primary/20"
                            }
                        }}
                    />
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{username}</span>
                        <div className="flex items-center gap-2">
                            <span className={styles.userRole}>{role}</span>
                        </div>
                    </div>
                </div>
                <div className="mt-2 w-full">
                    <SignOutButton>
                        <button className="text-xs text-red-500 hover:text-red-600 hover:underline font-medium w-full text-left">
                            Sign Out
                        </button>
                    </SignOutButton>
                </div>
            </div>
        </aside>
    );
}
