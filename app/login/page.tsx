import LoginButton from '@/components/features/auth/components/LoginButton';
import Image from 'next/image';
import styles from './login.module.css';

export default async function LoginPage() {
  // Bypass borttagen för att möjliggöra utloggning

  return (
    <div className={styles.container}>
      {/* Background image */}
      <div className={styles.backgroundWrapper}>
        <Image
          src="/img/login-bg.jpg"
          alt="Background"
          fill
          priority
          className={styles.backgroundImage}
        />
      </div>

      {/* Logo */}
      <div className={styles.logo}>
        <Image
          src="/img/easypaisa_white.svg"
          alt="EasyPaisa"
          width={120}
          height={44}
          priority
          quality={100}
          sizes="(max-width: 768px) 120px, 120px"
        />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className="max-w-md mx-auto relative z-[1]">
          {/* Text content */}
          <h1 className={styles.title}>
            SEND MONEY GLOBALLY<br />IN SECONDS
          </h1>
          
          <p className={styles.description}>
            Bridging hearts across borders.
            <br />
            Log in and connect, culturally and digitally
          </p>

          {/* Login button */}
          <div className={styles.loginButton}>
            <LoginButton />
          </div>
        </div>
      </div>
    </div>
  );
}