<template>
    <div>
        <connect-evm class="mr-2" variant="light" :pill="true" v-if="selected == null || selected == 'EVM'" :disabled="loading"></connect-evm>
        <connect-near  variant="light" :pill="true" v-if="selected == null || selected == 'NEAR'" :disabled="loading"></connect-near>
    </div>
</template>
<script>
import ConnectEvm from './ConnectEvm.vue'
import ConnectNear from './ConnectNear.vue'

export default {
  components: { ConnectEvm, ConnectNear },
  computed: {
    loading(){
        return this.$store.getters['near/isLoading'] || this.$store.getters['ethereum/isLoading']
    },
    selected(){
        if(this.$store.getters['near/ready']) return 'NEAR'
        if(this.$store.getters['ethereum/ready']) return 'EVM'
        return null
    }
  }
}
</script>