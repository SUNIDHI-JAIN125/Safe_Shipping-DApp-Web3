import * as anchor from '@project-serum/anchor'
import { anchorProgram } from '../anchorProgram';

export const assignProject= async (
  wallet: anchor.Wallet,
  id: number,
  freelancer_pubkey_str: string,
  agreed_price: number,
) => {
  const program = anchorProgram(wallet);

  let [project_account] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("project"),
      wallet.publicKey.toBuffer(),
      new anchor.BN(id).toArrayLike(Buffer, "le", 8),
    ],
    program.programId 
  );

  try {
    const sig = await program.methods.assignProject(
      new anchor.BN(id),
      freelancer_pubkey_str,
      new anchor.BN(agreed_price)
    ).accounts({
      projectAccount: project_account,
      authority: wallet.publicKey,
    })
      .rpc();
    return { sig, error: false }
  } catch (e: any) {
    console.log(e)
    return { sig: null, error: e.toString() }
  }

}