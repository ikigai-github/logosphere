/* eslint-disable @typescript-eslint/no-unused-vars */
import { registerEnum } from '@logosphere/decorators';
export enum <%= className %>Enum
{
  <%= className %>Zero = 0,
  <%= className %>One,
  <%= className %>Two,
  <%= className %>Three = 3
};

registerEnum(<%= className %>Enum, '<%= className %>Enum');