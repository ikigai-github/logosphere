import { Entity, Prop } from '@logosphere/sdk/lib/decorators';

@Entity({ module: 'auction'})
class Auction {
  @Prop()
  minimumPrice: number;

  @Prop()
  buyNowPrice: number;

  @Prop()
  startTime: number;

  @Prop()
  endTime: number;
}
