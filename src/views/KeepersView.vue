<template>
    <div class="container">
        <b-jumbotron text-variant="light" bg-variant="primary" header="🎭 Keeper Requests" lead="Publish data on-chain and recieve the bounty attached">
            <b-button href="https://github.com/Fluffy9/Dataverse/wiki/Keepers">Build a Keeper Bot →</b-button>
        </b-jumbotron>
        <div class="glassy rounded text-light shadow-sm p-4">
            <div v-if="ready">
                <b-row>
                    <b-col><h1 class="text-left">Requests from last {{options.find(x => x.value == period).text}}</h1></b-col>
                    <b-col>
                        <b-form-group class="text-right">
                            <b-form-radio-group :disabled="loading" @change="getRequests()" id="radio-group-1" v-model="period" :options="options" name="radio-options"></b-form-radio-group>
                        </b-form-group>
                    </b-col>
                </b-row>
                <br>
                <div>
                    <requests :requests="requests" :loading="loading"></requests>
                </div>
                <br>
            </div>
            <div v-else>
                <h1>Connect Your Wallet</h1>
                <br>
                <connect></connect>
            </div>
        </div>
    </div>
</template>
<script>
import Requests from "@/components/Requests.vue"
import Connect from "@/components/Connect.vue"
export default {
    components: { Requests, Connect },
    data(){
        return {
            loading: false,
            period: "1 hour",
            options: [
                {text: "1 hour", value: "1 hour"},
                {text: "24 hours", value: "24 hours"},
                {text: "48 hours", value: "48 hours"},
                {text: "7 days", value: "7 days"}
            ],
            requests: null
            // requests: [
            //     {name: "Near ID", fee: Math.random() * 1, gas: Math.random() * 1, bounty: Math.random()*5  },
            //     {name: "DumbCoin", fee: Math.random() * 1, gas: Math.random() * 1, bounty: Math.random()*5 },
            //     {name: "Oauth Connect", fee: Math.random() * 1, gas: Math.random() * 1,  bounty: Math.random()*5 },
            //     {name: "YEETverse", fee: Math.random() * 1, gas: Math.random() * 1, bounty: Math.random()*5 }
            // ]
        }
    },
    computed: {
        ready(){
            return this.$store.getters['ethereum/ready']
        }
    },
    watch: {
        ready(old, now){
            if(now){
                this.setOptions()
                this.getRequests()
            }
        },
    },
    methods: {
        setOptions(){
            let network = this.$store.state.networks.find(x => x.name == this.$store.state.ethereum.network)
            for(let i = 0; i < this.options.length; i++){
                this.options[i].value = network.time[this.options[i].value]
            }
            this.period = this.options[0].value            
        },
        getRequests(){
            this.requests = []
            this.loading = true;
            let self = this;
            this.$store.dispatch("getNewRequests", this.period).then(res => { 
                self.requests = res.map(x => {return {...x, ...{gas: 0, fee: 0}}}); 
                console.log(JSON.stringify(res))
                self.loading = false;
                this.$bvToast.toast(`Found ${res.length} requests`, {
                    title: 'Success',
                    autoHideDelay: 5000,
                    variant:"primary"
                })
            }).catch(err => {
                self.loading = false;
                this.$bvToast.toast(err['message'], {
                    title: 'Error',
                    autoHideDelay: 5000,
                    variant:"danger"
                })
            })
        },
    },
    mounted(){
        if(this.$store.getters['ethereum/ready']){
            this.setOptions()
            this.getRequests()
        }
    }
}
</script>