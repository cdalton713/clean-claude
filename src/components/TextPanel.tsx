import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface TextPanelProps {
  title: string;
  icon: LucideIcon;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  actions?: React.ReactNode;
}

export const TextPanel: React.FC<TextPanelProps> = ({
  title,
  icon: Icon,
  value,
  onChange,
  readOnly = false,
  placeholder = '',
  actions
}) => {
  return (
    <div className="text-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Icon size={14} />
          {title}
        </div>
        {actions && <div className="panel-actions">{actions}</div>}
      </div>
      <div className="textarea-wrapper">
        <textarea
          className={readOnly ? 'text-output' : 'text-input'}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          readOnly={readOnly}
          placeholder={placeholder}
          spellCheck={false}
        />
      </div>
    </div>
  );
};