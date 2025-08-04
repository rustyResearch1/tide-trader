import { useState } from 'react';
import { Users, Settings, Heart, MessageCircle, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CommunityFeedItem } from '@/types/trading';

const mockFeedItems: CommunityFeedItem[] = [
  {
    id: '1',
    type: 'tag',
    username: 'CryptoSage',
    content: 'User CryptoSage tagged 0x7e3f...8a21 as Lowcap Degen',
    timestamp: Date.now() - 180000, // 3 minutes ago
    walletAddress: '0x7e3f...8a21',
    likes: 12
  },
  {
    id: '2',
    type: 'trade',
    username: 'TradeExpert',
    content: 'Added 0x3c9e...2f14 to watchlist. This wallet has been making consistent gains on new Solana tokens.',
    timestamp: Date.now() - 720000, // 12 minutes ago
    walletAddress: '0x3c9e...2f14',
    likes: 28
  },
  {
    id: '3',
    type: 'tag',
    username: 'SolanaWhale',
    content: 'Tagged WhalHuntr4 as Early Entrant. Always gets in before the pump.',
    timestamp: Date.now() - 2580000, // 43 minutes ago
    walletAddress: 'WhalHuntr4',
    likes: 45
  }
];

export function CommunityFeed() {
  const [feedItems] = useState<CommunityFeedItem[]>(mockFeedItems);
  const [newComment, setNewComment] = useState('');

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tag': return 'bg-primary/20 text-primary border-primary/30';
      case 'trade': return 'bg-success/20 text-success border-success/30';
      case 'alert': return 'bg-warning/20 text-warning border-warning/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <div className="w-80 bg-card border-l border-border p-4 h-screen overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Community Feed
        </h2>
      </div>

      {/* Feed Items */}
      <div className="space-y-4 mb-6">
        {feedItems.map((item) => (
          <div
            key={item.id}
            className="bg-gradient-card p-3 rounded-lg border border-border/50 hover:border-primary/20 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary text-xs font-semibold">
                    {item.username.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {item.username}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={`ml-2 text-xs ${getTypeColor(item.type)}`}
                  >
                    {item.type.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(item.timestamp)}
              </span>
            </div>
            
            <p className="text-sm text-foreground mb-3 leading-relaxed">
              {item.content}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 text-muted-foreground hover:text-danger transition-colors">
                  <Heart className="h-3 w-3" />
                  <span className="text-xs">{item.likes}</span>
                </button>
                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="h-3 w-3" />
                  <span className="text-xs">Reply</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment */}
      <div className="border-t border-border pt-4 mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Add wallet tag or comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="text-sm bg-muted border-muted"
          />
          <Button size="sm" className="px-3">
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Alert Settings */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-foreground">Alert Settings</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Signal Thresholds
            </label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">Minimum buy size</span>
                <div className="flex items-center gap-1">
                  <Input 
                    type="number" 
                    defaultValue={1} 
                    className="w-16 h-6 text-xs bg-muted border-muted"
                  />
                  <span className="text-xs text-muted-foreground">SOL</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">Minimum win rate</span>
                <div className="flex items-center gap-1">
                  <Input 
                    type="number" 
                    defaultValue={70} 
                    className="w-16 h-6 text-xs bg-muted border-muted"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">Token pump threshold</span>
                <div className="flex items-center gap-1">
                  <Input 
                    type="number" 
                    defaultValue={30} 
                    className="w-16 h-6 text-xs bg-muted border-muted"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}