export class LucidCardano {
  // Require to be imported that way to prevent ES module export Errors
  static async getImport() {
    return await (eval("import('lucid-cardano')") as Promise<any>);
  }
}
