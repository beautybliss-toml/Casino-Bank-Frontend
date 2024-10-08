import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { SalmonWalletAdapter } from '@solana/wallet-adapter-wallets';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { FC, ReactNode, useMemo, useCallback, useState } from 'react';
import { Program, AnchorProvider, web3, utils } from '@project-serum/anchor';
// import logo from './eclipselogo.jpg';

import idl from '../anchor/idl';
// require('@solana/wallet-adapter-react-ui/styles.css');
// require('./App.css');

const App: FC = () => {
    return (
        <Context>
            <Content />
        </Context>
    );
};
export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    const customClusterEndpoint = "https://testnet.dev2.eclipsenetwork.xyz";
    const endpoint = customClusterEndpoint;
    const wallets = useMemo(() => [new SalmonWalletAdapter()], []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Content: FC = () => {
    const wallet = useWallet();
    const [click, setClick] = useState(false);

    const anchorWallet = useMemo(() => {
        if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) return null;
        return {
            publicKey: wallet.publicKey,
            signTransaction: wallet.signTransaction.bind(wallet),
            signAllTransactions: wallet.signAllTransactions.bind(wallet),
        };
    }, [wallet]);

    const onMintNFT = useCallback(async () => {
        if (!anchorWallet) return;
        const connection = new Connection("https://testnet.dev2.eclipsenetwork.xyz", 'confirmed');
        const provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
        const programId = new PublicKey('7eYAkJJTAkhbakA7HriZ57CLVEzLUsRKUf1iehfKv2fm');
        const program = new Program(idl, programId, provider);

        try {
            await program.methods.initialize().rpc();
            alert("NFT minted successfully");
        } catch (error) {
            console.error("Error minting NFT:", error);
        }
    }, [anchorWallet, click]);

    return (
        <div className="App">
            <header className="title-header">
                Eclipse Testnet Test
            </header>
            <WalletMultiButton className="WalletMultiButton" />
            <div>
                <button onClick={onMintNFT} disabled={!wallet.connected}>
                    invoke
                </button>
            </div>
        </div>
    );
};