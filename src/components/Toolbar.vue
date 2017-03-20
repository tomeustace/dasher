<template>
  <md-toolbar id="toolbar" class="md-transparent">
    <div class="logo">
      <md-button class="md-icon-button">
        <md-icon>menu</md-icon>
      </md-button>

      <h2 class="md-title" style="">Dasher</h2>
    </div>

    <md-input-container class="view-name">
      <label>View Name</label>
      <md-input v-model="viewName"></md-input>
    </md-input-container>
    <md-button class="view-save md-raised md-primary" @click.native="saveView">
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
      this.$store.dispatch('addView', this.viewName);
    },
  },
  mounted() { },
};
/*eslint-disable */
export default vm;
</script>

<style>
#toolbar {
  -webkit-flex-direction: row;
  border-top: solid 2px blue;
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-height: 50px;
}
.add-component {
  margin-bottom: 0;
  margin-left: 50px;
  margin-right: 0;
  margin-top: 0;
}
.view-name {
  margin: 0 50px;
  min-width: 100px;
  width: auto;
}
.md-button {
  min-width: 30px !important;
}
.logo {
  align-items: center;
  display: flex;
  flex: 1;
}
</style>
