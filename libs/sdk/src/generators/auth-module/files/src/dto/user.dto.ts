import { WalletDto } from './wallet.dto';

export class UserDto {
  id?: string;
  subjectId?: string;
  createdAt?: string;
  updatedAt?: string;
  username?: string;
  wallet?: WalletDto;
}
