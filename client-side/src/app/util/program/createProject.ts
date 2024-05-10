import * as anchor from '@project-serum/anchor'
import { anchorProgram } from '../anchorProgram';

export const createProject = async (
  wallet: anchor.Wallet,
  client_name:string,
  description:string,
  budget:number,
) => {
  const program = anchorProgram(wallet);


  let id = +new Date();

  let [project_account] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("project"),
      wallet.publicKey.toBuffer(),
      new anchor.BN(id).toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );

  try {
    const sig = await program.methods
      .createProject(
        new anchor.BN(id),
        client_name,
        description,
        new anchor.BN(budget))
      .accounts({
        projectAccount: project_account,
        authority: wallet.publicKey,
      })
      .rpc();

    return { error: false, sig }
  } catch (e: any) {
    console.log(e)
    return { error: e.toString(), sig: null }
  }
}