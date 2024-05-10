import * as anchor from '@project-serum/anchor'
import { anchorProgram } from '../anchorProgram';
import { v4 } from 'uuid';

export const getClientProjects = async (
  wallet: anchor.Wallet,
) => {
  const program = anchorProgram(wallet);

  // @ts-ignore
  const projects = await program.account.projectAccount.all()
  console.log(projects);

  const output = projects.map((project: any) => {
    return {
      id: project.account.id.toNumber(),
      client_name: project.account.clientName,
      description: project.account.description,
      budget: project.account.budget.toNumber(),
      state: project.account.state,
      freelancer_pubkey: project.account.freelancerPubkey.toBase58(),
      agreedPrice: project.account.agreedPrice.toNumber(),
      pubKey: project.publicKey.toBase58(),
    };
  });
  return output
}