#!/usr/bin/env node
import { myTransformSync } from '../core'
import { program } from 'commander'
import { cosmiconfigSync } from 'cosmiconfig'
import glob from 'glob'
import { promises } from 'node:fs'
import path from 'node:path'
// cli argv1(input) --out-dir argv2(output) --watch
program.option('--out-dir <outDir>', '输出目录')
program.option('--watch', '监听文件变动')

if (process.argv.length <= 2) {
  program.outputHelp()
  process.exit(0)
}

program.parse(process.argv)

const opts = program.opts()

if (!program.args[0]) {
  console.error('没有指定待编译文件')
  program.outputHelp()
  process.exit(1)
}

if (!opts.outDir) {
  console.error('没有指定输出目录')
  program.outputHelp()
  process.exit(1)
}

if (opts.watch) {
  import('chokidar').then(chokidar => {
    chokidar.watch(program.args[0]).on('all', (event, path) => {
      console.log('检测到文件变动，编译：' + path)
      compile([path])
    })
  })
}

const filenames = glob.sync(program.args[0])

const explorerSync = cosmiconfigSync('babel')

const searchResult = explorerSync.search()
const options: any = {
  babelOptions: searchResult!.config,
  cliOptions: {
    ...opts,
    filenames,
  },
}

async function compile(fileNames) {
  for (const filename of fileNames) {
    const fileContent = await promises.readFile(filename, 'utf-8')
    const baseFileName = path.basename(filename)
    const sourceMapFileName = baseFileName + '.map.json'

    const res = myTransformSync(fileContent, {
      ...options.babelOptions,
      fileName: baseFileName,
    })
    const generatedFile = res.code + '\n' + '//# sourceMappingURL=' + sourceMapFileName

    const distFilePath = path.join(options.cliOptions.outDir, baseFileName)
    const distSourceMapPath = path.join(options.cliOptions.outDir, baseFileName + '.map.json')
    const dir = options.cliOptions.outDir
    try {
      await promises.access(dir)
    } catch (e) {
      await promises.mkdir(dir)
    }
    await promises.writeFile(distFilePath, generatedFile)
    await promises.writeFile(distSourceMapPath, res.map)
  }
}

compile(options.cliOptions.filenames)
