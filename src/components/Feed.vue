<template>
    <div>
        <b-card bg-variant="dark" :title="feed['name'] || 'Unknown'" :img-src="feed['src'] || ''" img-alt="Image" img-top tag="article" class="mb-2">
            <b-card-text>
                {{feed['desc'] || 'Unknown'}}
            </b-card-text>
            <b-modal header-text-variant="dark" body-text-variant="dark" :id="`modal-${feed.id}`" :title="`Test ${feed.name}`" @ok="newRequest(feed.test)">
                <div>
                    <b-form-group label-cols="4" label-cols-lg="2" label="Input URL/IPFS" :label-for="`input${feed.id}`">
                        <b-form-input :id="`input${feed.id}`" :value="test.input" @input="test.input = $event.target.value"></b-form-input>
                    </b-form-group>

                    <b-form-group label-cols="4" label-cols-lg="2" label="Oracle Signer Address" :label-for="`oracle${feed.id}`">
                        <b-form-input :id="`oracle${feed.id}`" :value="feed.oracle" @input="test.oracle = $event.target.value" disabled></b-form-input>
                    </b-form-group>

                    <b-form-group label-cols="4" label-cols-lg="2" label="Bounty" :label-for="`bounty${feed.id}`">
                        <b-form-input :id="`bounty${feed.id}`" type="number" min="0" v-model="test.bounty"></b-form-input>
                    </b-form-group>
                </div>
            </b-modal>
            <b-button v-if="this.$store.getters['ethereum/ready']" v-b-modal="`modal-${feed.id}`" variant="primary">Test</b-button>
            <connect v-else variant="primary"></connect>
            <b-button class="ml-2" target="_blank" v-if="feed['docs']" :href="feed['docs']" variant="secondary">Docs</b-button>
        </b-card>
    </div>
</template>
<script>
import Connect from "@/components/Connect.vue"

export default {
    name: "feed",
    props: ["feed"],
    components: {
        Connect
    },
    data(){
        return {
            test: {
                input: this.feed.href + "/test",
                oracle: this.feed.oracle,
                bounty: 1_000_000_000_000_000_000,
            },
        }
    },
    methods: {
        newRequest(test){
            this.$store.dispatch("newRequest", {oracle: this.test.oracle, input: this.test.input, bounty: this.test.bounty.toString(), test: test})
            .then(res => {
                this.$bvToast.toast(`New Request ID: ${JSON.stringify(res)}`, {
                    title: 'Success',
                    autoHideDelay: 5000,
                    variant:"primary"
                })
            })
            .catch(err => {
                this.$bvToast.toast(err['message'], {
                    title: 'Error',
                    autoHideDelay: 5000,
                    variant:"danger"
                })
            })
        }
    },

}
</script>