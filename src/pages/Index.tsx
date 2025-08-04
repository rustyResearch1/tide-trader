import { DashboardHeader } from '@/components/DashboardHeader';
import { WalletLeaderboard } from '@/components/WalletLeaderboard';
import { SignalFeed } from '@/components/SignalFeed';
import { CommunityFeed } from '@/components/CommunityFeed';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <WalletLeaderboard />
        <SignalFeed />
        <CommunityFeed />
      </div>
    </div>
  );
};

export default Index;
