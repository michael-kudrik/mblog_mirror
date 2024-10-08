import Posts from "./components/Posts";

export const revalidate = 86400; // Revalidate 86400 seconds (24 hours)

export default function Home() {
  return (
    <main className="px-6 mx-auto">
      <p className="mt-12 mb-12 text-3xl text-center dark:text-white">
        Hello, I&apos;m <span className="font-bold">Mike</span> 🤙
      </p>
      <Posts />
    </main>
  );
}
