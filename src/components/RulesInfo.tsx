import React from 'react';
import { cleaningRules } from '../utils/cleaningRules';

export const RulesInfo: React.FC = () => {
  return (
    <div className="rules-info">
      <div className="rules-title">Active Cleaning Rules:</div>
      <div className="rules-list">
        {cleaningRules.map((rule, index) => (
          <div key={index} className="rule-item">
            <div className="rule-indicator" />
            <span>{rule.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};