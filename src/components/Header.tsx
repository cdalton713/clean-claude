import React from 'react';
import { Sparkles, FileText } from 'lucide-react';
import type { TextStats } from '../types';

interface HeaderProps {
  stats: TextStats;
}

export const Header: React.FC<HeaderProps> = ({ stats }) => {
  return (
    <header className="header">
      <div className="logo">
        <Sparkles className="logo-icon" size={24} />
        <h1>Clean Claude</h1>
      </div>
      <div className="stats">
        <div className="stat">
          <FileText size={14} />
          <span>Lines: <span className="stat-value">{stats.lines}</span></span>
        </div>
        <div className="stat">
          <span>Characters: <span className="stat-value">{stats.characters}</span></span>
        </div>
        <div className="stat">
          <span>Cleaned: <span className="stat-value">{stats.cleaned}</span></span>
        </div>
      </div>
    </header>
  );
};