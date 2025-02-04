import { SwitchboardProgram } from '../../SwitchboardProgram';
import {
  TransactionInstruction,
  PublicKey,
  AccountMeta,
} from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface CrankPopV2Args {
  params: types.CrankPopParamsV2Fields;
}

export interface CrankPopV2Accounts {
  crank: PublicKey;
  oracleQueue: PublicKey;
  queueAuthority: PublicKey;
  programState: PublicKey;
  payoutWallet: PublicKey;
  tokenProgram: PublicKey;
  crankDataBuffer: PublicKey;
  queueDataBuffer: PublicKey;
  mint: PublicKey;
}

export const layout = borsh.struct([types.CrankPopParamsV2.layout('params')]);

export function crankPopV2(
  program: SwitchboardProgram,
  args: CrankPopV2Args,
  accounts: CrankPopV2Accounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.crank, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleQueue, isSigner: false, isWritable: true },
    { pubkey: accounts.queueAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
    { pubkey: accounts.payoutWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.crankDataBuffer, isSigner: false, isWritable: true },
    { pubkey: accounts.queueDataBuffer, isSigner: false, isWritable: false },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([153, 122, 177, 151, 240, 86, 240, 213]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.CrankPopParamsV2.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({
    keys,
    programId: program.programId,
    data,
  });
  return ix;
}
