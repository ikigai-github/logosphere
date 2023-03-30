import { Guard, Entity, EntityProps, Result } from '@logosphere/sdk';

import { Wallet } from './wallet.entity';

interface UserProps extends EntityProps {
  username?: string;
  wallet?: Wallet;
}

export class User extends Entity<UserProps> {
  get username(): string {
    return this.props.username;
  }
  get wallet(): Wallet {
    return this.props.wallet;
  }

  private constructor(props: UserProps) {
    super(props);
  }

  public static create(props: UserProps): Result<User> {
    const propsResult = Guard.againstNullOrUndefinedBulk([]);

    if (!propsResult.succeeded) {
      return Result.fail<User>(propsResult.message);
    }

    const user = new User(props);

    return Result.ok<User>(user);
  }
}
