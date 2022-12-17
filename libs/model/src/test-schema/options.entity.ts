import { Entity, Prop } from '../decorators';

@Entity('options')
class OptionsEntity {
  @Prop()
  option: string;
}
