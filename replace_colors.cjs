const fs = require('fs');
const path = require('path');

const replacements = {
  'text-\\[var\\(--color-navy\\)\\]': 'text-[#0F172A]',
  'bg-\\[var\\(--color-navy\\)\\]': 'bg-[#4A3AFF]',
  'border-\\[var\\(--color-navy\\)\\]': 'border-[#4A3AFF]',
  'text-\\[var\\(--color-navy-light\\)\\]': 'text-[#64748B]',
  'bg-\\[var\\(--color-navy-light\\)\\]': 'bg-[#64748B]',
  'text-\\[var\\(--color-gold\\)\\]': 'text-[#4A3AFF]',
  'bg-\\[var\\(--color-gold\\)\\]': 'bg-[#4A3AFF]',
  'border-\\[var\\(--color-gold\\)\\]': 'border-[#4A3AFF]',
  'bg-\\[var\\(--color-ivory\\)\\]': 'bg-[#F8FAFC]',
  'border-\\[var\\(--color-silver-light\\)\\]': 'border-gray-100',
  'border-\\[var\\(--color-silver\\)\\]': 'border-gray-200',
  'text-\\[var\\(--color-silver\\)\\]': 'text-gray-400',
  'bg-\\[var\\(--color-silver\\)\\]': 'bg-gray-200',
  'gold-gradient': 'bg-gradient-to-r from-[#4481eb] to-[#04befe]',
  'silver-gradient': 'bg-gradient-to-r from-gray-100 to-gray-200',
  'glass-panel': 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
  'bg-\\[var\\(--color-gold-light\\)\\]': 'bg-blue-50'
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedFiles = 0;
walkDir('./src', (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(key, 'g');
      content = content.replace(regex, value);
    }
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
      modifiedFiles++;
    }
  }
});

console.log(`Finished. Modified ${modifiedFiles} files.`);
