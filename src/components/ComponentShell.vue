<template>
  <div :id="_uid" :cid="cid" class="component-shell">
    <md-toolbar class="md-dense">
      <md-button class="md-icon-button">
        <md-tooltip>Widget ID {{cid}}</md-tooltip>
	<md-icon class="md-accent">menu</md-icon>
      </md-button>

      <h2 class="md-title" style="flex: 1">{{name}}</h2>

      <md-button @click.native="openDialog(name, 'configureComponentDialog')" class="md-icon-button">
        <md-tooltip>Configure Widget</md-tooltip>
	<md-icon class="md-accent">settings</md-icon>
      </md-button>
      <md-button @click.native="removeComponent" class="md-icon-button">
        <md-tooltip>Delete Widget</md-tooltip>
	<md-icon class="md-accent">delete</md-icon>
      </md-button>
    </md-toolbar> 

    <md-card>
      <md-card-content class="widget-card-content" :widget-cid="cid">
        <slot name="widget"></slot>
      </md-card-content>
    </md-card>

    <md-dialog md-open-from="#custom" md-close-to="#custom" ref="configureComponentDialog">
      <!-- TODO tried inlining dialog as close was not working so am using an event test here -->
      <!-- <md-dialog-title>Configure {{name}}</md-dialog-title> -->
      <!-- <md-icon class="md-raised md-accent">settings_applications</md-icon> -->

      <!-- Widgets define a custom config object that is passed to the below component -->
      <component-configuration :config="config" :name="name" @closeDialog="close" :cid="cid"></component-configuration>

      <!-- <md-dialog-actions> -->
      <!--   <md-button class="md-raised md-primary" @click.native="save('configureComponentDialog')"> -->
      <!--     <md-tooltip>Save</md-tooltip> -->
      <!--     <md-icon>save</md-icon> -->
      <!--   </md-button> -->
     <!-- </md-dialog-actions> -->
    </md-dialog>

  </div>
</template>
<script>

/*eslint-disable */

import ComponentConfiguration from './ComponentConfiguration';

const vm = {
  props: ['viewname'],
  data() {
    return {
      counter: 0,
      widget: '',
      name: '',
      config: [],
      id: this._uid, 
      cid: '',
    };
  },
  methods: { 
    saveselectedoptionsnotworking(ref) {
      //TODO fix viewName below 
      let viewName = this.$parent.$parent.$el.id;
      let cid = this.cid;
      //set the user selected options
      this.config[0].options = this.selectedOptions;
      let config = this.config;
      this.$store.dispatch('updateWidgetConfig', {viewName, cid, config}); 
      console.log(ref);
      this.$refs[ref].close();
    },
    removeComponent: function(name) {
      console.log(this.$parent.$data.name);
      //TODO fix below parent references, find cleaner way
      this.$store.dispatch('removeWidgetFromView', {name: this.$parent.$parent.$el.id, cid: this.$data.cid, widget: this.$parent.$data.name});
    },
    configureComponent: function(name) {
      alert('Configure not implemented.');
    },
    openDialog(name, ref) {
      //TODO passing in first instance of array only currently
      this.$refs[ref].open(this.config);
    },
    close(ref) {
      this.$refs[ref].close();
    },
  },
  beforeCreate() { },
  created() { },
  beforeMount() {
  },
  mounted() { 
    let index = this.$parent.$parent.$el.getAttribute('index');
    //this.viewname = this.$parent.$parent.$el.getAttribute('viewname');
    let widgetIndex = this.$parent.$el.getAttribute('index');
    console.log('ComponentShell - beforeMount index ', index);
    let widget = this.$store.state.views[index].widgets[widgetIndex];
    if(!_.isUndefined(widget)) {
      console.log('ComponentShell - mounted ', widget.cid);
      this.$data.name = widget.name;
      this.$data.cid = widget.cid;
      console.log('ComponentShell mounted ' + this.$data.cid);
      let loadedConfig = this.$store.state.views[index].widgets[widgetIndex].config;
      if(!_.isUndefined(loadedConfig)) {
        //load saved config for widget
        this.config = loadedConfig;
      } else {
        //load config structure in widget
        this.config = this.$parent.widgetConfig;
        //this.config.push(this.$parent.widgetConfig);
      }
    } else {
      console.log('ComponentShell - beforeMount ERROR');
    }
  },
  beforeUpdate() { },
  updated() { },
  components: {
    ComponentConfiguration,
  }
};

/*eslint-disable */
export default vm;
</script>

<style>
.component-shell {
  flex-direction: row;
  min-width: 300px;
  max-width: 400px;
  min-height: 200px;
}
.component-shell .md-toolbar {
  background-color: white !important;
}
.md-card-header {
  display: flex;
}
h2 {
  color: #616161;
}
</style>
