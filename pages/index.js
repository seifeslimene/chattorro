import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import chattorro from '../assets/chattorro.svg';
import ActiveLink from '../components/ActiveLink';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const [getStarted, setGetStarted] = useState(false);
  const [user, setUser] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const authentication = (e) => {
    e.preventDefault();
    setGetStarted(true);
  };

  useEffect(() => {
    if (router.query.from) {
      setGetStarted(true);
    }
  }, [router.query]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/me', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setUser(d.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setSessionChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
      setUser(null);
      setGetStarted(false);
    } finally {
      setLoggingOut(false);
    }
  }

  const showLanding =
    sessionChecked && !user && !getStarted;

  return (
    <div className='py-0 px-8'>
      <Head>
        <title>Chattorro App</title>
        <meta name='description' content='Video Chat App' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='min-h-screen py-16 px-0 flex flex-col justify-center items-center basis-0 grow shrink'>
        <Image src={chattorro} alt={chattorro} width={200} height={200} />
        <h1 className='font-caveat text-5xl bold'>Chattorro App.</h1>
        <br />

        {!sessionChecked ? (
          <p className='text-sm text-gray-500'>Loading…</p>
        ) : user ? (
          <div className='flex flex-col items-center gap-4 text-center max-w-md'>
            <p className='text-lg text-stone-800'>
              You&apos;re signed in as{' '}
              <span className='font-semibold'>
                {user.firstname} {user.lastname}
              </span>
              {user.email ? (
                <span className='block text-sm text-gray-600 mt-1'>
                  {user.email}
                </span>
              ) : null}
            </p>
            <button
              type='button'
              disabled={loggingOut}
              onClick={handleLogout}
              className='rounded-md bg-stone-800 text-yellow-500 hover:bg-stone-700 px-6 py-2 text-sm font-medium disabled:opacity-50'
            >
              {loggingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        ) : showLanding ? (
          <div className='rounded-md shadow' onClick={authentication}>
            <a
              href=''
              className='flex w-full items-center font-bold tracking-wide bg-stone-900 text-yellow-500 hover:bg-stone-800 justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium md:py-4 md:px-10 md:text-lg'
            >
              Get Started
            </a>
          </div>
        ) : (
          <>
            <div className='flex gap-x-5'>
              <div className='rounded-md shadow'>
                <ActiveLink href='login'>Login</ActiveLink>
              </div>

              <div className='rounded-md shadow'>
                <ActiveLink href='register'>Register</ActiveLink>
              </div>
            </div>
          </>
        )}
      </main>

      <footer></footer>
    </div>
  );
}
