/**
 * say 你好
 * @param name 名字
 * @return string
 */
function sayHi(name: string, age: number, a: boolean): string {
  console.log(`hi, ${name}`)
  return `hi, ${name}`
}

/**
 * 类测试
 */
class Ming {
  // name 属性
  name: string
  constructor(name: string) {
    this.name = name
  }

  /**
   * 方法测试
   * @return string
   */
  sayHi(): string {
    return `hi, I'm ${this.name}`
  }
}
