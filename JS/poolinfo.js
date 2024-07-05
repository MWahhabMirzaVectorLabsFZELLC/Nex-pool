document.addEventListener("DOMContentLoaded", function () {
 
    // Fetch and display pool information status
    async function fetchPoolInfo() {
        try {
            const response = await axios.get("https://final-flax-six.vercel.app/api/poolinfos");
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
        const response = await fetch("https://final-flax-six.vercel.app/api/poolinfos");
        const data = await response.json();

        const labels = data.map((item) =>
            new Date(item.timestamp).toLocaleDateString()
        );
        const runeChartData = data.map((item) => item.RuneChart);
        const wbtcChartData = data.map((item) => item.WbtcChart);

        const ctx = document.getElementById("myLineChart").getContext("2d");
       // Create a new chart instance
	myLineChart = new Chart(ctx, {
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
					grid: { color: "rgba(255, 255, 255, 0.2)" },
					ticks: { color: "white" },
				},
				x: {
					grid: { color: "rgba(255, 255, 255, 0.2)" },
					ticks: { color: "white" },
				},
			},
			plugins: {
				legend: { labels: { color: "white" } },
			},
			responsive: true,
		},
	});
    }
    
    // Initial fetches
    fetchPoolInfo();
    ChartData();

});
