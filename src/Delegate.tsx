import { Button, TextField, Box } from "@mui/material";
import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import {
  withSetGovernanceDelegate,
  getRealms,
  getRealm,
  getTokenOwnerRecord,
  getTokenOwnerRecordAddress,
  getGovernanceProgramVersion,
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

const REALM_GOVERNANCE_PROGRAM_ID =
  "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw";

const REALM_GOVERNANCE_PKEY = new PublicKey(REALM_GOVERNANCE_PROGRAM_ID);

const GILDER_REALM_PKEY = new PublicKey(
  "6jydyMWSqV2bFHjCHydEQxa9XfXQWDwjVqAdjBEA1BXx"
);

const RPC_CONNECTION = "https://ssc-dao.genesysgo.net/";
let connection = new Connection(RPC_CONNECTION, "confirmed");

export const Delegate = () => {
  // twitter wallet key
  const [delegatePublicKey, setDelegatePublicKey] = useState(
    "4warKVthQCTP1LmhKyJQHJGb1jvCUrzVnVhmA8pxE3Nt"
  );
  const [realms, setRealms] = useState([]);
  const [selectedRealm, setSelectedRealm] = useState<any>(null);
  const [tokenOwnerRecord, setTokenOwnerRecord] = useState<any>(null);

  useEffect(() => {
    const fetchRealms = async () => {
      const realmsData = await getRealms(connection, REALM_GOVERNANCE_PKEY);
      // @ts-ignore
      setRealms(realmsData);
    };

    // temp for testing
    const fetchRealm = async () => {
      let realmData = await getRealm(connection, GILDER_REALM_PKEY);
      let tokenAddress = await getTokenOwnerRecordAddress(
        REALM_GOVERNANCE_PKEY, // governance program public key of selected realm
        GILDER_REALM_PKEY, // public key of realm
        //@ts-ignore
        realmData.account.config.councilMint, // mint to be delegated
        new PublicKey("EVa7c7XBXeRqLnuisfkvpXSw5VtTNVM8MNVJjaSgWm4i") // public key of owner walet
      );

      let tokenRecord = await getTokenOwnerRecord(connection, tokenAddress);
      console.log("token address", tokenAddress);
      console.log("token owner record", tokenRecord);
      // @ts-ignore
      setSelectedRealm(realmData);
      // @ts-ignore
      setTokenOwnerRecord(tokenRecord);
    };

    fetchRealms();
    fetchRealm();
  }, []);

  const handleDelegate = async () => {
    const signers: Keypair[] = [];
    const instructions: TransactionInstruction[] = [];

    try {
      // 1. Fetch all realms
      // 2. user selects a realm,
      // get program version, programID, public key, and token mints of realm
      // 3. Check if user has that token deposited (disable button if not deposited)
      // 3. User selects token they want to delegate (council/community)
      // 4. Onclick delegate - fire transaction

      const programVersion = await getGovernanceProgramVersion(
        connection,
        new PublicKey("GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw") // governance program public key
      );

      // console.log("program version", programVersion);

      // console.log("publicKey", publicKey);
      console.log("Program Version", programVersion);
      console.log("selectedRealm", selectedRealm);
      console.log("tokenOwnerRecord", tokenOwnerRecord);
      console.log("mint", selectedRealm.account.config.councilMint);

      withSetGovernanceDelegate(
        instructions,
        REALM_GOVERNANCE_PKEY, // publicKey of program
        programVersion, // program version of realm
        selectedRealm.pubKey, // realm public key
        selectedRealm.account.config.councilMint, // mint of governance token
        tokenOwnerRecord.owner, // publicKey of for tokenOwnerRecord of this wallet
        new PublicKey("EVa7c7XBXeRqLnuisfkvpXSw5VtTNVM8MNVJjaSgWm4i"), // publicKey of connected wallet
        new PublicKey(delegatePublicKey) // public key of wallet who to delegated vote to
      );

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
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Box
      sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}
    >
      <TextField
        size="small"
        sx={{ marginRight: 2 }}
        label="Public Key"
        value={delegatePublicKey}
        onChange={(event) => setDelegatePublicKey(event.target.value)}
      />
      <Button variant="contained" onClick={handleDelegate}>
        Delegate to PublicKey
      </Button>
    </Box>
  );
};
