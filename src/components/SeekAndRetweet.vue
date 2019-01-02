<template lang='pug'>
section
  h1 Seek and Retweet
  form-field(v-model='sar.frequency' subtext='Use a cron schedule expression') Frequency
  //form-check(v-model='enabled') Enabled
  div.subsection
    div(v-for='(query, index) in sar.queries')
      sar-query(v-model='sar.queries[index]' @remove-query='removeQuery')
    button.btn.btn-primary(@click='addQuery') Add Query
</template>

<script>
import FormField from './FormField.vue'
import FormCheck from './FormCheck.vue'
import SarQuery from './SarQuery.vue'

export default {
  created: function() {
    for(let field of ["frequency"])
      if(!(field in this.sar))
        this.$parent.configs.seekAndRetweet[field] = ""
    for(let arr of ["queries"])
      if(!(arr in this.sar))
        this.$parent.configs.seekAndRetweet[arr] = []
  },
  components: {
    FormField,
    FormCheck,
    SarQuery
  },
  model: {
    prop: 'sar'
  },
  props: ['sar'],
  methods: {
    addQuery: function() {
      this.$parent.configs.seekAndRetweet.queries.push({
        term: ''
      })
    },
    removeQuery: function(queryToRemove) {
      let indexToRemove = null;

      this.sar.queries.forEach(function(query, index) {
        if (query === queryToRemove) {
          indexToRemove = index
          return
        }
      })

      if (indexToRemove != null)
        this.$parent.configs.seekAndRetweet.queries.splice(indexToRemove, 1)
    }
  }
}
</script>