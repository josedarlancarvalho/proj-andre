import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';

// Criar a pasta dist se não existir
const distDir = path.join(__dirname, '../../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copiar arquivos não-TS
function copyNonTsFiles(srcDir: string, distDir: string) {
  fs.readdirSync(srcDir, { withFileTypes: true }).forEach(entry => {
    const srcPath = path.join(srcDir, entry.name);
    const distPath = path.join(distDir, entry.name);
    
    if (entry.isDirectory()) {
      if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath, { recursive: true });
      }
      copyNonTsFiles(srcPath, distPath);
    } else if (!entry.name.endsWith('.ts') && !entry.name.endsWith('.tsx')) {
      fs.copyFileSync(srcPath, distPath);
    }
  });
}

try {
  // Executar o compilador TypeScript
  const result = child_process.spawnSync('npx', ['tsc', '--skipLibCheck'], {
    stdio: 'inherit',
    shell: true
  });
  
  if (result.status !== 0) {
    console.error('Erro durante a compilação TypeScript');
    process.exit(1);
  }
  
  // Copiar arquivos não-TypeScript
  copyNonTsFiles(path.join(__dirname, '..'), path.join(__dirname, '../../dist'));
  
  console.log('Build concluído com sucesso!');
} catch (error) {
  console.error('Erro durante o processo de build:', error);
  process.exit(1);
} 