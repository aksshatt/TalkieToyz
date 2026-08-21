import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Copy, Check, Gift, Users } from 'lucide-react';
import axiosInstance from '../config/axios';
import toast from 'react-hot-toast';

const fetchReferrals = async () => {
  const res = await axiosInstance.get('/referrals');
  return res.data.data;
};

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['referrals'],
    queryFn: fetchReferrals,
  });

  const applyCode = useMutation({
    mutationFn: (referral_code: string) => axiosInstance.post('/referrals/apply', { referral_code }),
    onSuccess: () => {
      toast.success('Referral applied! Your referrer earned 100 points.');
      setCode('');
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Invalid or already used referral code');
    },
  });

  const copy = () => {
    if (!data?.referral_code) return;
    navigator.clipboard.writeText(data.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    if (!data?.referral_url) return;
    navigator.clipboard.writeText(data.referral_url);
    toast.success('Referral link copied!');
  };

  if (isLoading) return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-4">
      {[1, 2].map(i => <div key={i} className="h-32 bg-white dark:bg-surface-dark-raised rounded-2xl animate-pulse border border-warmgray-100 dark:border-surface-dark-border" />)}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-warmgray-900 dark:text-warmgray-100">Refer & Earn</h1>
        <p className="text-sm text-warmgray-500 mt-1">Share TalkieToys with friends. Your friend gets 100 welcome points, you earn 100 referral points.</p>
      </div>

      {/* Your referral code */}
      <div className="bg-gradient-to-br from-teal/10 to-sky/10 rounded-2xl border border-teal/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="h-5 w-5 text-teal" />
          <h2 className="font-bold text-warmgray-900 dark:text-warmgray-100">Your Referral Code</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white dark:bg-surface-dark-raised rounded-xl px-4 py-3 font-mono font-bold text-xl text-teal tracking-widest border border-teal/20">
            {data?.referral_code || '—'}
          </div>
          <button onClick={copy} aria-label={copied ? 'Copied' : 'Copy referral code'} className="p-3 bg-teal text-white rounded-xl hover:bg-teal-dark">
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>
        <button onClick={copyLink} className="mt-3 text-sm text-teal font-medium hover:underline">
          Copy referral link instead
        </button>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-surface-dark-raised rounded-xl p-4 text-center border border-warmgray-100 dark:border-surface-dark-border">
            <p className="text-2xl font-bold text-warmgray-900 dark:text-warmgray-100">{data?.total_referrals ?? 0}</p>
            <p className="text-xs text-warmgray-500 mt-1">Friends Referred</p>
          </div>
          <div className="bg-white dark:bg-surface-dark-raised rounded-xl p-4 text-center border border-warmgray-100 dark:border-surface-dark-border">
            <p className="text-2xl font-bold text-warmgray-900 dark:text-warmgray-100">{data?.points_earned ?? 0}</p>
            <p className="text-xs text-warmgray-500 mt-1">Points Earned</p>
          </div>
        </div>
      </div>

      {/* Apply a code */}
      <div className="bg-white dark:bg-surface-dark-raised rounded-2xl border border-warmgray-100 dark:border-surface-dark-border shadow-soft p-5">
        <h2 className="font-bold text-warmgray-900 dark:text-warmgray-100 mb-3">Apply a Referral Code</h2>
        <p className="text-sm text-warmgray-500 mb-4">Have a friend's code? Enter it to earn welcome points.</p>
        <form onSubmit={e => { e.preventDefault(); applyCode.mutate(code); }} className="flex gap-3">
          <input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="Enter code e.g. TT4X9Z2Y"
            maxLength={10}
            className="flex-1 px-3 py-2 border border-warmgray-200 dark:border-surface-dark-border rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal"
          />
          <button type="submit" disabled={!code || applyCode.isPending}
            className="px-4 py-2 bg-teal text-white rounded-xl text-sm font-medium hover:bg-teal-dark disabled:opacity-50">
            {applyCode.isPending ? 'Applying…' : 'Apply'}
          </button>
        </form>
      </div>

      {/* Referrals list */}
      {data?.referrals?.length > 0 && (
        <div className="bg-white dark:bg-surface-dark-raised rounded-2xl border border-warmgray-100 dark:border-surface-dark-border shadow-soft p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-warmgray-400" />
            <h2 className="font-bold text-warmgray-900 dark:text-warmgray-100">Friends You've Referred</h2>
          </div>
          <div className="space-y-2">
            {data.referrals.map((r: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-warmgray-50 last:border-0">
                <span className="text-sm text-warmgray-700 dark:text-warmgray-300">{r.name || r.email}</span>
                <span className="text-xs text-warmgray-400">{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
