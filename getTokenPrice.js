const axios = require('axios');
const apiEndPoint = 'https://api-cypress.scope.klaytn.com/v1/accounts';
const getTokenPrice = async (lpContract) => {
  const tokenInfo = await axios
    .get(`${apiEndPoint}/${lpContract}/balances`)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.result.length > 1) {
        const amountA = parseFloat(data.result[0].amount);
        const tokenA = data.result[0].tokenAddress;
        const decimalA = data.tokens[tokenA].decimals;
        const amountB = parseFloat(data.result[1].amount);
        const tokenB = data.result[1].tokenAddress;
        const decimalB = data.tokens[tokenB].decimals;
        return [
          {
            symbol: data.tokens[tokenA].symbol,
            balance: Math.pow(0.1, decimalA) * amountA,
          },
          {
            symbol: data.tokens[tokenB].symbol,
            balance: Math.pow(0.1, decimalB) * amountB,
          },
        ];
      } else {
        const amountA = parseFloat(data.result[0].amount);
        const tokenA = data.result[0].tokenAddress;
        const decimalA = data.tokens[tokenA].decimals;

        const klayBalance = await axios
          .get(`${apiEndPoint}/${lpContract}`)
          .then((res) => res.data)
          .then((data) => {
            const amount = parseFloat(data.result.balance);
            const decimal = 18;
            return Math.pow(0.1, decimal) * amount;
          });
        return [
          {
            symbol: data.tokens[tokenA].symbol,
            balance: Math.pow(0.1, decimalA) * amountA,
          },
          { symbol: 'klay', balance: klayBalance },
        ];
      }
    });
  const swapRate = tokenInfo[0].balance / tokenInfo[1].balance;
  //   return `1 ${tokenInfo[1].symbol} is ${swapRate.toFixed(4)} ${
  //     tokenInfo[0].symbol
  //   } `;
  return swapRate.toFixed(4);
};

module.exports = { getTokenPrice };
