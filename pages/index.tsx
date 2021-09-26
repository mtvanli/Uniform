import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Landing</title>
      </Head>
      <ul>
        <li>
          <Link href="/landing">
            <a>Landing Page</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
