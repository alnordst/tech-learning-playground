<template lang='pug'>
section
  h1 Authentication
  form-field(v-model='auth.consumerKey' :password='!showKeys') Consumer Key
  form-field(v-model='auth.consumerSecret' :password='!showKeys') Consumer Secret
  form-field(v-model='auth.accessToken' :password='!showKeys') Access Token
  form-field(v-model='auth.accessTokenSecret' :password='!showKeys') Access Token Secret
  form-check(v-model='showKeys') Show authentication keys
</template>

<script>
import FormField from './FormField.vue'
import FormCheck from './FormCheck.vue'

export default {
  components: {
    FormField,
    FormCheck
  },
  model: {
    prop: 'auth'
  },
  data () {
    return {
      showKeys: false
    }
  },
  props: ['auth']
}
</script>