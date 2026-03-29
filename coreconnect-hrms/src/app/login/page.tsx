import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import styles from './page.module.css';
import { login, signup } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const isError = resolvedParams?.error;
  const isSignUp = resolvedParams?.mode === 'signup';
  const errorMessage = typeof isError === 'string' && isError !== 'true' 
    ? isError 
    : (isSignUp ? 'Registration failed. Try a different email.' : 'Invalid login credentials');

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.brandInfo}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}></div>
            <h2>CoreConnect HRMS</h2>
          </div>
          <h1 className={styles.heroText}>Streamline your HR Operations</h1>
          <p className={styles.subHeroText}>
            Connect, manage, and empower your workforce with our centralized human resources platform.
          </p>
        </div>
      </div>
      
      <div className={styles.rightPanel}>
        <Card className={styles.loginCard}>
          <CardContent className={styles.cardContent}>
            <div className={styles.formHeader}>
              <h2 className={styles.title}>{isSignUp ? 'Create an account' : 'Welcome back'}</h2>
              <p className={styles.subtitle}>
                {isSignUp ? 'Enter your details to create a new account' : 'Enter your credentials to access your account'}
              </p>
              {isError && (
                <p style={{ color: 'var(--error)', marginTop: '0.5rem', fontSize: '0.875rem', maxWidth: '300px', margin: '0.5rem auto 0' }}>
                  {errorMessage}
                </p>
              )}
            </div>
            
            <form action={isSignUp ? signup : login} className={styles.form}>
              {isSignUp && (
                <>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Input 
                      id="first_name" 
                      name="first_name"
                      type="text" 
                      label="First Name" 
                      placeholder="John" 
                      required={isSignUp}
                      fullWidth 
                    />
                    <Input 
                      id="last_name" 
                      name="last_name"
                      type="text" 
                      label="Last Name" 
                      placeholder="Doe" 
                      required={isSignUp}
                      fullWidth 
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', width: '100%' }}>
                    <label htmlFor="role" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary, #6b7280)' }}>Account Role</label>
                    <select 
                      id="role" 
                      name="role" 
                      style={{ 
                        width: '100%', 
                        padding: '0.625rem 0.75rem', 
                        borderRadius: '0.375rem', 
                        border: '1px solid var(--border, #d1d5db)', 
                        backgroundColor: 'var(--bg-primary, transparent)', 
                        color: 'var(--text-primary, inherit)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Admin">Admin</option>
                      <option value="HR">HR</option>
                      <option value="Employee">Employee / Worker</option>
                    </select>
                  </div>
                </>
              )}
              <Input 
                id="email" 
                name="email"
                type="email" 
                label="Email address" 
                placeholder="name@company.com" 
                required
                fullWidth 
              />
              <Input 
                id="password" 
                name="password"
                type="password" 
                label="Password" 
                placeholder="••••••••" 
                required
                fullWidth 
              />
              
              <div className={styles.formOptions}>
                <label className={styles.checkboxContainer}>
                  <input type="checkbox" className={styles.checkbox} />
                  <span>Remember me</span>
                </label>
                <Link href="#" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth className={styles.submitBtn}>
                {isSignUp ? 'Sign up' : 'Sign in'}
              </Button>
            </form>

            <div className={styles.footer}>
              {isSignUp ? (
                <p>Already have an account? <Link href="/login" className={styles.contactLink}>Sign in</Link></p>
              ) : (
                <p>Don't have an account? <Link href="/login?mode=signup" className={styles.contactLink}>Sign up</Link></p>
              )}
              <p style={{ marginTop: '0.5rem' }}>Need help? <Link href="#" className={styles.contactLink}>Contact IT Support</Link></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
