import { Hero, About, Features, Services } from '@/components/landing_page';

export default async function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Features />
      <Services />
    </main>
  );
}
