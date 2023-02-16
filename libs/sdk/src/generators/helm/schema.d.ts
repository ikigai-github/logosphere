export interface HelmGeneratorOptions {
  excludeFluree: boolean;
  excludeBlockfrost: boolean;
  excludeWallet: boolean;
  buildImages: boolean;
  force: boolean;
}

interface HelmApplication {
  name: string;
  port: number;
  path: string;
}

type TemplateType = { [key: string]: string | boolean };
