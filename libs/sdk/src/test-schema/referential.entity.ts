import { Entity, Prop } from '../decorators';
import { BasicEntity } from './basic.entity';

@Entity('referential')
class ReferenetialEntity {
  @Prop({
    comment: 'This references the basic entity',
    required: true,
  })
  basic: BasicEntity;

  @Prop()
  name: string;
}
