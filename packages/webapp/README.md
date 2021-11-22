# Setup

Create a `.env` file in the `packages/webapp` folder with the following variables defined:

```
REACT_APP_CHAIN_NAME="rinkeby"
REACT_APP_PROVIDER_NAME="alchemy"
REACT_APP_PROVIDER_KEY="<PROJECT_KEY_HERE>"
REACT_APP_WEB_SOCKET="wss://<FOMO_WEBSOCKET_URL_HERE>"
REACT_APP_ETHERSCAN_API_KEY="<ETHERSCAN_API_KEY_HERE>"
```

# Running Locally

First, install all the required packages with `npm install`.

Then from the project director, run one of the following commands:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
