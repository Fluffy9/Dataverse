# Dataverse

* [contracts](https://github.com/Fluffy9/Dataverse-Contracts)
* [server](https://github.com/Fluffy9/Dataverse-BasicAPI-Akash)
* [documentation](https://github.com/Fluffy9/Dataverse/wiki)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Inspiration
I originally wanted to build a project bridging NFT data and Defi. In doing research into that, I realized that:  
* There is almost nothing available on Aurora (Chainlink still isn't available)
* There's even less available on Near
* Neither are focusing on anything other than price feeds for the most popular tokens. 
Building an oracle is hard to do well, and a big point of failure from a security perspective. Instead of hacking a half-baked solution for a single project, I decided to focus on building developer tooling that makes the oracle problem easier/more transparent/more secure for everyone. 

## What it does

Dataverse protocol is essentially an economy around gathering, consuming and publishing data on-chain. It is available on both Aurora Testnet and Near Mainnet. Developers can use it today to integrate any API data into their smart contracts. This is particularly useful for GameFi and NFTs projects (main focus). It could also be a foundation for Defi projects who are underserved by the current price feed oracles. 

There's 3 categories of participants:
* Devs: For developers looking to integrate off-chain data into their smart contracts
* Data Providers: For users, or developers who have data feeds that others would want to consume 
* Keepers: Independent users/bot operators who compete to publish data on-chain for a bounty

This application design and focus on a separation of concerns improves the quality of service. Everyone is able to work together in a mutually beneficial way. It also allows it to work cross chain pretty easily as Data providers and Keepers won't require special effort of the protocol to migrate. 

Currently the only Data provider is Dataverse itself with our BasicAPI feed (fetches any public API data). 

Documentation is provided for Devs to integrate

A Keeper UI is provided for users to try out. Bot operators will quickly make this obsolete however

## How we built it

The core contract of this project is the DVRegistry. It allows anyone to submit a request for specific data, holds the bounty for filling this request, and triggers a callback function when the request is filled.

The BasicAPI provider is a small ExpressJS server that fetches data and returns the result + a signature. Keepers are able to use this to publish the data to the DVRegistry and fill the request, in exchange for the bounty. Because the DVRegistry contract is able to validate the signature, we can be certain that the Keepers aren't tampering with the data. The server is hosted on Akash network for further decentralization.

The Near integration isn't on feature parity with the EVM version yet due to being unable to validate signatures on-chain. Instead, there's another small server implementation of BasicAPI that simply waits for new requests and publishes it on-chain itself. This replaces the role of Keepers for now

## Challenges we ran into

It doesn't seem to be possible/practical to validate a signature on-chain on Near right now. We tried to work through it with Near office hours support and we reached the conclusion that I'd need to try something else until that's available. 

## Accomplishments that we're proud of



## What we learned

I learned to use Near's JS SDK. It was pretty intuitive and well documented mostly so that was fun. 

## What's next for Dataverse

* There's a lot of developers building projects that are looking for this type of solution and it's ready to use today. I would like to get an audit done and to start building a developer community around the project. The more developers I onboard, the more incentive there is for independent developers to build Keeper bots instead of just using the UI. The more Keeper bots, the faster requests get filled leading to a better experience for all.  

* I think there is also a lot of work that can be done on standardizing data providers. I would like to do more examples and documentation on building a new data feed for different use-cases. These could include data sources that require authentication or payment. I would also want to encourage data providers to provide the source code for their feeds to build trust. 

* I think it would be cool to eventually build infrastructure for price feeds. Data aggregation was just out of scope for this project. 

