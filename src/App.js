import { useState } from "react";
import './App.css';

const NETWORK = 'livenet'
const RECIPIENT_ADDRESS = 'bc1pquarvx4j8tn8594j204zphpzwdfndealmqnxztd3xp4qx53k3eesmkxv0l'
const INSCRIPTION_ID = '568efc6ba7908f90908fcf2af243996f361dad3a11ae2d1401c9d845efd81720i0'
const FEE_RATE = 30

function App() {
	const [address, setAddress] = useState(null)
	const [publicKey, setPublicKey] = useState(null)

	const init = async () => {
		if (window.okxwallet && window.okxwallet.bitcoin) {
			window.okxwallet.bitcoin.on('accountChanged', async (addressInfo) => {
				if (currentNetwork === NETWORK) {
					setAddress(addressInfo.address)
					setPublicKey(addressInfo.publicKey)
				} else {
					setAddress(null)
					setPublicKey(null)
				}
			});

			const currentNetwork = await window.okxwallet.bitcoin.getNetwork(NETWORK)

			if (currentNetwork === NETWORK) {
				const accounts = await window.okxwallet.bitcoin.getAccounts()

				if (accounts.length) {
					setAddress(accounts[0])
					setPublicKey(await window.okxwallet.bitcoin.getPublicKey())
				}
			}
		}
	}

	init()

	const connectWallet = async () => {
		try {
			if (!window.okxwallet) {
				alert('OKX wallet not installed');
				return
			}

			if (!window.okxwallet.bitcoin) {
				alert('Bitcoin account not available');
				return
			}

			const currentNetwork = await window.okxwallet.bitcoin.getNetwork(NETWORK)

			if (currentNetwork === NETWORK) {
				const accounts = await window.okxwallet.bitcoin.requestAccounts()

				setAddress(accounts[0])
				setPublicKey(await window.okxwallet.bitcoin.getPublicKey())
			} else {
				alert('Invalid network');
				return
			}
		} catch (error) {
			console.error(JSON.stringify(error))
			alert(JSON.stringify(error))
		}
	}

	const sendBitcoin = async () => {
		try {
			const txid = await window.okxwallet.bitcoin.sendBitcoin(RECIPIENT_ADDRESS, 1000, {
				feeRate: FEE_RATE,
			})

			if (txid) {
				console.log(txid)
			} else {
				alert('Error')
			}
		} catch (error) {
			console.error(JSON.stringify(error))
			alert(JSON.stringify(error))
		}
	}

	const sendInscription = async () => {
		try {
			const txid = await window.okxwallet.bitcoin.sendInscription(RECIPIENT_ADDRESS, INSCRIPTION_ID, {
				feeRate: FEE_RATE,
			})

			if (txid) {
				console.log(txid)
			} else {
				alert('Error')
			}
		} catch (error) {
			console.error(JSON.stringify(error))
			alert(JSON.stringify(error))
		}
	}

	const signMessage = async () => {
		try {
			const message = 'Hello World'

			const signature = await window.okxwallet.bitcoin.signMessage(message)
			console.log(signature)
		} catch (error) {
			console.error(JSON.stringify(error))
			alert(JSON.stringify(error))
		}
	}

	return (
		<>
			{(!address) && (<button onClick={connectWallet}>Connect Wallet</button>)}
			{(address) && (
				<>
					<>Address: {address}</><br />
					<>Public Key: {publicKey}</><br />
					<br />
					<button onClick={sendBitcoin} >Send Bitcoin</button>
					<button onClick={sendInscription} >Send Inscription</button>
					<button onClick={signMessage} >Sign Message</button>
				</>
			)}
		</>
	);
}

export default App;
