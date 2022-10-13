<template>
    <div class="container">
        <b-jumbotron text-variant="light" bg-variant="primary" header="⛓ Feeds" lead="List of active data feeds">
        </b-jumbotron>
        <div class="glassy rounded shadow-sm p-4">
            <div>
                <h1 class="text-left">Sponsored Feeds</h1>
                <p class="text-muted text-left">Feeds hosted by Dataverse</p>
                <hr>
                <div v-if="sponsoredFeeds.length > 0">
                    <b-row v-for="row in Math.ceil(sponsoredFeeds.length / 3)" :key="row">
                        <b-col cols="4" v-for="feed in sponsoredFeeds.slice(3 * (row - 1), 3 * row)" :key="feed.id">
                            <feed :feed="feed"></feed>
                        </b-col>
                    </b-row>
                </div>
                <div v-else>
                    <b-img class="mx-auto" fluid style="width: 20%; opacity: .5;" :src="require('@/assets/undraw_no_data.svg')"></b-img>
                    <br>
                    <p class="text-muted">No Data</p>
                </div>
                <br>
                <h1 class="text-left">Community Feeds</h1>
                <p class="text-muted text-left">Feeds hosted by the community</p>
                <hr>
                <div v-if="communityFeeds.length > 0">
                    <b-row v-for="row in Math.ceil(communityFeeds.length / 3)" :key="row">
                        <b-col cols="4" v-for="feed in communityFeeds.slice(3 * (row - 1), 3 * row)" :key="feed">                            <connect v-if="!this.$store.getters['ethereum/ready']"></connect>
                            <feed :feed="feed"></feed>
                        </b-col>
                    </b-row>
                </div>
                <div v-else>
                    <b-img class="mx-auto" fluid style="width: 20%; opacity: .5;" :src="require('@/assets/undraw_no_data.svg')"></b-img>
                    <br>
                    <p class="text-muted">No Data</p>
                </div>
            </div>
            <br>
        </div>
    </div>
</template>
<script>
import Feed from "@/components/Feed.vue"
export default {
    components: {
        Feed,
    },
    data(){
        return {
            row: 3
        }
    },
    computed: {
        sponsoredFeeds(){
            return this.$store.state.sponsored.feeds
        },
        communityFeeds(){
            return this.$store.state.community.feeds
        }
    }
}
</script>