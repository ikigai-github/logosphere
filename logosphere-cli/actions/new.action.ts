import * as nest from '@nestjs/cli/actions';
import { Input } from '@nestjs/cli/commands';

export class NewAction extends nest.NewAction {
  public async handle(inputs?: Input[], options?: Input[], extraFlags?: string[]): Promise<void> {
    await super.handle(inputs, options);
    console.log('New Logos Action');
    process.exit(0);
  }
  
}

export const exit = () => process.exit(1);