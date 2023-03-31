import { Guard, Entity, EntityProps, Result } from '@logosphere/sdk';

interface WalletAssetProps extends EntityProps {
  name?: string;
  fingerprint?: string;
  policyId?: string;
  quantity?: number;
  metadata?: string;
  assetSubjectId?: string;
  logosphereId?: string;
}

export class WalletAsset extends Entity<WalletAssetProps> {
  get name(): string {
    return this.props.name;
  }
  get fingerprint(): string {
    return this.props.fingerprint;
  }
  get policyId(): string {
    return this.props.policyId;
  }
  get quantity(): number {
    return this.props.quantity;
  }
  get metadata(): string {
    return this.props.metadata;
  }
  get assetSubjectId(): string {
    return this.props.assetSubjectId;
  }
  get logosphereId(): string {
    return this.props.logosphereId;
  }

  private constructor(props: WalletAssetProps) {
    super(props);
  }

  public static create(props: WalletAssetProps): Result<WalletAsset> {
    const propsResult = Guard.againstNullOrUndefinedBulk([]);

    if (!propsResult.succeeded) {
      return Result.fail<WalletAsset>(propsResult.message);
    }

    const walletAsset = new WalletAsset(props);

    return Result.ok<WalletAsset>(walletAsset);
  }
}
