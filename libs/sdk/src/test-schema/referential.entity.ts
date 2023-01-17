import { Ent, Prop } from '../decorators';
import { BasicEntity } from './basic.entity';

@Ent('referential')
class ReferentialEntity {
  @Prop({
    comment: 'This references the basic entity',
    required: true,
  })
  basic: BasicEntity;

  @Prop()
  name: string;
}
