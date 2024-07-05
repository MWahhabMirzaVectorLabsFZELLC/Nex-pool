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
			// const wallet_address = document.getElementById('addr1').textContent = connectedAddress;
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

			const targetSection = document.querySelector(
				link.getAttribute("data-section")
			);
			targetSection.classList.add("section-active");
		});
	});
});
var contract = new web3.eth.Contract(abi, address);

async function distributeDailyProfit() {
	const accounts = await web3.eth.getAccounts();
	await contract.methods.distributeDailyProfit().send({ from: accounts[0] });
}

async function withdrawExcessToBalancer(targetRuneAmount, targetWbtcAmount) {
	try {
		const accounts = await web3.eth.getAccounts();
		await contract.methods.withdrawExcessToBalancer(targetRuneAmount, targetWbtcAmount).send({ from: accounts[0] });

		const currentPoolInfoResponse = await fetch("http://127.0.0.1:3000/api/poolinfos");
		const currentPoolInfo = await currentPoolInfoResponse.json();

		const latestPoolInfo = currentPoolInfo[currentPoolInfo.length - 1]; // Assuming the latest entry is at the end

		if (!latestPoolInfo) {
			throw new Error("No pool information found.");
		}

		let updatedRuneChart = latestPoolInfo.RuneChart;
		let updatedWbtcChart = latestPoolInfo.WbtcChart;

		if (targetRuneAmount < latestPoolInfo.RuneChart) {
			let excessRUNE = latestPoolInfo.RuneChart - targetRuneAmount;
			updatedRuneChart -= excessRUNE;
		}

		if (targetWbtcAmount < latestPoolInfo.WbtcChart) {
			let excessWBTC = latestPoolInfo.WbtcChart - targetWbtcAmount;
			updatedWbtcChart -= excessWBTC;

		}

		const updatePoolInfoResponse = await fetch("http://127.0.0.1:3000/api/poolinfo", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				RuneChart: updatedRuneChart,
				WbtcChart: updatedWbtcChart,
			}),
		});

		if (!updatePoolInfoResponse.ok) {
			throw new Error(`HTTP error! Status: ${updatePoolInfoResponse.status}`);
		}

		const updatedPoolInfo = await updatePoolInfoResponse.json();
		console.log("Updated pool info:", updatedPoolInfo);
	} catch (error) {
		console.error("Error in withdrawExcessToBalancer:", error);
	}
}

