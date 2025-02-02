function getCryptoPrices(symbolList) {
  var apiKey = "CoinMarketCap_API_Key_Here"; //Put your own coinmarketcap api key here
  var apiUrl = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=" + symbolList + "&convert=USD";
  
  var headers = {
    "X-CMC_PRO_API_KEY": apiKey,
    "Accept": "application/json"
  };
  
  try {
    var response = UrlFetchApp.fetch(apiUrl, {headers: headers});
    var responseCode = response.getResponseCode();

    if (responseCode !== 200) {
      // Log the response code and content for debugging
      Logger.log("Error: HTTP Response Code " + responseCode);
      Logger.log("Response Content: " + response.getContentText());
      return [["Error", "HTTP Response Code " + responseCode]];
    }

    var data = JSON.parse(response.getContentText());

    // Check for errors in API response
    if (data.status && data.status.error_code && data.status.error_code !== 0) {
      Logger.log("API Error: " + data.status.error_message);
      return [["API Error", data.status.error_message]];
    }

    var prices = [];
    for (var symbol in data.data) {
      var price = data.data[symbol].quote.USD.price;
      prices.push([symbol, price]);
    }

    return [["Symbol", "Price"]].concat(prices);

  } catch (e) {
    Logger.log("Exception: " + e.message);
    return [["Exception", e.message]];
  }
}
