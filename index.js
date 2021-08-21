const apiKey = require('./kas-credential.json');
const { getTokenPrice } = require('./getTokenPrice');
const CaverExtKAS = require('caver-js-ext-kas');
const chainId = 8217;
const caver = new CaverExtKAS(
  chainId,
  apiKey.accessKeyId,
  apiKey.secretAccessKey,
);
const query = {
  // kind: [caver.kas.tokenHistory.queryOptions.kind.NFT],
  size: 1,
  // range: '1593529200,1599145200',
  //   caFilter: '0xbbe63781168c9e67e7a8b112425aa84c479f39aa',
};
(async () => {
  const result = await caver.kas.tokenHistory.getTransferHistoryByAccount(
    '0x1527ac4118a56bd17a5136d73d3999c6b7f8d0d1',
    query,
  );
  console.log(result.items[0].transaction);
  const x = await caver.kas.tokenHistory.getTransferHistoryByTxHash(
    result.items[0].transactionHash,
  );
  //   console.log(result);
  //   console.log(x.items);
})();
