// Chart

const canvas = document.getElementById('chart')
const ctx = canvas.getContext('2d')

function drawLine (start, end, style) {
  ctx.beginPath()
  ctx.strokeStyle = style || 'black'
  ctx.moveTo(...start)
  ctx.lineTo(...end)
  ctx.stroke()
}

function drawTriangle (apex1, apex2, apex3) {
  ctx.beginPath()
  ctx.moveTo(...apex1)
  ctx.lineTo(...apex2)
  ctx.lineTo(...apex3)
  ctx.fill()
}

drawLine([50, 50], [50, 550])
drawTriangle([35, 50], [65, 50], [50, 35])

drawLine([50, 550], [950, 550])
drawTriangle([950, 535], [950, 565], [965, 550])

// [50, 550] - starting point - 0 / first timestamp
// [50, 50] - ending point of stocks - 100
// [950, 550] - ending point of timestamps - last timestapm

// 950 - 50 = 900 / length of timestamp (horizontal) line

// 550 - 50 = 500 / length of stocks (vertical) line
// 550 (0) ,..., 50 (100)


// Fetch APIs

const spinner = document.querySelector(".spinner");
const checkButton = document.getElementById("checkButton");

checkButton.addEventListener("click", (e) => {
    getAvailableStocks();
    spinner.style.display = "none";
});

async function getAvailableStocks() {
    await fetch(`/stocks`, {method: "GET"})
    .then(res => res.json())
    .then(data => {
        const stocksArr = data.stockSymbols;
        let stocksMessage = "The available stocks are ";

        for (let i = 0; i < stocksArr.length; i++) {
            if (i != stocksArr.length - 1) {
                stocksMessage += stocksArr[i] + ", ";
            } else {
                stocksMessage += stocksArr[i] + ".";
            }
        }
        console.log(stocksMessage);
    });
}

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", (e) => {
    getStockData();
    spinner.style.display = "none";
});

let stockValues = [];
let stockTimestamps = [];

async function getStockData() {
    await fetch(`/stocks/${searchInput.value}`, {method: "GET"})
    .then(res => res.json())
    .then(data => {

        if (!Array.isArray(data)) {
            console.log(data.errorMessage);
        } else {
            console.log(searchInput.value + ":");

            for (let i = 0; i < data.length; i++) {
                stockValues[i] = data[i].value;
                stockTimestamps[i] = data[i].timestamp;

                console.log(stockValues[i] + " — " + stockTimestamps[i]);
            }

            // Getting Y-coordinates of stock values
            const stockValuesCoordsY = [];

            for (let i = 0; i < stockValues.length; i++) {
                const startCoordY = 550;
                let stockValue = Math.round(stockValues[i]);

                let currentCoordY = startCoordY - 5 * stockValue;
                stockValuesCoordsY[i] = currentCoordY;
            }
            // console.log(stockValuesCoordsY);

            // Getting X-coordinates of stock values
            const stockValuesCoordsX = [];

            for (let i = 0; i < stockTimestamps.length; i++) {
                const startValue = 50;
                stockValuesCoordsX[i] = startValue + 90 * i;
            }
            // console.log(stockValuesCoordsX);

            // Constructing stocks lines
            for (let i = 0; i < stockValues.length; i++) {
                if (i != stockValues.length - 1) {
                    drawLine([stockValuesCoordsX[i], stockValuesCoordsY[i]], 
                        [stockValuesCoordsX[i+1], stockValuesCoordsY[i+1]]);
                }
            }
        }

    });
}