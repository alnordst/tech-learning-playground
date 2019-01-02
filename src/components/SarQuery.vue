<template lang='pug'>
.card
  .card-body(v-if='query!=null')
    form-field(v-model='query.term') Query Term
    button.btn.btn-outline-danger(@click='$emit("remove-query", query)') Remove Query
</template>

<script>
import FormField from './FormField.vue'
import FormCheck from './FormCheck.vue'

export default {
  created: function() {
    if(!("term" in this.query))
      this.$emit("remove-query", query)
  },
  components: {
    FormField,
    FormCheck
  },
  model: {
    prop: 'query'
  },
  props: ['query']
}
</script>

<style>
.card{
  margin: 1rem 0 1rem 0rem;
}
</style>