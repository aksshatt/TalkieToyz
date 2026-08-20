import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Bell, MessageSquare, Mail, Phone, Tag, Award } from 'lucide-react';
import axiosInstance from '../config/axios';
import toast from 'react-hot-toast';

interface Prefs {
  order_updates: boolean;
  whatsapp: boolean;
  email: boolean;
  sms: boolean;
  promotions: boolean;
  loyalty_points: boolean;
}

const fetchPrefs = async (): Promise<{ data: Prefs }> => {
  const res = await axiosInstance.get('/notification_preferences');
  return res.data;
};

const items = [
  { key: 'order_updates', label: 'Order Updates', desc: 'Shipment tracking, delivery, and order status changes', Icon: Bell },
  { key: 'whatsapp', label: 'WhatsApp Notifications', desc: 'Receive updates via WhatsApp', Icon: MessageSquare },
  { key: 'email', label: 'Email Notifications', desc: 'Order confirmations and updates via email', Icon: Mail },
  { key: 'sms', label: 'SMS Notifications', desc: 'Text alerts for your orders', Icon: Phone },
  { key: 'promotions', label: 'Promotions & Offers', desc: 'Sale alerts, discount codes, and new arrivals', Icon: Tag },
  { key: 'loyalty_points', label: 'Loyalty Points', desc: 'Points earned, redeemed, and expiry alerts', Icon: Award },
] as const;

export default function NotificationPreferences() {
  const [prefs, setPrefs] = useState<Prefs | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['notification_preferences'],
    queryFn: fetchPrefs,
  });

  useEffect(() => {
    if (data?.data && !prefs) setPrefs(data.data);
  }, [data]);

  const save = useMutation({
    mutationFn: (p: Prefs) => axiosInstance.patch('/notification_preferences', p),
    onSuccess: () => toast.success('Preferences saved'),
    onError: () => toast.error('Failed to save preferences'),
  });

  const toggle = (key: keyof Prefs) => {
    if (!prefs) return;
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    save.mutate(next);
  };

  if (isLoading || !prefs) return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-3">
      {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-16 bg-white dark:bg-surface-dark-raised rounded-2xl animate-pulse border border-warmgray-100 dark:border-surface-dark-border" />)}
    </div>
  );

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-warmgray-900 dark:text-warmgray-100">Notification Preferences</h1>
        <p className="text-sm text-warmgray-500 mt-1">Choose how and what you want to hear from us</p>
      </div>

      <div className="bg-white dark:bg-surface-dark-raised rounded-2xl border border-warmgray-100 dark:border-surface-dark-border shadow-soft divide-y divide-warmgray-50">
        {items.map(({ key, label, desc, Icon }) => (
          <div key={key} className="flex items-center gap-4 p-4">
            <div className="w-9 h-9 rounded-xl bg-warmgray-50 dark:bg-surface-dark flex items-center justify-center flex-shrink-0">
              <Icon className="h-4.5 w-4.5 text-warmgray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-warmgray-900 dark:text-warmgray-100 text-sm">{label}</p>
              <p className="text-xs text-warmgray-400 mt-0.5">{desc}</p>
            </div>
            <button
              onClick={() => toggle(key as keyof Prefs)}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${prefs[key as keyof Prefs] ? 'bg-teal' : 'bg-warmgray-200'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-surface-dark-raised rounded-full shadow transition-transform ${prefs[key as keyof Prefs] ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-center text-warmgray-400">Transactional notifications (like OTP) are always sent regardless of these settings.</p>
    </div>
  );
}
