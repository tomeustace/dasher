<template>
  <div :id="_uid" class="component-configuration">
    <md-dialog-title>Configure {{name}}</md-dialog-title>
      <md-dialog-content>
        <md-input-container class="save-configuration" v-for="field in config">
          <label for="field.id">{{field.title}}</label>
          <md-input type="text" :field.id="field.id" v-model="field.id">
        </md-input-container>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-raised md-primary" @click="save('configureComponentDialog')">
          <md-tooltip>Save</md-tooltip>
          <md-icon>save</md-icon>
        </md-button>
     </md-dialog-actions>
  </div>
</template>
<script>

/*eslint-disable */
const vm = {
  props: ['config','name','cid'],
  data() {
    return { };
  },
  methods: { 
    save(ref) {
      //TODO fix viewName below 
      let viewName = this.$parent.$parent.$parent.$parent.$el.id;
      let cid = this.cid;
      let config = this.config;
      this.$store.dispatch('updateWidgetConfig', {viewName, cid, config}); 
      this.$emit('configUpdate');
    },
  },
};

/*eslint-disable */
export default vm;
</script>

<style>
.component-configuration {
  flex-direction: row;
  min-width: 300px;
  max-width: 400px;
  min-height: 200px;
}
</style>
