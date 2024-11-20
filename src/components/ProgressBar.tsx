import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  total: number;
  label?: string;
}

export function ProgressBar({ progress, total, label }: ProgressBarProps) {
  const percentage = Math.round((progress / total) * 100);

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{label}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
        />
      </div>
    </div>
  );
}