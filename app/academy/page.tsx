import { QuestsPageClient } from '../quests/QuestsPageClient';
import { TopBar } from '@/components/layout/TopBar';

export const metadata = {
  title: 'Academy Quests — Quest Vault',
};

export default function AcademyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1 px-4 md:px-6 py-8 max-w-[1400px] mx-auto w-full">
        <QuestsPageClient academyType="Academy Quest" />
      </main>
    </div>
  );
}
