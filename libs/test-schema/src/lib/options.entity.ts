import { Entity, Prop } from '@logosphere/decorators';

@Entity('options')
class OptionsEntity {
  @Prop()
  option: string;
}
