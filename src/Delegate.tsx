import { Button, TextField, Box } from "@mui/material";
import { useState } from "react";
import styled from "@emotion/styled";
import { withSetGovernanceDelegate } from "@solana/spl-governance";
import {
  PublicKey,
  ConfirmedSignatureInfo,
  Connection,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";

const RPC_CONNECTION = "https://ssc-dao.genesysgo.net/";
let connection = new Connection(RPC_CONNECTION, "confirmed");

export const Delegate = () => {
  const [publicKey, setPublicKey] = useState(
    "5YWDXAX1xygHp4t7wjmPzzfWuybEuKWmd3ojUBnJtkxq"
  );

  const handleDelegate = () => {
    const signers: Keypair[] = [];
    const instructions: TransactionInstruction[] = [];

    // 1. Fetch all realms
    // 2. user selects a realm,
    // get program version, programID, public key, and token mints of realm
    // 3. User selects token they want to delegate (council/community)
    // 4.

    // withSetGovernanceDelegate(
    //   // instructions,
    //   // programId, // publicKey of program
    //   // programVersion, // program version of realm
    //   // realmId, // realm public key
    //   // governingTokenMint, // mint of governance token
    //   // tokenOwner,  // publicKey of for tokenOwnerRecord of this wallet
    //   // governanceAuthority, // publicKey of connected wallet
    //   // newTokenAuthority, // public key of wallet who to delegated vote to
    // )

    console.log("publicKey", publicKey);
  };

  return (
    <Box
      sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}
    >
      <TextField
        size="small"
        sx={{ marginRight: 2 }}
        label="Public Key"
        value={publicKey}
        onChange={(event) => setPublicKey(event.target.value)}
      />
      <Button variant="contained" onClick={handleDelegate}>
        Delegate to PublicKey
      </Button>
    </Box>
  );
};
