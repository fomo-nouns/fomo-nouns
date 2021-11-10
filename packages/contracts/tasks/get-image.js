/**
 * Get the Nouns SVG Image
 */
task("get-image", "Gets the image for a given Nound ID")
  .addParam("noun", "ID of the Noun to place a bid on")
  .setAction(async (taskArgs, hre) => {
    const network = hre.network.name;
    const alchemy = getAlchemy(network);

    const nounsDescriptor = new hre.ethers.Contract(address.nounsDescriptor[network], abi.nounsDescriptor, alchemy);
    const nounsToken = new hre.ethers.Contract(address.nounsToken[network], abi.nounsToken, alchemy);

    const seed = await nounsToken.seeds(taskArgs.noun);
    
    console.log(`Noun #${taskArgs.noun} Seed:`);
    console.log(seed);

    const base64svg = await nounsDescriptor.generateSVGImage(seed);
    let svgHtml = `<img src="data:image/svg+xml;base64,${base64svg}"/>`;

    fs.writeFileSync(`img/noun${taskArgs.noun}.html`, svgHtml, (err) => {
        if (err) throw err;
    });
  });