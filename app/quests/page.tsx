import { QuestsPageClient } from './QuestsPageClient';
import { TopBar } from '@/components/layout/TopBar';
import { QuestDrawer } from '@/components/quest/QuestDrawer';

export const metadata = {
  title: 'Quests — Quest Vault',
};

export default function QuestsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1 px-4 md:px-6 py-6 max-w-[1400px] mx-auto w-full">
        <QuestsPageClient />
      </main>
      <QuestDrawer />
    </div>
  );
}
