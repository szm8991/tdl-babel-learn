import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getDependencyGraph } from './traverse'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const dependencyGraph = getDependencyGraph(resolve(__dirname, './test/index.ts'))
