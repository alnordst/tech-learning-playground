<template lang='pug'>
div.d-flex.flex-column(v-if='status == "ready"')
  twitter-auth(v-model='configs.authentication')
  seek-and-retweet(v-model='configs.seekAndRetweet')
  .btn-group
    button.btn.btn-success(@click='saveAll') Save All
    button.btn.btn-danger(@click='resetAll') Reset All
</template>

<script>
import axios from 'axios'
import TwitterAuth from './TwitterAuth.vue'
import SeekAndRetweet from './SeekAndRetweet.vue'

export default {
  beforeCreate: function () {
    axios.get('/raw')
    .then(response => {
      this.configs = response.data
      this.status = 'ready'
    })
  },
  components: {
    TwitterAuth,
    SeekAndRetweet
  },
  data () {
    return {
      configs: null,
      status: 'loading'
    }
  },
  methods: {
    saveAll: function() {
      axios.post('/config', {
        data: this.configs
      })
    },
    resetAll: function() {
      axios.get('/raw')
      .then(response => {
        this.configs = response.data
      })
    }
  }
}
</script>

<style>
section {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.subsection {
  margin-left: 2rem;
}
</style>