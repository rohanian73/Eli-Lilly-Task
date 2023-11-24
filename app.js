const express = require('express');
const path = require('path');
const stocks = require('./stocks');

const app = express();
app.use('/', express.static(path.join(__dirname, 'static')));

// available stocks
app.get('/stocks', async (req, res) => {
  const stockSymbols = await stocks.getStocks();
  res.send({stockSymbols});

  const stockSymbolsArr = Object.values({stockSymbols})[0];
  let stockSymbolsStr = "";

  for (let i = 0; i < stockSymbolsArr.length; i++) {
    if (i == stockSymbolsArr.length - 1) {
      stockSymbolsStr += stockSymbolsArr[i];
      break;
    }
    stockSymbolsStr += stockSymbolsArr[i] + ", ";
  }

  console.log("The available stocks are " + stockSymbolsStr + ".");
})

// data about each stock
app.get('/stocks/:symbol', async (req, res) => {
  try {
    const { params: { symbol } } = req;
    const data = await stocks.getStockPoints(symbol, new Date());
    res.send(data);

    for (let i = 0; i < data.length; i++) {
      if (i == 0) {
        console.log(req.params.symbol + ": ");
      }

      console.log(data[i].value + " — " + data[i].timestamp);

      if (i == data.length - 1) {
        console.log();
      }
    }
  }
  catch(err) {
    if (err.message.includes("Failed")) {
      let errorMessage = err.message + ". Please, try again.";
      res.send({errorMessage});

      console.log(errorMessage);
      console.log();
    } else if (err.message.includes("Unknown")) {
      let errorMessage = err.message + ". Please, enter an available stock.";
      res.send({errorMessage});

      console.log(errorMessage);
      console.log();
    }
  }

})

app.listen(3000, () => console.log('Server is running!'));
