const fs = require('fs');
const files = [
  'src/routes/ai-settings/index.tsx',
  'src/routes/contexts/index.tsx',
  'src/routes/dashboard/index.tsx',
  'src/routes/panels/index.tsx',
  'src/routes/settings/EmbedSettingsTab.tsx',
  'src/routes/settings/index.tsx',
  'src/routes/settings/KnowledgeTab.tsx',
  'src/routes/tickets/index.tsx'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (!content.includes('TextBlurIn } from')) {
    fs.writeFileSync(f, `import { TextBlurIn } from '../../components/ui/text-blur-in';\n` + content);
    console.log('Added to', f);
  }
});
