var web3;
var address = "0xAe3d4732Ba724122308540B77b8fd105BA9d0fB5"; // Set your contract address here
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
];

const wallet = document.getElementById("btn");
async function Connect() {
	if (window.ethereum) {
		try {
			await window.ethereum.request({ method: "eth_requestAccounts" });
			const accounts = await window.ethereum.request({
				method: "eth_accounts",
			});
			btn.textContent = accounts[0];
			web3 = new Web3(window.ethereum);
		} catch (error) {
			console.error("User denied account access or error occurred:", error);
		}
	} else if (window.web3) {
		web3 = new Web3(window.ethereum);
	} else {
		web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
	}
}

if (typeof web3 !== "undefined") {
	web3 = new Web3(window.ethereum);
} else {
	web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
}

document.addEventListener("DOMContentLoaded", () => {
	const navLinks = document.querySelectorAll(".nav-link");
	const sections = document.querySelectorAll(".section");

	navLinks.forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			sections.forEach((section) => {
				section.classList.remove("section-active");
			});
			const targetSection = document.querySelector(link.getAttribute("data-section"));
			targetSection.classList.add("section-active");
		});
	});
});

var contract = new web3.eth.Contract(abi, address);

async function provideLiquidity(runeAmount, wbtcAmount) {
	const accounts = await web3.eth.getAccounts();
	await contract.methods.provideLiquidity(runeAmount, wbtcAmount).send({ from: accounts[0] });
	// Update pool info, chart, and provider info
	await getPoolInfo();
	// await fetchData();
	await getProviderInfo(accounts[0]);
	// Clear the input fields
	document.getElementById("provideLiquidityForm").reset();
}

async function removeLiquidity(runeAmount, wbtcAmount, lpTokenKey) {
	const accounts = await web3.eth.getAccounts();
	await contract.methods.removeLiquidity(runeAmount, wbtcAmount, lpTokenKey).send({ from: accounts[0] });
	// Update pool info, chart, and provider info
	await getPoolInfo();
	// await fetchData();
	await getProviderInfo(accounts[0]);
	// Clear the input fields
	document.getElementById("removeLiquidityForm").reset();
}

document.getElementById("provideLiquidityForm").addEventListener("submit", async function (event) {
	event.preventDefault();
	const runeAmount = document.getElementById("runeAmount").value;
	const wbtcAmount = document.getElementById("wbtcAmount").value;
	await provideLiquidity(runeAmount, wbtcAmount);
});

document.getElementById("removeLiquidityForm").addEventListener("submit", async function (event) {
	event.preventDefault();
	const runeAmount = document.getElementById("removeRuneAmount").value;
	const wbtcAmount = document.getElementById("removeWbtcAmount").value;
	const lpTokenKey = document.getElementById("lpTokenKey").value;
	await removeLiquidity(runeAmount, wbtcAmount, lpTokenKey);
});
async function getPoolInfo() {
	const poolInfo = await contract.methods.getPoolInfo().call();
	const RuneChart = parseFloat(poolInfo[0]);
	const WbtcChart = parseFloat(poolInfo[1]);

	document.getElementById("amountWbtc").innerText = "Amount of WBTC: " + WbtcChart;
	document.getElementById("amountRune").innerText = "Amount of RUNE: " + RuneChart;

	// Send data to backend to store in MongoDB
	await sendDataToBackend(RuneChart, WbtcChart);
}

async function sendDataToBackend(RuneChart, WbtcChart) {
	await fetch("http://localhost:3000/api/poolinfo", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ RuneChart, WbtcChart }),
	})
		.then((response) => {
			if (response.ok) {
				console.log("Data successfully sent to backend");
			} else {
				console.error("Error sending data to backend");
			}
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}

async function getProviderInfo(providerAddress) {
	try {
		const providerInfo = await contract.methods.getProviderInfo(providerAddress).call();
		document.getElementById("wbtc1").innerHTML = `Amount WBTC : ${providerInfo.amountWBTC}`;
		document.getElementById("rune1").innerHTML = `Amount RUNE : ${providerInfo.amountRUNE}`;
		document.getElementById("key1").innerHTML = `LpTokenKey: ${providerInfo.lpTokenKey}`;

		const amountWBTC = providerInfo.amountWBTC.toString();
		const amountRUNE = providerInfo.amountRUNE.toString();
		const lpTokenKey = providerInfo.lpTokenKey;

		const response = await fetch("http://localhost:3000/api/provider", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ providerAddress, amountWBTC, amountRUNE, lpTokenKey }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error("Failed to store provider info:", errorData.message);
		} else {
			const responseData = await response.json();
			console.log("Provider info stored successfully:", responseData);
		}
	} catch (error) {
		console.error("Error fetching provider info:", error);
	}
}

window.addEventListener("load", async function () {
	await Connect();
	const accounts = await web3.eth.getAccounts();
	const activeAccount = accounts[0];
	await getProviderInfo(activeAccount);
});












document.addEventListener("DOMContentLoaded", function () {
    // Fetch and display pool information status
    async function fetchPoolInfo() {
        try {
            const response = await axios.get("http://localhost:3000/api/poolinfos");
            const poolInfos = response.data;

            // Update the UI with pool information
            const amountRuneDiv = document.getElementById("amountRune");
            const amountWbtcDiv = document.getElementById("amountWbtc");

            const latestPoolInfo = poolInfos[poolInfos.length - 1];
            amountRuneDiv.textContent = `Amount RUNE: ${latestPoolInfo.RuneChart}`;
            amountWbtcDiv.textContent = `Amount WBTC: ${latestPoolInfo.WbtcChart}`;
        } catch (error) {
            console.error("Error fetching pool info:", error);
        }
    }

    // Fetch and display chart data
    async function ChartData() {
        const response = await fetch("http://localhost:3000/api/poolinfos");
        const data = await response.json();

        const labels = data.map((item) =>
            new Date(item.timestamp).toLocaleDateString()
        );
        const runeChartData = data.map((item) => item.RuneChart);
        const wbtcChartData = data.map((item) => item.WbtcChart);

        const ctx = document.getElementById("myLineChart").getContext("2d");
        const myLineChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "RUNES",
                        data: runeChartData,
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                        borderColor: "red",
                        borderWidth: 1,
                        fill: true,
                        tension: 0.1,
                    },
                    {
                        label: "WBTC",
                        data: wbtcChartData,
                        backgroundColor: "rgba(0, 255, 0, 0.1)",
                        borderColor: "green",
                        borderWidth: 1,
                        fill: true,
                        tension: 0.1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: "rgba(0, 0, 0, 0.1)", // Lighter black grid lines
                        },
                        ticks: {
                            color: "black", // Black tick color
                        },
                    },
                    x: {
                        grid: {
                            color: "rgba(0, 0, 0, 0.1)", // Lighter black grid lines
                        },
                        ticks: {
                            color: "black", // Black tick color
                        },
                    },
                },
                plugins: {
                    legend: {
                        labels: {
                            color: "black", // Black legend text color
                        },
                    },
                },
                responsive: true,
                // other options here
            },
        });
    }
      // Initial fetches
    fetchPoolInfo();
    ChartData();

});
