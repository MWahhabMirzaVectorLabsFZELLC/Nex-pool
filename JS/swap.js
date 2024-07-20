var web3;
var address = "0xFfcF002C9f8e01ce9c3Bd3e9feD314Eb5acC6210"; // Replace with your contract address
var abi = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_feeCollector",
				type: "address",
			},
			{
				internalType: "address",
				name: "_balancerAccount",
				type: "address",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "amountRUNE",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amountWBTC",
				type: "uint256",
			},
		],
		name: "BalancerReinvested",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "totalProfitWBTC",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "totalProfitRUNE",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "ownerProfitWBTC",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "ownerProfitRUNE",
				type: "uint256",
			},
		],
		name: "DailyProfitDistributed",
		type: "event",
	},
	{
		inputs: [],
		name: "distributeDailyProfit",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amountRUNE",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amountWBTC",
				type: "uint256",
			},
		],
		name: "ExcessWithdrawn",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address",
			},
			{
				indexed: false,
				internalType: "bytes32",
				name: "lpTokenKey",
				type: "bytes32",
			},
		],
		name: "LPGeneration",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amountWBTC",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amountRUNE",
				type: "uint256",
			},
		],
		name: "LiquidityRemoved",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "targetAmountRUNE",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "targetAmountWBTC",
				type: "uint256",
			},
		],
		name: "PoolRebalanced",
		type: "event",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_runeAmount",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "_wbtcAmount",
				type: "uint256",
			},
		],
		name: "provideLiquidity",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountRUNE",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "amountWBTC",
				type: "uint256",
			},
		],
		name: "reinvestFromBalancer",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountWBTC",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "amountRUNE",
				type: "uint256",
			},
			{
				internalType: "bytes32",
				name: "lpTokenKey",
				type: "bytes32",
			},
		],
		name: "removeLiquidity",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_runeTokenAddress",
				type: "address",
			},
			{
				internalType: "address",
				name: "_wbtcTokenAddress",
				type: "address",
			},
		],
		name: "setTokens",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "inputAmount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "outputAmount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "address",
				name: "inputToken",
				type: "address",
			},
			{
				indexed: false,
				internalType: "address",
				name: "outputToken",
				type: "address",
			},
		],
		name: "Swapped",
		type: "event",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_amountRUNE",
				type: "uint256",
			},
		],
		name: "swapRUNEtoWBTC",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amountWBTC",
				type: "uint256",
			},
		],
		name: "swapWBTCtoRUNE",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "targetAmountRUNE",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "targetAmountWBTC",
				type: "uint256",
			},
		],
		name: "withdrawExcessToBalancer",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "getPoolInfo",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "provider",
				type: "address",
			},
		],
		name: "getProviderInfo",
		outputs: [
			{
				internalType: "uint256",
				name: "amountWBTC",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "amountRUNE",
				type: "uint256",
			},
			{
				internalType: "bytes32",
				name: "lpTokenKey",
				type: "bytes32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "inputAmount",
				type: "uint256",
			},
			{
				internalType: "bool",
				name: "isWBTCtoRUNE",
				type: "bool",
			},
		],
		name: "getSwapInfo",
		outputs: [
			{
				internalType: "uint256",
				name: "estimatedOutputAmount",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "transactionFee",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "exchangeRate",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		name: "liquidityProviders",
		outputs: [
			{
				internalType: "uint256",
				name: "amountWBTC",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "amountRUNE",
				type: "uint256",
			},
			{
				internalType: "bytes32",
				name: "lpTokenKey",
				type: "bytes32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "liquidityProvidersList",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "totalDailyFeesRUNE",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "totalDailyFeesWBTC",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "totalLiquidityRUNE",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "totalLiquidityWBTC",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
]; // Replace with your contract ABI

var contract;

// Call the function to check for MetaMask installation and unisat on page load
window.addEventListener("load", () => {
	if (window.ethereum) {
		document.getElementById("connector").textContent = "Installed";
	} else {
		document.getElementById("connector").textContent = "Not Installed";
		document.getElementById("connector").style.backgroundColor = "red";
		document.getElementById("connector").style.fontSize = "8px";
	}

	if (window.unisat) {
		document.getElementById("uniConnect").textContent = "Installed";
	} else {
		document.getElementById("uniConnect").textContent = "Not Installed";
		document.getElementById("uniConnect").style.backgroundColor = "red";
		document.getElementById("uniConnect").style.fontSize = "8px";
	}

	if (typeof window.okxwallet !== "undefined") {
		document.getElementById("okxConnect").textContent = "Installed";
	} else {
		document.getElementById("okxConnect").textContent = "Not Installed";
		document.getElementById("okxConnect").style.backgroundColor = "red";
		document.getElementById("okxConnect").style.fontSize = "8px";
	}

	if (typeof window.wizz !== "undefined") {
		document.getElementById("wizzConnect").textContent = "Installed";
	} else {
		document.getElementById("wizzConnect").textContent = "Not Installed";
		document.getElementById("wizzConnect").style.backgroundColor = "red";
		document.getElementById("wizzConnect").style.fontSize = "8px";
	}
});

//METAMASK
async function Connect() {
	if (window.ethereum) {
		try {
			await window.ethereum.request({ method: "eth_requestAccounts" });
			web3 = new Web3(window.ethereum);
			updateButton("Connected");
		} catch (error) {
			console.error("User denied account access");
		}
	} else {
		web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
		updateButton("Connected");
	}

	contract = new web3.eth.Contract(abi, address);
}

//okx
async function okxConnect() {
	try {
		// Request accounts
		await window.okxwallet.request({
			method: "eth_requestAccounts",
		});

		contract = new web3.eth.Contract(abi, address);
	} catch (error) {
		console.error("Error connecting to OKX Wallet:", error);
	}
}

//UNISAT
async function unisatConnect() {
	try {
		if (typeof window.unisat !== "undefined") {
			document.getElementById("uniConnect").textContent = "installed";
			await window.unisat.requestAccounts();
		}
	} catch (error) {
		if (error.code === 4001) {
			// User rejected the connection request
			console.log("User rejected the connection request.");
			// Optionally, display a message to the user explaining why access to the wallet is needed
		} else {
			// Other errors
			console.error("Error connecting to UniSat Wallet:", error);
		}
	}

	contract = new web3.eth.Contract(abi, address);
}

//wizzwalet
async function connectToWizzWallet() {
	try {
		await wizz.requestAccounts();
		console.log("Connect success");
	} catch (error) {
		console.error("Connect failed:", error);
		// Handle error, maybe display a message to the user
	}
}

async function getSwapInfo(inputAmount, isWBTCtoRUNE) {
	try {
		if (!inputAmount || isNaN(inputAmount)) {
			console.error("Invalid input amount:", inputAmount);
			return;
		}

		// console.log("Calling getSwapInfo with amount:", inputAmount, "and direction:", isWBTCtoRUNE);

		const result = await contract.methods
			.getSwapInfo(inputAmount, isWBTCtoRUNE)
			.call();
		const estimatedOutputAmount = result[0];
		const transactionFee = result[1];
		const exchangeRate = result[2];

		// console.log("Estimated Output Amount:", estimatedOutputAmount.toString());
		// console.log("Transaction Fee:", transactionFee.toString());
		// console.log("Exchange Rate:", exchangeRate.toString());

		document.getElementById("estimated-amount").value =
			estimatedOutputAmount.toString();
		document.getElementById("transaction-fee").value =
			transactionFee.toString();
		document.getElementById("exchange-rate").value = exchangeRate.toString();
	} catch (error) {}
}

async function storeSwapData(
	direction,
	amount,
	rate,
	address,
	estimatedAmount,
	transactionFee
) {
	try {
		const now = new Date();
		const pkTime = new Date(
			now.toLocaleString("en-US", { timeZone: "Asia/Karachi" })
		);

		const response = await fetch(
			"https://server-js-inky.vercel.app/api/storeSwapData",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					direction,
					amount,
					rate,
					address,
					estimatedAmount,
					transactionFee,
					timestamp: pkTime,
				}),
			}
		);
		const data = await response.json();
		console.log("Stored Swap Data:", data);
	} catch (error) {
		// console.error("Error storing swap data:", error);
	}
}

