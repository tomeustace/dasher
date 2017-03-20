<template>
  <md-toolbar id="toolbar" class="md-transparent">
    <div class="logo">
      <md-button class="md-icon-button">
        <md-icon>menu</md-icon>
      </md-button>

      <h2 class="md-title" style="">Dasher</h2>
    </div>

    <md-input-container class="save-component">
      <label>View Name</label>
      <md-input v-model="viewName"></md-input>
    </md-input-container>
    <md-button class="md-raised md-primary" @click.native="saveView">
      <md-tooltip>Add View</md-tooltip>
      <md-icon>add</md-icon>
    </md-button>
      <!-- <md-tooltip>Configuration</md-tooltip> -->
      <!-- <md-icon @click.native="changeTheme" class="md-raised md-accent">settings</md-icon> -->
  </md-toolbar>
</template>
<script>

const vm = {
  data() {
    return {
      viewName: '',
    };
  },
  methods: {
    saveView() {
      console.log('Toolbar: saveView');
      this.$store.dispatch('addView', this.viewName);
      //bus.$emit('view.save', this.viewName);
    },
  },
  mounted() {
   return 'mounted'; 
  },
};
/*eslint-disable */
export default vm;
</script>

<style>
#toolbar {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  flex-direction: row;
  justify-content: space-between;
  border-top: solid 2px blue;
  max-height: 50px;
}
.add-component {
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 50px;
  margin-right: 0;
}
.save-component {
  margin: 0 50px;
  width: auto;
  min-width: 100px;
}
.md-button {
  min-width: 30px !important;
}
.logo {
  display: flex;
  flex: 1;
  align-items: center;
}
</style>
