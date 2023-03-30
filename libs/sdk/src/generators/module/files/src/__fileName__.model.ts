/* eslint-disable @typescript-eslint/no-unused-vars */
import { Ent, Prop } from '@logosphere/sdk';

@Ent('<%= camelize(name) %>')
class <%= classify(name) %>Entity {
  @Prop({
    examples:['<%= dasherize(name) %>-1', '<%= dasherize(name) %>-2', '<%= dasherize(name) %>-3'],
  })
  <%= camelize(name) %>: string;
}
