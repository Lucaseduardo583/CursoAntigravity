import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const assetsDir = path.join(distDir, 'assets');

// Find CSS and JS files
const files = fs.readdirSync(assetsDir);
const cssFile = files.find(f => f.endsWith('.css'));
const jsFile = files.find(f => f.endsWith('.js'));

if (!cssFile || !jsFile) {
  console.error('CSS or JS file not found in dist/assets!');
  process.exit(1);
}

const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');
const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8');

const htmlContent = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌱</text></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Horta-na-Mão | Assinatura de Orgânicos Frescos</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
    <style>
${cssContent}
    </style>
  </head>
  <body class="bg-[#FBF9F5] text-stone-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
    <div id="root"></div>
    <script>
${jsContent}
    </script>
  </body>
</html>
`;

// Save to Projeto_Design/horta_na_mao.html
const target1 = path.join(__dirname, 'horta_na_mao.html');
fs.writeFileSync(target1, htmlContent, 'utf-8');
console.log('Saved:', target1);

// Also save to parent directory MeuPrimeiroAntigravity/horta_na_mao.html for immediate root access!
const target2 = path.join(__dirname, '..', 'horta_na_mao.html');
fs.writeFileSync(target2, htmlContent, 'utf-8');
console.log('Saved:', target2);
