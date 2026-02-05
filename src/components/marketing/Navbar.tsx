import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './navbar.module.css';

export function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.inner}`}>
                <Link href="/" className={styles.logo}>
                    <span>BUILDFLOW</span>
                </Link>

                <div className={styles.links}>
                    <Link href="/" className={styles.link}>Home</Link>
                    <Link href="/how-it-works" className={styles.link}>How It Works</Link>
                    <Link href="/about" className={styles.link}>About</Link>
                    <Link href="/contact" className={styles.link}>Contact</Link>
                </div>

                <div className={styles.actions}>
                    <Link href="/login">
                        <Button variant="ghost">Log in</Button>
                    </Link>
                    <Link href="/login">
                        <Button>Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
