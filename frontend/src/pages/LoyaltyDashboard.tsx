import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Gift, TrendingUp, ShoppingBag, MessageSquare, ClipboardList, ChevronRight } from 'lucide-react';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import { loyaltyService, LoyaltyTransaction } from '../services/loyaltyService';

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  purchase: <ShoppingBag className="w-3.5 h-3.5" />,
  review: <MessageSquare className="w-3.5 h-3.5" />,
  assessment: <ClipboardList className="w-3.5 h-3.5" />,
  redemption: <Gift className="w-3.5 h-3.5" />,
  referral: <TrendingUp className="w-3.5 h-3.5" />,
  bonus: <Star className="w-3.5 h-3.5" />,
};

const SOURCE_COLORS: Record<string, string> = {
  purchase: 'bg-blue-100 text-blue-700',
  review: 'bg-purple-100 text-purple-700',
  assessment: 'bg-teal-100 text-teal-700',
  redemption: 'bg-red-100 text-red-700',
  referral: 'bg-green-100 text-green-700',
  bonus: 'bg-amber-100 text-amber-700',
};

const EARN_GUIDE = [
  { icon: <ShoppingBag className="w-5 h-5 text-blue-600" />, label: 'Make a purchase', points: '1 pt per ₹1 spent' },
  { icon: <MessageSquare className="w-5 h-5 text-purple-600" />, label: 'Write a review', points: '50 pts' },
  { icon: <ClipboardList className="w-5 h-5 text-teal-600" />, label: 'Complete assessment', points: '30 pts' },
  { icon: <Star className="w-5 h-5 text-amber-600" />, label: 'Mark milestone', points: '20 pts' },
];

const LoyaltyDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [redeemAmount, setRedeemAmount] = useState(100);

  const { data, isLoading } = useQuery({
    queryKey: ['loyalty_points'],
    queryFn: () => loyaltyService.getPoints(),
  });

  const redeemMutation = useMutation({
    mutationFn: () => loyaltyService.redeemPoints(redeemAmount),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['loyalty_points'] });
      alert(`Redeemed! ₹${res.data.discount_rupees} discount applied.`);
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Redemption failed');
    },
  });

  const balance: number = data?.data?.balance || 0;
  const rupeeValue: number = data?.data?.rupee_value || 0;
  const transactions: LoyaltyTransaction[] = data?.data?.transactions || [];

  return (
    <Layout>
      <SEO url="/loyalty" />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Loyalty Points</h1>
          <p className="text-gray-500 text-sm mb-8">Earn points on every purchase, review, and milestone.</p>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white mb-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span className="text-sm font-medium opacity-80">Your Balance</span>
            </div>
            <p className="text-5xl font-bold mb-1">{balance.toLocaleString()}</p>
            <p className="text-sm opacity-75">≈ ₹{rupeeValue.toFixed(2)} redeemable discount</p>

            {balance >= 100 && (
              <div className="mt-5 bg-white/10 rounded-xl p-4">
                <p className="text-sm font-medium mb-3">Redeem Points</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={100}
                    max={Math.min(balance, 5000)}
                    step={100}
                    value={redeemAmount}
                    onChange={e => setRedeemAmount(parseInt(e.target.value))}
                    className="flex-1 accent-amber-400"
                  />
                  <span className="text-sm font-bold w-24 text-right">{redeemAmount} pts = ₹{(redeemAmount / 10).toFixed(0)}</span>
                </div>
                <button
                  onClick={() => redeemMutation.mutate()}
                  disabled={redeemMutation.isPending}
                  className="mt-3 w-full bg-amber-400 text-amber-900 font-semibold py-2 rounded-xl hover:bg-amber-300 disabled:opacity-50 transition"
                >
                  {redeemMutation.isPending ? 'Redeeming…' : `Redeem ${redeemAmount} pts for ₹${(redeemAmount / 10).toFixed(0)} off`}
                </button>
              </div>
            )}
          </div>

          {/* How to Earn */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
            <h2 className="font-bold text-gray-900 mb-4">How to Earn Points</h2>
            <div className="grid grid-cols-2 gap-3">
              {EARN_GUIDE.map(item => (
                <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800">{item.label}</p>
                    <p className="text-xs text-indigo-600 font-semibold">{item.points}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Transaction History</h2>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-12" />)}
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <Gift className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No transactions yet. Start earning!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${SOURCE_COLORS[tx.source] || 'bg-gray-100 text-gray-600'}`}>
                      {SOURCE_ICONS[tx.source]} {tx.source}
                    </span>
                    <p className="flex-1 text-sm text-gray-700 line-clamp-1">{tx.description}</p>
                    <span className={`text-sm font-bold ${tx.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {tx.points > 0 ? '+' : ''}{tx.points}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoyaltyDashboard;
