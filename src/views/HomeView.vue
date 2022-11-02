<template>
  <div class="container text-black text-left">
    <b-row>
      <b-col cols="6">
        <b-jumbotron header="Bringing Data to the Blockchain" bg-variant="transparent" text-variant="white">
          <template #lead>
            <!-- <b-skeleton width="70%"></b-skeleton>
            <b-skeleton width="46%"></b-skeleton>
            <b-skeleton width="39%"></b-skeleton> -->
            <p>Dataverse is the protocol for building chain-agnostic hybrid smart contracts. Access data from any data source and utilize it on-chain. Build hybrid dapps such as GameFi and sybil resistant NFTs. Currently available on Klaytn BaoBab and Polygon Mumbai</p>
          </template>
        </b-jumbotron>        
      </b-col>
      <b-col></b-col>
    </b-row>
    <b-row class="bg-dark rounded border">
      <b-col>
        <b-card bg-variant="transparent" text-variant="white" class="border-0 text-center">
          <div>
            <h1>For Devs</h1>
            <p>Integrate with any data source with minimal setup. </p>
            <b-button href="https://github.com/Fluffy9/Dataverse/wiki/Integration">Integration Docs →</b-button>
          </div>
          <!-- <b-skeleton width="39%"></b-skeleton>
          <b-skeleton width="46%"></b-skeleton> -->
        </b-card>
      </b-col>
      <b-col style="border-left: solid 1px; border-right: solid 1px">
        <b-card bg-variant="transparent" text-variant="white" class="border-0 text-center">
          <div>
            <h1>For Providers</h1>
            <p>Set up data feeds, earn fees. Powered by decentralized compute protocols</p>
            <b-button href="https://github.com/Fluffy9/Dataverse/wiki/Feeds">Build a feed →</b-button>
            <!-- <b-skeleton width="39%"></b-skeleton>
            <b-skeleton width="46%"></b-skeleton> -->
          </div>
        </b-card>  
      </b-col>
      <b-col>
        <b-card bg-variant="transparent" text-variant="white" class="border-0 text-center">
          <div>
            <h1>For Keepers</h1>
            <!-- <b-skeleton width="39%"></b-skeleton>
            <b-skeleton width="46%"></b-skeleton> -->
            <p>Claim bounties from publishing data on-chain</p>
            <b-button to="/keepers">Keeper Dashboard →</b-button>
          </div>
        </b-card>
      </b-col>


    </b-row>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>