// DompetKeluarga — main.ts (Node 22, standard library only).
//
// This program hands the site in. It copies the static site in app/ and
// the screenshots in screenshots/ from beside this file into the output
// directory, then writes /output/dossier.json with buildDossier from the
// vendored make.fun library, so the judge reads the same summary the
// scorer builds itself. vendor/makefun-frontend.ts is the kit's copy,
// unchanged.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(here, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The scorer's caps, as the kit states them: the dossier text is capped at
// 160 KiB, at most 4 screenshots of 256 KiB each, at most 993 files and
// directories in app/ totalling 16 MiB. The dossier library refuses an
// entry past those caps, so a failure here is a failure the gate would
// also report — fix the site, not this program.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
