// Import Solana web3 functionalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

// Create a new keypair
const receiver_Wallet = new Keypair();
const receiver_PublicKey = new PublicKey(receiver_Wallet.publicKey).toString();
const receiver_PrivateKey = receiver_Wallet.secretKey

const source_SecretKey = new Uint8Array(
    [
        235, 125,  38,  26,  98, 199, 170,  65, 233,  33, 122,
        164,  88, 114, 157, 126, 207, 101, 108,  92, 150, 172,
          6, 104, 118,  55,  31,  28,  77, 183,  44, 155, 206,
        231,  29, 110,  94, 143,  47, 175,  12, 187, 166, 217,
         46, 161, 108,  74, 179, 249, 196, 166, 174, 133, 216,
        140,  63,  50, 154,   0,  86, 137, 240,  55
    ]
);


const getSourceWalletBalance = async () => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        // console.log("Connection object is:", connection);

        // Make a wallet (keypair) from privateKey and get its balance
        const sourceWallet = await Keypair.fromSecretKey(source_SecretKey);
        const sourceWalletBalance = await connection.getBalance(
            new PublicKey(sourceWallet.publicKey)
        );
        console.log("Source Wallet balance      :", sourceWallet.publicKey.toString(), `    Balance :${parseInt(sourceWalletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

const getReceiverWalletBalance = async () => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        // console.log("Connection object is:", connection);

        // Make a wallet (keypair) from privateKey and get its balance
        const receiverWallet = await Keypair.fromSecretKey(receiver_PrivateKey);
        const receiverWalletBalance = await connection.getBalance(
            new PublicKey(receiverWallet.publicKey)
        );
        console.log("Destination Wallet Address :", receiver_PublicKey, `    Balance : ${parseInt(receiverWalletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

const transferSol = async() => {

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    const source = await Keypair.fromSecretKey(source_SecretKey);
    const receiver =  await Keypair.fromSecretKey(receiver_PrivateKey);

    const sourceBalance = await connection.getBalance(
        new PublicKey(source.publicKey)
    )

    // Send money from "source" wallet and into "receiver" wallet
    let transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: source.publicKey,
            toPubkey: receiver.publicKey,
            lamports: sourceBalance * 0.5,
        })
          );

    // Sign transaction
    let signature = await sendAndConfirmTransaction(connection, transaction, [
        source,
        ]);
        console.log('Signature is ', signature);
    };

const mainFunction = async () => {
    await getSourceWalletBalance();
    await getReceiverWalletBalance();
    await transferSol();
    await getSourceWalletBalance();
    await getReceiverWalletBalance();
};


mainFunction();