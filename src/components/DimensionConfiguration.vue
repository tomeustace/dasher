<template>
    <md-input-container>
      <label for="tables">Tables</label>
      <md-select name="tables" id="tables" multiple v-model="selectedTables">
        <md-subheader>Tables</md-subheader>
        <!-- <md-option v-for="table in tables" value="table">{{table}}</md-option> -->
        <md-option v-for="table in tables" value="table">{{table}}</md-option>
      </md-select>
    </md-input-container>
</template>
<script>

/*eslint-disable */
const vm = {
  props: ['config'],
  data() {
    return {
      selectedTables: [],
      tables: [],
    };
  },
  mounted() {
    this.$http.get('http://localhost:8080/myapp/myresource/1/TableNames').then(response => {
      this.tables = response.body.split(',');
    }, response => {
      console.log('error');
    });
  },
};

/*eslint-disable */
export default vm;
</script>

<style>
</style>
