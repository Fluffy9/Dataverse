<template>
  <div class="d-inline-block">
    <div v-if="!isConnected && !loading" class="text-center">
        <b-button :variant="variant" :size="size || 'md'" :pill="pill" @click="Connect" :disabled="loading">Connect to NEAR</b-button>
    </div>
    <b-button v-else-if="!isConnected && loading" variant="dark" disabled><b-spinner></b-spinner></b-button>

    <b-button v-else-if="loading" variant="dark" disabled><b-spinner></b-spinner></b-button>
    <div v-else-if="ready" role="button" @click="$store.dispatch('near/Disconnect')">
        <b-avatar style="border: solid 2px white" alt="Ethereum blockies avatar" :src="blocky" :title="$store.state.near.user" @click="toggle()"></b-avatar>
        <b-badge variant="light" class="ml-2"><b>NEAR {{$store.state.near.network}}:</b> {{$store.state.near.user.substring(0,10)}}...</b-badge>
    </div>
    <div v-else>Error</div>
  </div>
</template>
<script>
import makeBlockie from 'ethereum-blockies-base64';
import { BIcon, BIconWallet2 } from 'bootstrap-vue'

export default {
    name: "ConnectNEAR",
    components: { BIcon, BIconWallet2 },
    props: ['size', 'variant', 'pill'],
    data(){
        return {
            dialog: false,
        }
    }, 
    methods: {
        async Connect(){
            this.$store.dispatch("near/Connect").then(result => {
            }).catch(err => {
                this.$store.dispatch("near/stopLoading")
                this.$bvToast.toast(err['message'], {
                    variant: "danger",
                    title: "Error"
                })
            })
        },
        async Disconnect(){
            this.loading = true
            this.$store.dispatch("near/Disconnect").then(result => {
            }).catch(err => {
                this.$store.dispatch("near/stopLoading")
                this.$bvToast.toast(err['message'], {
                    variant: "danger",
                    title: "Error"
                })
            })
        },
        toggle(){
            let modal = document.getElementById('dialog-default');  
            this.dialog = this.dialog ? false : true
            this.dialog ? modal.showModal() : modal.close();
        }
    },
    computed: {
        loading(){
            return this.$store.state.near.loading
        },
        isConnected(){
            return this.$store.getters['near/isConnected']
        },
        ready(){
            return this.$store.getters['near/ready']
        },
        blocky(){
            let user = this.$store.state.near.user
            if(user){
                return makeBlockie(user);
            }
            return ""
        }
    }
}

</script>