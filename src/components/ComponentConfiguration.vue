<template>
  <div :id="_uid" class="component-configuration">
    <md-dialog-title>Configure {{name}}</md-dialog-title>

      <md-dialog-content> 

        <!-- NEED TO UPDATE CONFIG SO ALL TABLE OPTIONS ARE ALWAYS DISPLAYED IN CONFIG WHILE
          KEEPING PREVIOUS SELECTION INTACT -->
        {{config}}
        <div v-for="conf in config">

          <md-input-container v-if="conf.type === 'select'">
            <label for="conf.name">{{conf.name}}</label>
            <md-select name="options" id="options" multiple class="save-configuration" v-model="selectedOptions">
              <md-subheader>Tables</md-subheader>
              <md-option v-for="(option, index) in conf.options" :value="option.id">{{option.id}}</md-option>
            </md-select>
          </md-input-container>

          <md-input-container class="save-configuration" v-for="field in conf">
            <label for="field.id">{{field.title}}</label>
            <md-input type="text" :field.id="field.id" v-model="field.id">
          </md-input-container>

        </div>

      </md-dialog-content>

      <!-- Cannot nest below in md-dialog-content, causes error undefined -->
      <!-- <dimension-configuration></dimension-configuration> -->

      <md-dialog-actions>
        <md-button class="md-raised md-primary" @click.native="save('configureComponentDialog')">
          <md-tooltip>Save</md-tooltip>
          <md-icon>save</md-icon>
        </md-button>
     </md-dialog-actions>
  </div>
</template>
<script>

/*eslint-disable */
import DimensionConfiguration from './DimensionConfiguration';

const vm = {
  props: ['config','name','cid'],
  data() {
    return {
      selectedOptions: [],
    };
  },
  methods: { 
    save(ref) {
      //TODO fix viewName below 
      let viewName = this.$parent.$parent.$parent.$parent.$el.id;
      let cid = this.cid;
      //set the user selected options
      this.config[0].options = this.selectedOptions;
      let config = this.config;
      this.$store.dispatch('updateWidgetConfig', {viewName, cid, config}); 
      //this.$store.state.views;
    },
  },
  components: { 
    DimensionConfiguration
  },
};

/*eslint-disable */
export default vm;
</script>

<style>
.component-configuration {
  flex-direction: row;
  margin: 10px;
  padding: 10px;
  min-width: 300px;
  min-height: 200px;
}
</style>
