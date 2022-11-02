<template>
    <div>
        <div v-if="isNullOrEmpty(requests) && loading">
            <b-row class="text-left">
                <b-col><b-skeleton></b-skeleton></b-col>
                <b-col><b-skeleton></b-skeleton></b-col>
                <b-col><b-skeleton></b-skeleton></b-col>
                <b-col><b-skeleton></b-skeleton></b-col>
                <b-col><b-skeleton></b-skeleton></b-col>
                <b-col class="text-center"><b-skeleton></b-skeleton></b-col>
            </b-row>
            <br>
            <b-card v-for="i in 3" :key="i" class="text-left text-white mb-2" bg-variant="transparent" border-variant="white">
                <b-row class="text-left">
                    <b-col><b-skeleton></b-skeleton></b-col>
                    <b-col><b-skeleton></b-skeleton></b-col>
                    <b-col><b-skeleton></b-skeleton></b-col>
                    <b-col><b-skeleton></b-skeleton></b-col>
                    <b-col><b-skeleton></b-skeleton></b-col>
                    <b-col class="text-center"><b-skeleton></b-skeleton></b-col>
                </b-row>
            </b-card>
        </div>
        <div v-else-if="isNullOrEmpty(requests) && !loading">
            <b-img class="mx-auto" fluid style="width: 20%; opacity: .5;" :src="require('@/assets/undraw_no_data.svg')"></b-img>
            <br>
            <p class="text-muted">No Data</p>
        </div>
        <div v-else>
            <b-row class="text-left">
                <b-col>ID</b-col>
                <b-col>Expires at</b-col>
                <b-col>Bounty</b-col>
                <!-- <b-col>Estimated Net Profit</b-col> -->
                <b-col class="text-center">Actions</b-col>
            </b-row>
            <br>
            <b-card v-for="request in requests" :key="request.id" class="text-left text-white mb-2" border-variant="white" bg-variant="transparent" :style="request.active && (Date.now() < new Date(request.expires*1000)) ? 'opacity:1' : 'opacity:0.25'">
                <b-row>
                    <b-col cols="2"><h4 style="text-overflow: ellipsis; overflow: hidden; width: calc(100%); display: inline-block; white-space:nowrap">{{request.id}}</h4></b-col>
                    <b-col>{{(new Date(request.expires * 1000)).toLocaleString()}}</b-col>
                    <b-col>{{request.bounty.toLocaleString()}} {{currency}}</b-col>
                    <!-- <b-col><b-badge show :variant="request.bounty - request.fee - request.gas > 0 ? 'success' : 'danger'">{{request.bounty - request.fee - request.gas > 0 ? "+" : "-"}}${{(request.bounty - request.fee - request.gas).toLocaleString()}}</b-badge> ({{currency}})</b-col> -->
                    <b-col class="text-right"><b-button v-b-modal="`modal-${request.id}`" :variant="request.bounty - request.fee - request.gas > 0 ? 'success' : 'danger'" :disabled="request.bounty - request.fee - request.gas < 0">{{request.bounty - request.fee - request.gas > 0 ? "Execute" : "Execute"}}</b-button></b-col>
                    <b-modal header-text-variant="dark" body-text-variant="dark" :id="`modal-${request.id}`" :title="`Fill Request`" @ok="fillRequest(request.id)">
                        <div>
                            <b-form-group label-cols="4" label-cols-lg="2" label="Request ID" :label-for="`RequestID-${request.id}`">
                                <b-form-input :id="`RequestID-${request.id}`" disabled :value="request.id"></b-form-input>
                            </b-form-group>

                            <b-form-group label-cols="4" label-cols-lg="2" label="Oracle Signature" :label-for="`Signature-${request.id}`">
                                <b-form-input :id="`Signature-${request.id}`" v-model="signature"></b-form-input>
                            </b-form-group>

                            <b-form-group label-cols="4" label-cols-lg="2" label="Data" :label-for="`Data-${request.id}`">
                                <b-form-input :id="`Data-${request.id}`" v-model="data"></b-form-input>
                            </b-form-group>
                        </div>
                    </b-modal> 
                </b-row>
            </b-card>
        </div>
    </div>
</template>
<script>
export default {
    props: ["requests", "loading"],
    data(){
        return {
            signature: "",
            data: "",
        }
    },
    methods: {
        fillRequest(id){
            let self = this;
            this.$store.dispatch("fillRequest", {id: id, signature: this.signature, data: this.data}).then(res => {
                this.$bvToast.toast(`Request filled`, {
                    title: 'Success',
                    autoHideDelay: 5000,
                    variant:"primary"
                })
            }).catch(err => {
                this.$bvToast.toast(err['message'], {
                    title: 'Error',
                    autoHideDelay: 5000,
                    variant:"danger"
                })
            })
        },
        isNullOrEmpty(arr){
            if(!arr) return true;
            if(!Array.isArray(arr)) return true;
            if(arr.length == 0) return true;
        }
    },
    computed: {
        currency(){
            return this.$store.state.networks.find(x => x.name == this.$store.state.ethereum.network).currency
        }
    }
}
</script>