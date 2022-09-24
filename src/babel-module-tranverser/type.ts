export class DependencyNode {
  public subModules: Record<string, any> = {}
  constructor(
    public path: string = '',
    public imports: Record<string, any> = {},
    public exports: Record<string, any>[] = []
  ) {}
}
export enum IMPORT_TYPE {
  deconstruct = 'deconstruct',
  default = 'default',
  namespace = 'namespace',
}
export enum EXPORT_TYPE {
  all = 'all',
  default = 'default',
  named = 'named',
}
