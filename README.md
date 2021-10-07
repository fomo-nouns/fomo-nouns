# FOMO Nouns

This is the repository for the FOMO Nouns project, passed as part of [Nouns DAO Proposal #8](https://nouns.wtf/vote/8).

### Setup & Installation

Install the NPM packages `npm install`

You need four environment variables to pull and sign data on Rinkeby and Mainnet. Two key are for Alchemy access, which is used as the monitoring and signer. The other two keys are private keys for the account you want to used for settlement. This account must have sufficient ETH to settle if a Shark is found.

You can include them in your `~/.zshrc` or `~/.bash_profile` like:

```
export ALCHEMY_KEY_RINKEBY="<API KEY HERE>"
export ALCHEMY_KEY_MAINNET="<API KEY HERE>"
export PRIVATE_KEY_RINKEBY="0x<PRIVATE KEY HERE>"
export PRIVATE_KEY_MAINNET="0x<PRIVATE KEY HERE>"
```

**[WARNING] DO NOT PUT YOUR PRIVATE KEYS IN THE SCRIPTS!**
