import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, Gift, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { loyaltyService } from '../../services/loyaltyService';
import { useAuth } from '../../contexts/AuthContext';

const LoyaltyPointsWidget: React.FC = () => {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ['loyalty_points'],
    queryFn: () => loyaltyService.getPoints(),
    enabled: !!user,
  });

  if (!user || !data?.data) return null;

  const { balance, rupee_value } = data.data;

  return (
    <Link
      to="/loyalty"
      className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl px-4 py-2.5 hover:shadow-sm transition group"
    >
      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
        <Star className="w-4 h-4 text-amber-600 fill-amber-400" />
      </div>
      <div>
        <p className="text-xs font-semibold text-amber-800">{balance.toLocaleString()} pts</p>
        <p className="text-xs text-amber-600">≈ ₹{rupee_value} to redeem</p>
      </div>
      <TrendingUp className="w-3.5 h-3.5 text-amber-500 ml-auto group-hover:scale-110 transition" />
    </Link>
  );
};

export default LoyaltyPointsWidget;
