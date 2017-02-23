<template>
    <div :id="_uid" class="component-configuration">
      <md-dialog-title>Configure {{name}}</md-dialog-title>
      <md-icon class="md-raised md-accent">settings_applications</md-icon>
      <md-dialog-content> 

        <!-- NEED TO UPDATE CONFIG SO ALL TABLE OPTIONS ARE ALWAYS DISPLAYED IN CONFIG WHILE
          KEEPING PREVIOUS SELECTION INTACT -->
        <!-- NEED TO UPDATE SELECTEDOPTINS TO BE UNIQUE FOR EACH CONF ITEM -->
        <div v-for="conf in config">

          <md-input-container v-if="conf.type === 'select'">
            <label for="conf.name">{{conf.name}}</label>
            <md-select name="options" id="options" multiple class="save-configuration" :name="conf.name" v-model="selectedOptions[conf.name]">
            <!-- <md-select name="options" id="options" multiple class="save-configuration"> -->
              <md-subheader>{{conf.name}}</md-subheader>
              <md-option v-for="(option, index) in conf.options" :value="option.id">{{option.id}}</md-option>
            </md-select>
          </md-input-container>
          <!-- selection triggers computed property currently -->
          {{selection}}

          <div v-if="selectedOptions[conf.name].length > 0"> 
            <md-subheader>Selected {{conf.name}}</md-subheader>
            <md-chips v-model="selectedOptions[conf.name]" md-static>
              <template scope="chip">{{ chip.value }}</template>
            </md-chips>
          </div>

          <md-input-container v-if="conf.type !== 'select'" class="save-configuration" v-for="field in conf">
            <label for="field.id">{{field.title}}</label>
            <md-input type="text" :field.id="field.id" v-model="field.id">
          </md-input-container>

        </div>

      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-raised md-primary" @click.native="save('configureComponentDialog')">
          <md-tooltip>Save</md-tooltip>
          <md-icon>save</md-icon>
        </md-button>
     </md-dialog-actions>

      <!-- Cannot nest below in md-dialog-content, causes error undefined -->
      <!-- <dimension-configuration></dimension-configuration> -->

</template>
<script>

/*eslint-disable */
import DimensionConfiguration from './DimensionConfiguration';

const vm = {
  props: ['config','name','cid'],
  data() {
    return {
      selectedOptions: {},
    };
  },
  computed: {
    selection: function() {
      console.log('selection ' + this.config);
      let options = {};
      _.each(this.config, function(it) {
        console.log('selection ' + it.name);
        options[it.name] = [];
      });
      this.selectedOptions = options;
    },
  },
  created: function() {
    console.log('ComponentConfiguration: created ' + this.config);
  },
  mounted: function() {
    console.log('ComponentConfiguration: mounted ' + this.config);
  },
  watch: {
    selectedOptions: function(item) {
      console.log('s');
    },
  },
  methods: { 
    save(ref) {
      //TODO fix viewName below 
      let viewName = this.$parent.$parent.$parent.$parent.$el.id;
      let cid = this.cid;
      //set the user selected options
      //this.config[0].options = this.selectedOptions;
      this.config = [];
      this.config[0] = {options: this.selectedOptions};
      let config = this.config;
      this.$store.dispatch('updateWidgetConfig', {viewName, cid, config}); 
      //event to parent to close dialog
      this.$emit('closeDialog', ref);
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
