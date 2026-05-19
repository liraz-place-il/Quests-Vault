import { TopBar } from '@/components/layout/TopBar';
import { AdminPageClient } from './AdminPageClient';

export const metadata = {
  title: 'Admin — Quest Vault',
};

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1 px-4 md:px-6 py-6 max-w-[1200px] mx-auto w-full">
        <AdminPageClient />
      </main>
    </div>
  );
}
