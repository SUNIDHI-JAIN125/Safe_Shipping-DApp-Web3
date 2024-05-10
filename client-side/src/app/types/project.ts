import { PublicKey } from "@solana/web3.js";

export interface Project{
    id: number,
    client_name: string,
    description:string,
    budget:number,
    state: number,
    freelancer_pubkey: string,
    agreedPrice:number,
    authority:string,
    pubKey: string,
}

