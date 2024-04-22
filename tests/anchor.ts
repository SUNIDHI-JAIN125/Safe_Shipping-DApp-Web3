import BN from "bn.js";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import type { SafeShipping } from "../target/types/safe_shipping";

 describe("SAFE SHIPPING", async () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SafeShipping as anchor.Program<SafeShipping>;
  
  let descriptionProject = "project";
  let budget = 10;
  let agreed_price = 19;
   
  // let client_wallet="TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
  // let freelancer_wallet= "Gdp2qPCjeiJXN4rAtXa9e1Mdga7iqYcNHHy935iiaBs3";
 let TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
//  let token_program_id = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"; 

  // Generate random IDs for testing
  let idc = 11;
  let idf = 10;
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


  let freelancer_name = "worker";
  let client_name = "boss";

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
    .assignProject(new anchor.BN(idp),freelancer_name,new anchor.BN(agreed_price))
    .accounts({
        projectAccount: project_account,
        authority: program.provider.publicKey,
      })
    .rpc();
  });
  

//  it("Complete Project", async () => {
//     await program.methods.completeProject(new anchor.BN(idp),new anchor.BN(agreed_price))
//       .accounts({
//         projectAccount: project_account,
//         clientWallet: "4zEnZbavKFosf6TJ9ty8pTdyzQKxTnPXVEGB9K6jiAxt", // Provide client wallet public key
//         freelancerWallet: "HmSihopc4qE2BL3F4CCxUV583RXkNhwffDskBPXvvoDK", // Provide freelancer wallet public key
//         tokenProgram: TOKEN_PROGRAM_ID, // Provide token program ID
//         authority: program.provider.publicKey,
//       })
//       .rpc();
//   });


it("Close Project", async () => { 
    await program.methods
      .closeProject(new anchor.BN(idp))
      .accounts({
        projectAccount:project_account,
        authority: program.provider.publicKey,
      })
      .rpc();
  });

});