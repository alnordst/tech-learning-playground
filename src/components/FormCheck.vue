<template lang='pug'>
.form-check
  label.form-check-label
    input.form-check-input(type='checkbox' :checked='value' @change='$emit("input", $event.target.checked)')
    slot
</template>

<script>
module.exports = {
  props: ['value']
}
</script>