async function swapWBTCtoRUNE(wbtcAmount) {
	try {
		const accounts = await web3.eth.getAccounts();
		const connectedAddress = accounts[0];
		await contract.methods
			.swapWBTCtoRUNE(wbtcAmount)
			.send({ from: connectedAddress });
		const exchangeRate = document.getElementById("exchange-rate").value;
		const estimatedAmount = document.getElementById("estimated-amount").value;
		const transactionFee = document.getElementById("transaction-fee").value;
		await storeSwapData(
			"WBTC to RUNE",
			wbtcAmount,
			exchangeRate,
			connectedAddress,
			estimatedAmount,
			transactionFee
		);

		const amountRUNE = estimatedAmount - transactionFee;
		await updatePoolInfo(amountRUNE, wbtcAmount);
	} catch (error) {
		console.error("Error swapping WBTC to RUNE:", error);
	}
}

async function swapRUNEtoWBTC(runeAmount) {
	try {
		const accounts = await web3.eth.getAccounts();
		const connectedAddress = accounts[0];
		await contract.methods
			.swapRUNEtoWBTC(runeAmount)
			.send({ from: connectedAddress });
		const exchangeRate = document.getElementById("exchange-rate").value;
		const estimatedAmount = document.getElementById("estimated-amount").value;
		const transactionFee = document.getElementById("transaction-fee").value;
		await storeSwapData(
			"RUNE to WBTC",
			runeAmount,
			exchangeRate,
			connectedAddress,
			estimatedAmount,
			transactionFee
		);

		const amountWBTC = estimatedAmount - transactionFee;
		await updatePoolInfo(runeAmount, amountWBTC);
	} catch (error) {
		console.error("Error swapping RUNE to WBTC:", error);
	}
}

