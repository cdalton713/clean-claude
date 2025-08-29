import React, { useState, useCallback } from 'react';
import { Copy, Trash2, FileText, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { TextPanel } from './components/TextPanel';
import { RulesInfo } from './components/RulesInfo';
import { useTextCleaner } from './hooks/useTextCleaner';
import { useTextStats } from './hooks/useTextStats';
import './styles/App.css';

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
      <Header stats={stats} />

      <main className="main">
        <div className="text-container">
          <TextPanel
            title="Input Text"
            icon={FileText}
            value={inputText}
            onChange={setInputText}
            placeholder="Paste your text here..."
            actions={
              <>
                <button className="action-button" onClick={handlePaste}>
                  <Copy size={14} />
                  Paste
                </button>
                <button className="action-button" onClick={handleClear}>
                  <Trash2 size={14} />
                  Clear
                </button>
              </>
            }
          />

          <TextPanel
            title="Cleaned Output"
            icon={Sparkles}
            value={cleanedText}
            readOnly
            placeholder="Cleaned text will appear here..."
            actions={
              <button
                className={`action-button ${copied ? 'success' : ''}`}
                onClick={handleCopy}
              >
                <Copy size={14} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            }
          />
        </div>

        <RulesInfo />
      </main>
    </div>
  );
};

export default App;