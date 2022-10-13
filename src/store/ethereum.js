
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
const { providers, Wallet, ethers, BigNumber } = require("ethers");
const multicall = require('ethers-multicall');

const ethereum = {
    namespaced: true,
    state: () => ({
        loading: false,
        web3Modal: null,
        provider: null,
        network: null,
        signer: null,
        user: null,  
        multicall: null,
        ethcallProvider: null,
        supportedNetworks: [{"Klaytn BaoBab": 1001}],
        multicallAddresses: {"Klaytn BaoBab": "0x40643B8Aeaaca0b87Ea1A1E596e64a0e14B1d244"},
        //contract: markRaw(new ethers.Contract("0x503cdba19c484fc4aec22f0e8f3dc37a5c327c27", require("../../../ABI/Babysitter.json"), new providers.JsonRpcProvider({ url: RPC }, CHAIN_ID))),
        send: async function(tx, provider){
            await provider.send('eth_sendTransaction',[{from: tx.from, to: tx.to, data: tx["data"], value: tx["value"]}])
        },
    }),
    mutations: {
        setEthCallProvider(state, payload){
            state.ethcallProvider = payload
        },
        setMulticall(state, payload){
            state.multicall = payload
        },
        setWeb3Modal(state, payload){
            state.web3Modal = payload //markRaw(payload)
        },
        setSigner(state, payload){
            state.signer = payload //markRaw(payload)
        },
        setProvider(state, payload){
            state.provider = payload //markRaw(payload)
        },
        setNetwork(state, payload){
            state.network = payload 
        },
        setUser(state, payload){
            state.user = payload
        }, 
        setLoading(state, payload){
            state.loading = payload
        }
    },
    actions: {
        async Connect({ state, commit }) {
            commit('setLoading', true)
            const providerOptions = {
                walletconnect: {
                    package: WalletConnectProvider, // required
                    options: {
                        infuraId: "INFURA_ID" // required
                    }
                }
            };
            const web3Modal = new Web3Modal({
                cacheProvider: true, // optional
                providerOptions // required
            });
      
            const provider = new providers.Web3Provider(await web3Modal.connect());
            const signer = provider.getSigner();
            let chainId = (await provider.getNetwork()).chainId
            let network = state.supportedNetworks.find(x => Object.values(x)[0] === chainId)
            network = network == undefined ? undefined : Object.keys(network)[0]
            multicall.setMulticallAddress(chainId, state.multicallAddresses[network])
            let ethcallProvider = new multicall.Provider(provider, chainId);
            console.log(network)
            commit('setSigner', signer)
            commit('setUser', await signer.getAddress())
            commit('setProvider', provider)
            commit('setNetwork', network)
            commit('setWeb3Modal', web3Modal)
            commit('setLoading', false)
            commit('setMulticall', multicall)
            commit('setEthCallProvider', ethcallProvider)
            //commit('setContract', markRaw(new ethers.Contract("0x503cdba19c484fc4aec22f0e8f3dc37a5c327c27", require("../../../ABI/Babysitter.json"), signer)))
        },
        async Disconnect({ state, commit }) {
            commit('setLoading', true)
            await state.web3Modal.clearCachedProvider();
            commit('setSigner', null)
            commit('setProvider', null)
            commit('setNetwork', null)
            commit('setLoading', false)
            window.location.reload();
        },
        stopLoading({commit}){
            commit('setLoading', false)
        }
    },
    getters: {
        isLoading(state){
            return state.loading
        },
        isConnected(state){
            return state.signer ? true : false
        },
        isCorrectNetwork(state){
            return state.supportedNetworks.some(x => Object.keys(x)[0] == state.network) ? true : false
        },
        ready(state){
            return state.signer && state.supportedNetworks.some(x => Object.keys(x)[0] == state.network) ? true : false
        }
    }
}
export default ethereum