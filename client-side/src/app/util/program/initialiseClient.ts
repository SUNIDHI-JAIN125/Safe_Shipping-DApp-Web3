// import * as anchor from '@project-serum/anchor'
// import { anchorProgram } from '../anchorProgram';

// export const initialiseClient = async (
//   wallet: anchor.Wallet,
//   client_name:string,
// ) => {
//   const program = anchorProgram(wallet);


//   let id = +new Date()

//   let [client_account] = anchor.web3.PublicKey.findProgramAddressSync(
//     [
//       Buffer.from("project"),
//       wallet.publicKey.toBuffer(),
//       new anchor.BN(id).toArrayLike(Buffer, "le", 8),
//     ],
//     program.programId
//   );

//   try {
//     const sig = await program.methods
//       .registerClient(
//         new anchor.BN(id),
//         client_name)
//       .accounts({
//         clientAccount: client_account,
//         authority: wallet.publicKey,
//       })
//       .rpc();

//     return { error: false, sig }
//   } catch (e: any) {
//     console.log(e)
//     return { error: e.toString(), sig: null }
//   }
// }