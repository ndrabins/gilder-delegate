import { Button, TextField, Box } from "@mui/material";
import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import {
  withSetGovernanceDelegate,
  getRealms,
  getRealm,
} from "@solana/spl-governance";
import {
  PublicKey,
  ConfirmedSignatureInfo,
  Connection,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";

// if (rawRealm.account.communityMint) {
//   communityMintPromise = connection.getParsedAccountInfo(
//     new PublicKey(rawRealm.account.communityMint)
//   );
// }
// if (rawRealm.account.config.councilMint) {
//   councilMintPromise = connection.getParsedAccountInfo(
//     new PublicKey(rawRealm.account.config.councilMint)
//   );
// }

const REALM_GOVERNANCE_PROGRAM_ID =
  "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw";

const REALM_GOVERNANCE_PKEY = new PublicKey(REALM_GOVERNANCE_PROGRAM_ID);

const GILDER_REALM_PKEY = new PublicKey(
  "6jydyMWSqV2bFHjCHydEQxa9XfXQWDwjVqAdjBEA1BXx"
);

const RPC_CONNECTION = "https://ssc-dao.genesysgo.net/";
let connection = new Connection(RPC_CONNECTION, "confirmed");

export const Delegate = () => {
  const [publicKey, setPublicKey] = useState(
    "5YWDXAX1xygHp4t7wjmPzzfWuybEuKWmd3ojUBnJtkxq"
  );
  const [realms, setRealms] = useState([]);
  const [selectedRealm, setSelectedRealm] = useState(null);

  useEffect(() => {
    // fetch realms
    const realmData = fetchRealm();
    // const realmsData = fetchRealms();
    console.log("realm data", realmData);
    // setSelectedRealm(realmData);
    // setRealms(realmsData);
  }, []);

  // const fetchRealms = async () => {
  //   const realmsData = await getRealms(connection, REALM_GOVERNANCE_PKEY);
  //   return realmsData;
  // };

  const fetchRealm = async () => {
    let realmData = await getRealm(connection, GILDER_REALM_PKEY);
    return realmData;
  };

  const handleDelegate = () => {
    const signers: Keypair[] = [];
    const instructions: TransactionInstruction[] = [];

    // 1. Fetch all realms
    // 2. user selects a realm,
    // get program version, programID, public key, and token mints of realm
    // 3. Check if user has that token deposited (disable button if not deposited)
    // 3. User selects token they want to delegate (council/community)
    // 4. Onclick delegate - fire transaction

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
    console.log("selectedRealm", selectedRealm);
  };

  // TODO: make a form stepper for each action a user needs to do with delegate action at end

  console.log("selectedRealm", selectedRealm);
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