async function reinvestFromBalancer(runeAmount, wbtcAmount) {
	try {
		const accounts = await web3.eth.getAccounts();
		await contract.methods.reinvestFromBalancer(runeAmount, wbtcAmount).send({ from: accounts[0] });

		const currentPoolInfoResponse = await fetch("http://127.0.0.1:3000/api/poolinfos");
		const currentPoolInfo = await currentPoolInfoResponse.json();
		const latestPoolInfo = currentPoolInfo[currentPoolInfo.length - 1];

		let existingRuneAmount = parseFloat(latestPoolInfo.RuneChart);
		let existingWbtcAmount = parseFloat(latestPoolInfo.WbtcChart);

		let updatedRuneAmount = existingRuneAmount + parseFloat(runeAmount);
		let updatedWbtcAmount = existingWbtcAmount + parseFloat(wbtcAmount);

		const response = await fetch("http://127.0.0.1:3000/api/updatePoolInfo", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				runeAmount: updatedRuneAmount,
				wbtcAmount: updatedWbtcAmount,
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const updatedPoolInfo = await response.json();
		console.log("Updated pool info:", updatedPoolInfo);
	} catch (error) {
		console.error("Error in reinvestFromBalancer:", error);
	}
}

document.getElementById("distributeProfitButton").addEventListener("click", async function () {
	await distributeDailyProfit();
});

document.getElementById("withdrawExcessForm").addEventListener("submit", async function (event) {
	event.preventDefault();
	const targetRuneAmount = document.getElementById(
		"withdrawTargetRuneAmount"
	).value;
	const targetWbtcAmount = document.getElementById(
		"withdrawTargetWbtcAmount"
	).value;
	await withdrawExcessToBalancer(targetRuneAmount, targetWbtcAmount);
});

document.getElementById("reinvestForm").addEventListener("submit", async function (event) {
	event.preventDefault();
	const runeAmount = document.getElementById("reinvestRuneAmount").value;
	const wbtcAmount = document.getElementById("reinvestWbtcAmount").value;
	await reinvestFromBalancer(runeAmount, wbtcAmount); // Correct function call
});

document.addEventListener("DOMContentLoaded", function () {
	// Fetch and display provider information
	async function fetchProviderInfo() {
		try {
			const response = await axios.get("https://serversample.vercel.app/api/providers");
			const providers = response.data;

			const providersTableBody = document.querySelector("#providersTable tbody");
			providersTableBody.innerHTML = ""; // Clear the table body before appending new rows

			providers.forEach(provider => {
				// Check if both amountWBTC and amountRUNE are not 0
				if (provider.amountWBTC !== "0" || provider.amountRUNE !== "0") {
					const row = document.createElement("tr");

					const addressCell = document.createElement("td");
					addressCell.textContent = provider.providerAddress;

					const amountWBTCCell = document.createElement("td");
					amountWBTCCell.textContent = provider.amountWBTC;

					const amountRUNCell = document.createElement("td");
					amountRUNCell.textContent = provider.amountRUNE;

					const dateCell = document.createElement("td");
					const date = new Date(provider.timestamp); // Use the correct timestamp field
					dateCell.textContent = date.toLocaleString('en-US', { timeZone: 'Asia/Karachi' }); // Format the date with time zone

					row.appendChild(addressCell);
					row.appendChild(amountWBTCCell);
					row.appendChild(amountRUNCell);
					row.appendChild(dateCell);

					providersTableBody.appendChild(row);
				}
			});
		} catch (error) {
			console.error("Error fetching providers info:", error);
		}
	}


	// Fetch and display pool information status
	async function fetchPoolInfo() {
		try {
			const response = await axios.get("https://serversample.vercel.app/api/poolinfos");
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
		const response = await fetch("https://serversample.vercel.app/api/poolinfos");
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
	// Function to fetch and display swap data
	async function fetchSwapData() {
		try {
			const response = await axios.get("https://serversample.vercel.app/api/swapData"); // Update the endpoint as needed
			const swapData = response.data;

			const swapTableBody = document.querySelector("#swapTable tbody");
			swapTableBody.innerHTML = ""; // Clear the table body before appending new rows

			swapData.forEach(data => {
				const row = document.createElement("tr");

				const directionCell = document.createElement("td");
				directionCell.textContent = data.direction;

				const amountCell = document.createElement("td");
				amountCell.textContent = data.amount;

				const rateCell = document.createElement("td");
				rateCell.textContent = data.rate;

				const addressCell = document.createElement("td");
				addressCell.textContent = data.address;

				const estimatedAmountCell = document.createElement("td");
				estimatedAmountCell.textContent = data.estimatedAmount;

				const transactionFeeCell = document.createElement("td");
				transactionFeeCell.textContent = data.transactionFee;

				const dateCell = document.createElement("td");
				const date = new Date(data.timestamp); // Use the correct timestamp field
				dateCell.textContent = date.toLocaleString('en-US', { timeZone: 'Asia/Karachi' }); // Format the date with time zone

				row.appendChild(directionCell);
				row.appendChild(amountCell);
				row.appendChild(rateCell);
				row.appendChild(addressCell);
				row.appendChild(estimatedAmountCell);
				row.appendChild(transactionFeeCell);
				row.appendChild(dateCell);

				swapTableBody.appendChild(row);
			});
		} catch (error) {
			console.error("Error fetching swap data:", error);
		}
	}

	// Initial fetches
	fetchProviderInfo();
	fetchPoolInfo();
	ChartData();
	fetchSwapData();

});
