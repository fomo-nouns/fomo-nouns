<img src="https://user-images.githubusercontent.com/84751016/139562461-a32f8887-62a5-4ca7-94ae-b7b52b97ebcf.jpg" width="50%" height="50%">

# FOMO Nouns

This is the repository for the FOMO Nouns project, passed as part of [Nouns DAO Proposal #8](https://nouns.wtf/vote/8).

### Setup & Installation

You need five environment variables to run the FOMO Nouns setup:
 - `FOMO_ALCHEMY_KEY`: API key for Alchemy used for interactions with the Ethereum network
 - `ETHERSCAN_KEY`: API key for Etherscan used to verify the deployed contract
 - `FOMO_EXECUTOR_KEY`: Private key for the Ethereum account that will execute the FOMO Nouns transactions
 - `RINKEBY_DEPLOYER_KEY`: Private key for the Ethereum account that will deploy contracts on Rinkeby (or other test nets)
 - `MAINNET_DEPLOYER_KEY`: Private key for the Ethereum account that will deploy contracts on Mainnet

The private key accounts can all be the same if desired.

The easiest way to use these is add them to your `~/.zshrc` or `~/.bash_profile` like:

```
export FOMO_ALCHEMY_KEY="<API KEY HERE>"
export ETHERSCAN_KEY="<API KEY HERE>"

export FOMO_EXECUTOR_KEY="0x<PRIVATE KEY HERE>"
export RINKEBY_DEPLOYER_KEY="0x<PRIVATE KEY HERE>"
export MAINNET_DEPLOYER_KEY="0x<PRIVATE KEY HERE>"
```

**[WARNING] DO NOT PUT YOUR PRIVATE KEYS ANYWHERE IN THE SCRIPTS!**

### Architecture