async function updatePoolInfo(runeAmount, wbtcAmount) {
	try {
		const currentPoolInfoResponse = await fetch(
			"https://server-js-inky.vercel.app/api/poolinfos"
		);
		const currentPoolInfo = await currentPoolInfoResponse.json();
		const latestPoolInfo = currentPoolInfo[currentPoolInfo.length - 1];

		let existingRuneAmount = parseFloat(latestPoolInfo.RuneChart);
		let existingWbtcAmount = parseFloat(latestPoolInfo.WbtcChart);

		runeAmount = existingRuneAmount;
		wbtcAmount = existingWbtcAmount;

		const response = await fetch(
			"https://server-js-inky.vercel.app/api/updatePoolInfo",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ runeAmount, wbtcAmount }),
			}
		);
		const data = await response.json();
		console.log("Updated Pool Info:", data);
	} catch (error) {
		console.error("Error updating pool info:", error);
	}
}

document.addEventListener("DOMContentLoaded", async () => {
	await Connect();

	const amountInput = document.getElementById("amount");
	amountInput.addEventListener("input", async function () {
		const amount = this.value;

		const fromToken = document.getElementById("from-token").value.toLowerCase();
		const toToken = document.getElementById("to-token").value.toLowerCase();

		let isWBTCtoRUNE;
		if (fromToken === "wbtc" && toToken === "rune") {
			isWBTCtoRUNE = true;
		} else if (fromToken === "rune" && toToken === "wbtc") {
			isWBTCtoRUNE = false;
		} else {
			console.error("Invalid swap direction selected");
			return;
		}

		await getSwapInfo(amount, isWBTCtoRUNE);
	});

	document
		.getElementById("swapForm")
		.addEventListener("submit", async function (event) {
			event.preventDefault();

			const swapDirection = document.getElementById("swap-direction").value;
			const amount = document.getElementById("amount").value;

			if (swapDirection === "wbtc-to-rune") {
				await swapWBTCtoRUNE(amount);
			} else if (swapDirection === "rune-to-wbtc") {
				await swapRUNEtoWBTC(amount);
			} else {
				console.error("Invalid swap direction selected");
			}
		});

	const swapDirectionSelect = document.getElementById("swap-direction");
	swapDirectionSelect.addEventListener("change", function () {
		const fromTokenInput = document.getElementById("from-token");
		const toTokenInput = document.getElementById("to-token");

		if (this.value === "wbtc-to-rune") {
			fromTokenInput.value = "WBTC";
			toTokenInput.value = "RUNE";
		} else if (this.value === "rune-to-wbtc") {
			fromTokenInput.value = "RUNE";
			toTokenInput.value = "WBTC";
		}
	});
});
