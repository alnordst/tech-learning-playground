<template lang='pug'>
.form-group
  label
    slot
  input.form-control(:value='value' @input='$emit("input", $event.target.value)' :type='[password ? "password" : "text"]')
  small.form-text.text-muted(v-show='subtext') {{ subtext }}
</template>

<script>
module.exports = {
  props: ['value', 'subtext', 'password']
}
</script>