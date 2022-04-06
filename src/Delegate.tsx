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
  SystemProgram,
} from "@solana/web3.js";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const REALM_GOVERNANCE_PROGRAM_ID =
  "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw";

const REALM_GOVERNANCE_PKEY = new PublicKey(REALM_GOVERNANCE_PROGRAM_ID);

const GILDER_REALM_PKEY = new PublicKey(
  "6jydyMWSqV2bFHjCHydEQxa9XfXQWDwjVqAdjBEA1BXx"
);

const RPC_CONNECTION = "https://ssc-dao.genesysgo.net/";
let connection = new Connection(RPC_CONNECTION, "confirmed");

export const Delegate = () => {
  const { publicKey, sendTransaction } = useWallet();
  // const { connection } = useConnection();

  const [delegatePublicKey, setDelegatePublicKey] = useState(
    "4warKVthQCTP1LmhKyJQHJGb1jvCUrzVnVhmA8pxE3Nt"
  );
  const [realms, setRealms] = useState([]);
  const [selectedRealm, setSelectedRealm] = useState<any>(null);
  const [tokenOwnerRecord, setTokenOwnerRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      // @ts-ignore
      setSelectedRealm(realmData);
      // @ts-ignore
      setTokenOwnerRecord(tokenRecord);
      setIsLoading(false);
    };

    fetchRealms();
    fetchRealm();
  }, []);

  const handleDelegate = async () => {
    const signers: Keypair[] = [];
    const instructions: TransactionInstruction[] = [];
    if (!publicKey) throw new WalletNotConnectedError();

    try {
      // 1. Fetch all realms
      // 2. user selects a realm,
      // get program version, programID, public key, and token mints of realm
      // 3. Check if user has that token deposited (disable button if not deposited)
      // 3. User selects token they want to delegate (council/community)
      // 4. Onclick delegate - fire transaction

      const programVersion = await getGovernanceProgramVersion(
        connection,
        selectedRealm.owner // governance program public key
      );

      withSetGovernanceDelegate(
        instructions,
        selectedRealm.owner, // publicKey of program/programId
        programVersion, // program version of realm
        selectedRealm.pubkey, // realm public key
        selectedRealm.account.config.councilMint, // mint of governance token
        tokenOwnerRecord.account.governingTokenOwner, // governingTokenOwner (walletId) publicKey of for tokenOwnerRecord of this wallet
        tokenOwnerRecord.account.governingTokenOwner, // governanceAuthority: publicKey of connected wallet?
        new PublicKey(delegatePublicKey) // public key of wallet who to delegated vote to
      );

      const recentBlockhash = await connection.getRecentBlockhash();

      console.log("Instructions??", instructions);
      const transaction = new Transaction({
        recentBlockhash: recentBlockhash.blockhash,
      });

      transaction.add(...instructions);
      transaction.feePayer = publicKey;
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "processed");
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log("selected Realm", selectedRealm);

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
      <Button variant="contained" onClick={handleDelegate} disabled={isLoading}>
        Delegate to PublicKey
      </Button>
    </Box>
  );
};
