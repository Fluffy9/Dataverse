import Vue from 'vue'
import Vuex from 'vuex'
import ethereum from '@/store/ethereum'
import { ethers } from 'ethers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    networks: [
      {
        name: "Klaytn BaoBab", 
        currency: "KLAY", 
        registry: "0x50c78172549FA69e7dBB2e97D88cD4EF578248f3", 
        time: {
          "1 hour": 3600,
          "24 hours": 86400, 
          "48 hours": 172800, 
          "7 days": 604800
        }
      },
    ],

    sponsored:{
      feeds: [
        {
          id: 0, 
          name: "BasicAPI", 
          networks: ["Klaytn"], 
          desc: "Fetch any public API", 
          docs: "https://github.com/Fluffy9/Dataverse/wiki/Feeds#basicapi-feed", 
          oracle: "0x62117462Abd17359468191716fBcfd3eEa2Dd023", 
          img: "",
          href: "http://h8jmnn0fdld39b2hp1l5v0c6a8.ingress.akt.computer",
          test: "0xB20B232215a7d544cD2fC9cdE25416343CdF68d3",
        }
      ]
    },
    community: {
      feeds: []
    }
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    async getPastEvents({state}, {filter, blocks}){
      let network = state.networks.find(x => x.name == state.ethereum.network)
      let contract = new ethers.Contract(network.registry, require("@/assets/ABI/KlaytnDV.json"), state.ethereum.provider)
      return await contract.queryFilter(filter, -blocks, "latest")
    },
    async getNewRequests({state, dispatch}, blocks){
      if(!blocks){throw new Error("Invalid block range")}
      let network = state.networks.find(x => x.name == state.ethereum.network)
      let contract = new ethers.Contract(network.registry, require("@/assets/ABI/KlaytnDV.json"), state.ethereum.provider)
      let filter = contract.filters.NewRequest()
      let logs = await dispatch("getPastEvents", {filter: filter, blocks: blocks})
      logs = logs.map(x => contract.interface.parseLog({topics: x.topics, data: x.data})).map(x => x.args)
      logs = logs.map(x => {return {id: x[0], bounty: x[2], input: x[3] }})
      let DV = new state.ethereum.multicall.Contract(contract.address, require("@/assets/ABI/KlaytnDV.json"))
      let batch = logs.map(x => DV.requests(x.id))
      let data = await state.ethereum.ethcallProvider.all(batch)
      return data.map((x, i) => {return {id: logs[i].id, input: x.input, oracle: x.oracle, requestor: x.requestor, callback: x.callback, bounty: ethers.utils.formatEther(x.bounty), timestamp: x.timestamp.toNumber(), expires: x.expires.toNumber(), active: x.active}})

    },
    async fillRequest({state}, {id, signature, data}){
      if(!id || !signature || !data){throw new Error("Invalid arguments")}
      let network = state.networks.find(x => x.name == state.ethereum.network)
      let contract = new ethers.Contract(network.registry, require("@/assets/ABI/KlaytnDV.json"), state.ethereum.signer)
      return await contract.fillRequest(id, signature, data)
    },
    async newRequest({state}, {input, oracle, bounty, test}){
      if(!input || !oracle || !bounty || !test) {throw new Error("Invalid arguments")}
      let network = state.networks.find(x => x.name == state.ethereum.network)
      let contract = new ethers.Contract(test, require("@/assets/ABI/IntegrationTestKlaytn.json"), state.ethereum.signer)
      return await contract.requestData(oracle, input, bounty, {value: ethers.BigNumber.from(bounty)})
    }
  },
  modules: {
    ethereum: ethereum,
  }
})