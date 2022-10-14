import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['cli/index'],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
})
