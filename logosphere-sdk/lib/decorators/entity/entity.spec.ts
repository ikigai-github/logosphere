/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop } from '../prop';
import { Entity } from './entity';

describe('Test Entity Decorator', () => {
  it('should use reflection to get default metadata', () => {
    @Entity()
    class SampleEntity {
      @Prop()
      label: string;
    }
  });
});
