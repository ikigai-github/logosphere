import { Ent, Prop } from '../decorators';

@Ent('options')
class OptionsEntity {
  @Prop()
  option: string;
}
