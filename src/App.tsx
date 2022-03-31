import React, { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { Delegate } from "./Delegate";
import { Box } from "@mui/material/";
import styled from "@emotion/styled";
import Logo from "./GilderLogo.svg";
import { ThemeProvider, useTheme, createTheme } from "@mui/material/styles";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

function App() {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>
            <Container>
              <LogoImg src={Logo} />
              <ConnectButtonContainer>
                <WalletMultiButton />
              </ConnectButtonContainer>
              {/* <ConnectButtonContainer>
                <WalletDisconnectButton />
              </ConnectButtonContainer> */}
              <Delegate />
            </Container>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}
const Container = styled.div`
  background: linear-gradient(0.45turn, #27272a, #131313);
  height: 100vh;
  width: 100%;
  /* justify-content: center; */
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const ConnectButtonContainer = styled.div`
  margin-left: 4px;
  margin-right: 4px;
  margin-bottom: 24px;
`;

const LogoImg = styled.img`
  margin-top: 96px;
  width: 400px;
  margin-bottom: 24px;
`;

export default App;
