import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';

const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export function useGrimorioInsights(userId) {
  return useQuery({
    queryKey: ['grimorioInsights', userId],
    queryFn: async () => {
      if (!userId) return null;
      const since = getDateDaysAgo(30);
      const { data, error } = await supabase
        .from('readings')
        .select('id, created_at, cards_data')
        .eq('user_id', userId)
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
}

export function useDerivedGrimorioInsights(readings = []) {
  return useMemo(() => {
    if (!readings.length) return null;

    const frequencyPerWeek = Math.round((readings.length / 4) * 10) / 10;
    const cardCounts = readings.reduce((acc, reading) => {
      if (!Array.isArray(reading.cards_data)) return acc;
      reading.cards_data.forEach((card) => {
        if (!card?.nome) return;
        acc[card.nome] = (acc[card.nome] || 0) + 1;
      });
      return acc;
    }, {});

    const topCard = Object.entries(cardCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([name]) => name)[0];

    return {
      frequencyPerWeek,
      topCard,
      hasCards: Boolean(topCard),
    };
  }, [readings]);
}
