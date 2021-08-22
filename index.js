const apiKey = require('./kas-credential.json');
const { getTokenPrice } = require('./getTokenPrice');
const CaverExtKAS = require('caver-js-ext-kas');
const chainId = 8217;
const caver = new CaverExtKAS(
  chainId,
  apiKey.accessKeyId,
  apiKey.secretAccessKey,
);
const abi = require('./abi.json');

(async () => {
  const myContract = new caver.klay.Contract(
    abi,
    '0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654',
  );
  await myContract.getPastEvents(
    'ExchangePos',
    {
      // filter: {},
      //필터링이 안되지 왜
      // indexed parameter가 아니라서!
      fromBlock: 67915000,
      toBlock: 'latest',
    },
    function (err, events) {
      console.log(
        events.filter(
          (e) =>
            e.returnValues.tokenA ===
              '0xF4546E1D3aD590a3c6d178d671b3bc0e8a81e27d' ||
            e.returnValues.tokenB ===
              '0xF4546E1D3aD590a3c6d178d671b3bc0e8a81e27d',
        ),
      );
    },
  );
})();
