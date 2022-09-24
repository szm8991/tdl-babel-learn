import path from 'path'
import { getDependencyGraph } from './traverse'

export const dependencyGraph = getDependencyGraph(path.resolve(__dirname, './test/index.ts'))
