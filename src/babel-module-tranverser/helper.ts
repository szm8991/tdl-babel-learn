import path from 'node:path'
import fs from 'node:fs'

export default function getRequirePath(
  curModulePath: string,
  requirePath: string,
  visitedModules: Set<string>
): string {
  requirePath = path.resolve(path.dirname(curModulePath), requirePath)
  if (requirePath.includes('node_modules')) return ''
  requirePath = moduleExtComplete(requirePath)
  if (visitedModules.has(requirePath)) {
    return ''
  } else {
    visitedModules.add(requirePath)
  }
  return requirePath
}

function moduleExtComplete(modulePath: string): string {
  let tryModulePath = ''
  const EXTS = ['.tsx', '.ts', '.jsx', '.js']
  if (modulePath.match(/\.[a-zA-Z]+$/)) return modulePath
  if (isDirectory(modulePath)) {
    // 没从package.json找入口，而是固定找index
    tryModulePath = tryCompletePath(EXTS, ext => path.join(modulePath, 'index' + ext))
  } else if (!EXTS.some(ext => modulePath.endsWith(ext))) {
    tryModulePath = tryCompletePath(EXTS, ext => modulePath + ext)
  }
  if (!tryModulePath) {
    reportModuleNotFoundError(modulePath)
    return modulePath
  }
  return tryModulePath
}

function tryCompletePath(extMap: string[], resolvePath: (ext: string) => string): string {
  for (let i = 0; i < extMap.length; i++) {
    const tryPath = resolvePath(extMap[i])
    // 判断文件是否存在
    if (fs.existsSync(tryPath)) return tryPath
  }
  return ''
}

function reportModuleNotFoundError(modulePath: string): void {
  throw 'module not found: ' + modulePath
}

function isDirectory(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isDirectory()
  } catch (e) {}
  return false
}
