const apiKey = require('./kas-credential.json');
const { getTokenPrice } = require('./getTokenPrice');
const CaverExtKAS = require('caver-js-ext-kas');
const abi = require('./abi.json');
const mock = require('./mock.json');
const chainId = 8217;
const caver = new CaverExtKAS(
  chainId,
  apiKey.accessKeyId,
  apiKey.secretAccessKey,
);

const klayAklayLp = '0xe74c8d8137541c0ee2c471cdaf4dcf03c383cd22';
const aklay = '0x74ba03198fed2b15a51af242b9c63faf3c8f4d34';
(async () => {
  const ret = await caver.kas.tokenHistory.getTransferHistoryByAccount(
    klayAklayLp,
    {
      size: 8,
      excludeZeroKlay: true,
    },
  );
  const x = await caver.kas.tokenHistory.getTransferHistoryByTxHash(
    '0x4667ebd7ea884fd8f2d958311aae8f876f0f58bf4a6d42ef2d72d07f57862ad3',
  );
  // console.log(ret.items);
  getSwapHistory(ret.items);
})();

// console.log(mock);
// ExchangePos 사용해서 filter 하면 차트 쉽게 만들 수 있을 것으로 보임 //
/*

(async () => {
  const kspContract = new caver.contract(
    abi,
    '0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654',
  );
  const x = await kspContract.getPastEvents('ExchangePos', {
    // filter: {
    //   address: '0xC6a2Ad8cC6e4A7E08FC37cC5954be07d499E7654',
    // },
    fromBlock: 67800000,
  });
  console.log(x);
})();

*/

function getSwapHistory(list) {
  let swapHistory;
  const x = list.map((t) => {
    if (t.transferType === 'klay') return;
    const ft = t.contract.symbol;
    const ftValue = parseInt(t.formattedValue);
    const hash = t.transaction.transactionHash;
    const y = list.map((e) => {
      const klay = e.transferType;
      const klayValue = Math.pow(10, -18) * parseInt(e.value);

      if (e.transactionHash === hash) {
        // console.log(
        //   `${ftValue} ${ft} is swapped to  ${klayValue} ${klay} at ${hash} `,
        // );

        return {
          ftValue: ftValue,
          ft: ft,
          klayValue: klayValue,
          klay: klay,
          hash: hash,
        };
      }
    });
    const rm = y.filter((ele) => ele !== undefined);
    // console.log(r/m);
    return rm;
  });
  const rm2 = x.flat().filter((ele) => ele !== undefined);
  const unique = rm2.filter(
    (thing, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.hash === thing.hash &&
          t.ftValue === thing.ftValue &&
          t.klayValue === thing.klayValue,
      ),
  );
  console.log(unique);
  const sumUnique = unique.map((m) => {
    const x = unique.map((r) => {
      if (m.hash === r.hash) {
        if (m.ftValue === r.ftValue && m.klayValue !== r.klayValue) {
          return {
            ftValue: m.ftValue,
            ft: m.ft,
            klayValue: m.klayValue + r.klayValue,
            klay: m.klay,
            hash: m.hash,
          };
        } else if (m.klayValue === r.klayValue && m.ftValue !== r.ftValue) {
          return {
            ftValue: m.ftValue + r.ftValue,
            ft: m.ft,
            klayValue: m.klayValue,
            klay: m.klay,
            hash: m.hash,
          };
        }
      } else {
        return r;
      }
    });

    return x.filter((ele) => ele !== undefined);
  });
  console.log('---');
  console.log(
    sumUnique.filter(
      (thing, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.hash === thing.hash &&
            t.ftValue === thing.ftValue &&
            t.klayValue === thing.klayValue,
        ),
    ),
  );

  return rm2;
}
