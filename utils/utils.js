// create a require function that works in both Node.js and ESM
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export const readJSON = (path) => require(path)