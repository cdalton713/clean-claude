import type { CleaningRule } from '../types';

export const cleaningRules: CleaningRule[] = [
  {
    name: 'Remove box drawing',
    description: 'Removes terminal box drawing characters',
    apply: (text: string) => {
      return text
        .split('\n')
        .filter(line => !line.match(/^[─│┌┐└┘├┤┬┴┼╭╮╯╰╱╲╳]+$/))
        .map(line => line.replace(/^[│├╰]\s*/, '').replace(/\s*[│┤╮╯]$/, ''))
        .join('\n');
    }
  },
  {
    name: 'Clean JSON arrays',
    description: 'Formats JSON arrays with escaped quotes',
    apply: (text: string) => {
      return text.replace(
        /^(\s*template_suffixes\s*)?(\[?"?\[.*?\]"?\]?)$/gm,
        (match, prefix, jsonContent) => {
          try {
            let cleanJson = jsonContent.replace(/^"/, '').replace(/"$/, '');
            cleanJson = cleanJson.replace(/\\"/g, '"');
            cleanJson = cleanJson.replace(/""/g, '"');
            
            const parsed = JSON.parse(cleanJson);
            const formatted = JSON.stringify(parsed, null, 2);
            
            return prefix ? `${prefix.trim()}: ${formatted}` : formatted;
          } catch {
            const cleaned = match
              .replace(/\\"/g, '"')
              .replace(/""/g, '"')
              .replace(/"\[/g, '[')
              .replace(/\]"/g, ']');
            return cleaned;
          }
        }
      );
    }
  },
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
      // eslint-disable-next-line no-control-regex
      text = text.replace(/\x1b\[[0-9;]*m/g, '');
      text = text.replace(/^[$>]\s*/gm, '');
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