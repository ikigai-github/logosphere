import { Configuration, ConfigurationLoader } from '@logosphere/sdk/dist/lib/configuration';
import { FileSystemReader } from '@nestjs/cli/lib/readers';

export async function loadConfiguration(): Promise<Partial<Configuration>> {
  const loader: ConfigurationLoader = new ConfigurationLoader(
    new FileSystemReader(process.cwd()),
  );
  return loader.load();
}