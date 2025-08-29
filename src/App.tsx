import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Trash2, FileText, Sparkles } from 'lucide-react';

// Type definitions
interface CleaningRule {
  name: string;
  description: string;
  apply: (text: string) => string;
}

interface TextStats {
  lines: number;
  characters: number;
  cleaned: number;
}

// Cleaning rules - easily extensible
const cleaningRules: CleaningRule[] = [
  {
    name: 'Remove pipe symbols',
    description: 'Removes | symbols from line starts and ends',
    apply: (text: string) => {
      return text
        .split('\n')
        .map(line => line.replace(/^\s*\|\s*/, '').replace(/\s*\|\s*$/, ''))
        .join('\n');
    }
  },
  {
    name: 'Fix indentation',
    description: 'Normalizes indentation and removes excessive spaces',
    apply: (text: string) => {
      return text
        .split('\n')
        .map(line => line.replace(/\s+/g, ' ').trim())
        .join('\n');
    }
  },
  {
    name: 'Remove terminal artifacts',
    description: 'Cleans common terminal formatting',
    apply: (text: string) => {
      // Remove ANSI escape codes
      text = text.replace(/\x1b\[[0-9;]*m/g, '');
      // Remove terminal prompts like $ or >
      text = text.replace(/^[\$>]\s*/gm, '');
      // Remove common terminal prefixes
      text = text.replace(/^(bash|sh|cmd|powershell):\s*/gim, '');
      return text;
    }
  },
  {
    name: 'Clean extra blank lines',
    description: 'Reduces multiple blank lines to single blank lines',
    apply: (text: string) => {
      return text.replace(/\n\s*\n\s*\n/g, '\n\n');
    }
  },
  {
    name: 'Trim whitespace',
    description: 'Removes leading/trailing whitespace',
    apply: (text: string) => {
      return text.trim();
    }
  }
];

// Custom hook for text cleaning
const useTextCleaner = (input: string): string => {
  return useMemo(() => {
    if (!input) return '';

    let cleaned = input;
    for (const rule of cleaningRules) {
      cleaned = rule.apply(cleaned);
    }
    return cleaned;
  }, [input]);
};

// Custom hook for text statistics
const useTextStats = (original: string, cleaned: string): TextStats => {
  return useMemo(() => ({
    lines: original.split('\n').length,
    characters: original.length,
    cleaned: original.length - cleaned.length
  }), [original, cleaned]);
};

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const cleanedText = useTextCleaner(inputText);
  const stats = useTextStats(inputText, cleanedText);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cleanedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, [cleanedText]);

  const handleClear = useCallback(() => {
    setInputText('');
  }, []);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  }, []);

  return (
    <div className="app">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          color: #e0e0e0;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .header {
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 107, 53, 0.2);
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          color: #ff6b35;
          filter: drop-shadow(0 0 10px rgba(255, 107, 53, 0.5));
        }

        .logo h1 {
          font-size: 1.5rem;
          font-weight: 600;
          background: linear-gradient(135deg, #ff6b35, #ff9558);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stats {
          display: flex;
          gap: 2rem;
          font-size: 0.875rem;
          color: #888;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-value {
          color: #ff6b35;
          font-weight: 600;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 2rem;
          gap: 1.5rem;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }

        .text-container {
          flex: 1;
          display: flex;
          gap: 1.5rem;
          min-height: 500px;
        }

        .text-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: rgba(26, 26, 26, 0.6);
          border: 1px solid rgba(255, 107, 53, 0.1);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .panel-header {
          background: rgba(255, 107, 53, 0.05);
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255, 107, 53, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .panel-title {
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #999;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .panel-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-button {
          background: rgba(255, 107, 53, 0.1);
          border: 1px solid rgba(255, 107, 53, 0.2);
          color: #ff6b35;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }

        .action-button:hover {
          background: rgba(255, 107, 53, 0.2);
          border-color: rgba(255, 107, 53, 0.4);
          transform: translateY(-1px);
          box-shadow: 0 2px 10px rgba(255, 107, 53, 0.2);
        }

        .action-button:active {
          transform: translateY(0);
        }

        .action-button.success {
          background: rgba(52, 211, 153, 0.1);
          border-color: rgba(52, 211, 153, 0.3);
          color: #34d399;
        }

        .textarea-wrapper {
          flex: 1;
          position: relative;
        }

        .text-input, .text-output {
          width: 100%;
          height: 100%;
          background: transparent;
          border: none;
          color: #e0e0e0;
          font-family: inherit;
          font-size: 0.875rem;
          line-height: 1.6;
          padding: 1.25rem;
          resize: none;
          outline: none;
        }

        .text-input::placeholder {
          color: #555;
        }

        .text-output {
          background: rgba(0, 0, 0, 0.2);
        }

        .text-input:focus {
          background: rgba(255, 107, 53, 0.02);
        }

        /* Scrollbar styling */
        .text-input::-webkit-scrollbar,
        .text-output::-webkit-scrollbar {
          width: 8px;
        }

        .text-input::-webkit-scrollbar-track,
        .text-output::-webkit-scrollbar-track {
          background: rgba(255, 107, 53, 0.05);
        }

        .text-input::-webkit-scrollbar-thumb,
        .text-output::-webkit-scrollbar-thumb {
          background: rgba(255, 107, 53, 0.2);
          border-radius: 4px;
        }

        .text-input::-webkit-scrollbar-thumb:hover,
        .text-output::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 107, 53, 0.3);
        }

        .rules-info {
          background: rgba(255, 107, 53, 0.05);
          border: 1px solid rgba(255, 107, 53, 0.1);
          border-radius: 8px;
          padding: 1rem 1.25rem;
          font-size: 0.75rem;
          color: #888;
        }

        .rules-title {
          color: #ff6b35;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .rules-list {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .rule-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .rule-indicator {
          width: 6px;
          height: 6px;
          background: #ff6b35;
          border-radius: 50%;
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .text-container {
            flex-direction: column;
          }
          
          .stats {
            display: none;
          }
          
          .header {
            padding: 1rem;
          }
          
          .main {
            padding: 1rem;
          }
        }
      `}</style>

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

      <main className="main">
        <div className="text-container">
          <div className="text-panel">
            <div className="panel-header">
              <div className="panel-title">
                <FileText size={14} />
                Input Text
              </div>
              <div className="panel-actions">
                <button className="action-button" onClick={handlePaste}>
                  <Copy size={14} />
                  Paste
                </button>
                <button className="action-button" onClick={handleClear}>
                  <Trash2 size={14} />
                  Clear
                </button>
              </div>
            </div>
            <div className="textarea-wrapper">
              <textarea
                className="text-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text here..."
                spellCheck={false}
              />
            </div>
          </div>

          <div className="text-panel">
            <div className="panel-header">
              <div className="panel-title">
                <Sparkles size={14} />
                Cleaned Output
              </div>
              <div className="panel-actions">
                <button
                  className={`action-button ${copied ? 'success' : ''}`}
                  onClick={handleCopy}
                >
                  <Copy size={14} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="textarea-wrapper">
              <textarea
                className="text-output"
                value={cleanedText}
                readOnly
                placeholder="Cleaned text will appear here..."
                spellCheck={false}
              />
            </div>
          </div>
        </div>

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
      </main>
    </div>
  );
};

export default App;