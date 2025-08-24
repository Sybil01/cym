// lp-watch.js
// Uso: node lp-watch.js /ruta/al/Vault/_lily --bin /opt/homebrew/bin/lilypond
import { watch } from 'fs';
import { promises as fs } from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

const dir = process.argv[2];
if (!dir) {
  console.error('✖ Falta ruta a carpeta a vigilar (ej: /Users/tú/Vault/_lily)');
  process.exit(1);
}
const binIdx = process.argv.indexOf('--bin');
const lilyBin = binIdx >= 0 ? process.argv[binIdx + 1] : 'lilypond'; // default
console.log('▶ Vigilando:', dir, ' | LilyPond:', lilyBin);

async function compileLy(lyPath) {
  const base = path.parse(lyPath).name;
  const outBase = path.join(path.dirname(lyPath), base); // lilypond agrega .svg
  console.log('⟲ Compilando:', lyPath);
  try {
    const args = [
      '--svg',
      '--silent',
      '--output', outBase,
      lyPath,
    ];
    const { stderr } = await execFileAsync(lilyBin, args);
    if (stderr) console.warn('LilyPond STDERR:', stderr);
    console.log('✓ SVG listo:', outBase + '.svg');
  } catch (e) {
    console.error('✖ Error LilyPond:', e.message);
  }
}

// compila todos los .ly al arrancar
for (const f of await fs.readdir(dir)) {
  if (f.toLowerCase().endsWith('.ly')) {
    compileLy(path.join(dir, f));
  }
}

// observa cambios nuevos
watch(dir, { persistent: true }, (event, fname) => {
  if (!fname) return;
  if (fname.toLowerCase().endsWith('.ly')) {
    compileLy(path.join(dir, fname));
  }
});