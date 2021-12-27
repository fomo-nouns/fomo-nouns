const { w3cwebsocket } = require('websocket');
const dayjs = require('dayjs');

// Websocket Parsing & Sending Message
const blockId = 42;
const chainName = 'mainnet';
const alchemyKey = process.env.ALCHEMY_API_KEY;

var blockSubscription = '0x0', lastTime = 0;

const parseMessage = (msg) => {
  try {
    const data = JSON.parse(msg.data);
    if (data?.params?.subscription === blockSubscription) {
      return data.params.result;
    } else if (data.id === blockId) {
      blockSubscription = data.result;
    }
  } catch(e) {
    console.log('Error parsing Alchemy websocket message');
    console.log(e);
  }
}

const newBlockSubscriptionRequest = JSON.stringify({
  "jsonrpc":"2.0",
  "id": blockId,
  "method": "eth_subscribe",
  "params": ["newHeads"]
});

const handleMessage = (msg) => {
  let data = parseMessage(msg);

  if (!data) return; // Not a new block notification

  const blockNumber = Number(data.number); // Convert from hex
  
  const blockHash = data.hash;
  const blockHashStr = `${blockHash.slice(0,5)}...${blockHash.slice(blockHash.length-3)}`;

  const time = new Date();
  const timeStr = dayjs(time).format('HH:MM:ss.SSS');
  const timeDiff = lastTime ? time - lastTime : '-';

  console.log(`${blockNumber} | ${timeStr} | ${blockHashStr} | ${timeDiff}`);

  lastTime = time;
}


/**
 * Connect and Run Websocket
 */
async function main() {
  console.log(`wss://eth-${chainName}.alchemyapi.io/v2/${alchemyKey}`);
  const socket = new w3cwebsocket(`wss://eth-${chainName}.alchemyapi.io/v2/${alchemyKey}`);  

  socket.onopen = () => {
    console.log('🟢 Websocket connected...');
    socket.send(newBlockSubscriptionRequest);
    console.log('blockNum | receivedTime |  blockHash  | msΔ ');
  };
  
  socket.onclose = () => console.log('... Websocket closed 🛑');
  
  socket.onmessage = handleMessage;
}
main();