<template>
  <v-data-table
    items="data"
    hide-actions
    class="elevation-1"
    select-all
  ></v-data-table>
</template>

<script>
export default {
  name: "tableau",
  props: {
    data() {
      return { type: Array, default: [] };
    }
  }
};
</script>

<style lang="scss" scoped></style>
