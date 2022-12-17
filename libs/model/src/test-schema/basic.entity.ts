import { Entity, Prop } from '../decorators';

@Entity('basic')
export class BasicEntity {
  @Prop()
  name: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  type: string;

  @Prop()
  id: number;
}
