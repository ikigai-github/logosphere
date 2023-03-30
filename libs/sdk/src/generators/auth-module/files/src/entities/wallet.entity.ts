import { Guard, Entity, EntityProps, Result } from '@logosphere/sdk';

import { WalletAsset } from './wallet-asset.entity';

interface WalletProps extends EntityProps {
  name?: string;
  walletId?: string;
  address?: string;
  publicKey?: string;
  policyId?: string;
  balance?: number;
  assets?: WalletAsset[];
}

export class Wallet extends Entity<WalletProps> {
  get name(): string {
    return this.props.name;
  }
  get walletId(): string {
    return this.props.walletId;
  }
  get address(): string {
    return this.props.address;
  }
  get publicKey(): string {
    return this.props.publicKey;
  }
  get policyId(): string {
    return this.props.policyId;
  }
  get balance(): number {
    return this.props.balance;
  }
  get assets(): WalletAsset[] {
    return this.props.assets;
  }

  private constructor(props: WalletProps) {
    super(props);
  }

  public static create(props: WalletProps): Result<Wallet> {
    const propsResult = Guard.againstNullOrUndefinedBulk([]);

    if (!propsResult.succeeded) {
      return Result.fail<Wallet>(propsResult.message);
    }

    const wallet = new Wallet(props);

    return Result.ok<Wallet>(wallet);
  }
}
