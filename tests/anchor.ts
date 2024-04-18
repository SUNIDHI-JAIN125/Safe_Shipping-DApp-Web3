import BN from "bn.js";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { SafeShipping } from "../target/types/safe_shipping";

 describe("SAFE SHIPPING", async () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());  

  const program = anchor.workspace.SafeShipping as anchor.Program<SafeShipping>;
  
  let descriptionProject = "project";
  let budget = 10;
  let agreed_price = 12;
  // let client_wallet="TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
  // let freelancer_wallet= "Gdp2qPCjeiJXN4rAtXa9e1Mdga7iqYcNHHy935iiaBs3";

//  let token_program_id = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

  // Generate random IDs for testing
  let idc = 10;
  let idf =11;
  let idp = 12;
  

  let idcU64 = new anchor.BN(idc);
  let idcNumber = idcU64.toNumber();
  let idcBytes = new anchor.BN(idcNumber).toArrayLike(Buffer, "le", 8);

  let idfU64 = new anchor.BN(idf);
  let idfNumber = idfU64.toNumber();
  let idfBytes = new anchor.BN(idfNumber).toArrayLike(Buffer, "le", 8);

  let idpU64 = new anchor.BN(idp);
  let idpNumber = idpU64.toNumber();
  let idpBytes = new anchor.BN(idpNumber).toArrayLike(Buffer, "le", 8);


  let freelancer_name = "worker free";
  let client_name = "boss client";

  let [client_account] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("project"),
      program.provider.publicKey.toBuffer(),
      idcBytes,
    ],
    program.programId
  );

  let [project_account] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("project"),
      program.provider.publicKey.toBuffer(),
      idpBytes
    ],
    program.programId
  );

  let [freelancer_account] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("project"),
      program.provider.publicKey.toBuffer(),
      idfBytes
    ],
    program.programId
  );

  it("Initialize Client", async () => {
    await program.methods
      .registerClient(new anchor.BN(idc), client_name)
      .accounts({
        clientAccount: client_account,
        authority: program.provider.publicKey,
      })
      .rpc();
  });

  it("Initialize Freelancer", async () => {
    await program.methods
      .registerFreelancer(new anchor.BN(idf), freelancer_name)
      .accounts({
        freelancerAccount: freelancer_account,
        authority: program.provider.publicKey,
      })
        .rpc();
  });

  it("Initialize Project", async () => {
    await program.methods
      .createProject(new anchor.BN(idp), descriptionProject, new anchor.BN(budget))
      .accounts({
        projectAccount: project_account,
        clientAccount: client_account,
        authority: program.provider.publicKey,
      })
      .rpc();
  });

  

it("Assign Project to Freelancer", async () => {
    await program.methods
    .assignProject(freelancer_name, new anchor.BN(agreed_price), new anchor.BN(idp))
      .accounts({
        projectAccount: project_account,
        authority: program.provider.publicKey,
      })
      .rpc();
  });
  


//  it("Complete Project", async () => {
// await program.methods.completeProject(new anchor.BN(1), new anchor.BN(idp))
//       .accounts({
//         projectAccount: project_account,
//         clientAccount: client_account,
//         freelancerAccount: freelancer_account,
//         clientWallet: client_wallet,
//         freelancerWallet: freelancer_wallet,
//         tokenProgram: token_program_id,
//         authority: program.provider.publicKey,
//       })
//       .rpc();
//   });


// it("Close Project", async () => {
//     await program.methods
//       .closeProject(new anchor.BN(idp))
//       .accounts({
//         projectAccount:project_account,
//         authority: program.provider.publicKey,
//       })
//       .rpc();
//   });

});