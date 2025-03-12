import React from 'react';
import { Trees as Tree } from 'lucide-react';
import type { FinancialHealth } from '../types';

interface HealthTreeProps {
  health: FinancialHealth;
}

const healthColors = {
  healthy: 'text-emerald-500',
  balanced: 'text-yellow-500',
  struggling: 'text-orange-500',
  critical: 'text-red-500'
};

const healthSizes = {
  healthy: 'w-32 h-32',
  balanced: 'w-28 h-28',
  struggling: 'w-24 h-24',
  critical: 'w-20 h-20'
};

export function HealthTree({ health }: HealthTreeProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-white shadow-lg">
      <Tree 
        className={`${healthColors[health]} ${healthSizes[health]} transition-all duration-500`}
      />
      <p className={`mt-4 font-semibold capitalize ${healthColors[health]}`}>
        {health === 'healthy' && 'Financially Healthy'}
        {health === 'balanced' && 'Breaking Even'}
        {health === 'struggling' && 'Financial Warning'}
        {health === 'critical' && 'Financial Crisis'}
      </p>
    </div>
  );
}