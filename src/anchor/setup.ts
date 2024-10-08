import { IdlAccounts, Program } from "@coral-xyz/anchor";
import { IDL } from "./idl";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const programId = new PublicKey("7eYAkJJTAkhbakA7HriZ57CLVEzLUsRKUf1iehfKv2fm");
const connection = new Connection("https://testnet.dev2.eclipsenetwork.xyz", "confirmed");

// Initialize the program interface with the IDL, program ID, and connection.
// This setup allows us to interact with the on-chain program using the defined interface.
export const program = new Program(IDL, programId, {
    connection,
});

export const [counterPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("counter")],
    program.programId,
);

