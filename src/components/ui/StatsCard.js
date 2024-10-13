import React from 'react';
import { Card } from './Card';

export const StatsCard = ({ title, value, subtitle, color }) => {
  const bgColor = `bg-${color}-50`;
  const textColor = `text-${color}-500`;

  return (
    <Card className={bgColor}>
      <div className="p-6">
        <h3 className={`text-3xl font-bold ${textColor} mb-1`}>{value}</h3>
        <p className="text-gray-600 mb-2">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </Card>
  );
};