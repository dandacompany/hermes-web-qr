import {build} from 'esbuild';
await build({entryPoints:['src/plugin.tsx'],bundle:true,format:'esm',platform:'browser',target:'es2022',jsx:'automatic',external:['@hermes/plugin-sdk','react','react/jsx-runtime'],outfile:'dist/plugin.js',define:{__DEFAULT_URL__:JSON.stringify(process.env.HERMES_WEB_QR_DEFAULT_URL || '')},legalComments:'eof'});

// Unified-package desktop half, with no user-specific default in release builds.
const {mkdir, copyFile} = await import('node:fs/promises');
await mkdir('desktop', {recursive:true});
await copyFile('dist/plugin.js', 'desktop/plugin.js');
