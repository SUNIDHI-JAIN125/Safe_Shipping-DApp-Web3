import * as anchor from '@project-serum/anchor'
import { anchorProgram } from '../anchorProgram';

export const initialiseFreelancer = async (
  wallet: anchor.Wallet,
  freelancer_name:string,
) => {
  const program = anchorProgram(wallet);


  let id = +new Date()

  let [freelancer_account] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("project"),
      wallet.publicKey.toBuffer(),
      new anchor.BN(id).toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );

  try {
    const sig = await program.methods
      .registerFreelancer(
        new anchor.BN(id),
        freelancer_name)
      .accounts({
        freelancerAccount: freelancer_account,
        authority: wallet.publicKey,
      })
      .rpc();

    return { error: false, sig }
  } catch (e: any) {
    console.log(e)
    return { error: e.toString(), sig: null }
  }
}