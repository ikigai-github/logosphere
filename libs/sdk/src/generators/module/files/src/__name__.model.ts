/* eslint-disable @typescript-eslint/no-unused-vars */
import {Entity, Prop} from '@logosphere/decorators';

@Entity('<%= cameledName %>')
class <%= className %>Entity {
  @Prop({
    examples:['<%= dashedName %>-1', '<%= dashedName %>-2', '<%= dashedName %>-3'],
  })
  <%= cameledName %>: string;
}