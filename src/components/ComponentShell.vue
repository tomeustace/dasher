<template>
  <div :id="_uid" :cid="cid" class="component-shell">
    <md-toolbar v-if="show" class="md-dense">
      <md-button class="md-icon-button">
        <md-tooltip>Widget ID {{cid}}</md-tooltip>
	<!-- <md-icon @click.native="clicked()" class="md-accent">menu</md-icon> -->
	<md-icon @click.native="show = !show" class="md-accent">menu</md-icon>
      </md-button>

        <span class="md-title widget-title" style="flex: 1">{{displayName}}</span>

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
      <md-button v-if="!show" @click.native="show = !show" class="md-icon-button">
        <md-icon  class="widget-show-toolbar md-accent">menu</md-icon>
        <md-tooltip>Show Toolbar</md-tooltip>
      </md-button>
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
      show: true,
      widget: '',
      name: '',
      config: {},
      selectedConfig: [], 
      id: this._uid, 
      cid: '',
    };
  },
  computed: {
    displayName() {
      let name = this.$data.name.substring(6, this.$data.name.length);
      return name.replace(/([A-Z])/g, ' $1').trim();
    },
    configUpdate () {
      console.log('target config update ' + this.$store.state.configUpdate);
      return this.$store.state.configUpdate;
    },
  },
  methods: { 
    clicked: function clicked() {
      console.log(this);
    },
    removeComponent: function(name) {
      console.log(this.$parent.$data.name);
      //TODO fix below parent references, find cleaner way
      this.$store.dispatch('removeWidgetFromView', {name: this.$parent.$parent.$el.id, cid: this.$data.cid, widget: this.$parent.$data.name});
    },
    openDialog(name, ref) {
      //TODO passing in first instance of array only currently
      //this.$refs[ref].open(this.config.default);
      this.$refs[ref].open();
    },
    close(ref) {
      this.$refs[ref].close();
    },
  },
  beforeCreate() { },
  beforeMount() { },
  created() { },
  mounted() { 
    let index = this.$parent.$parent.$el.getAttribute('index');
    let widgetIndex = this.$parent.$el.getAttribute('index');
    console.log('ComponentShell - beforeMount index ', index);
    let widget = this.$store.state.views[index].widgets[widgetIndex];
    if(!_.isUndefined(widget)) {
      console.log('ComponentShell - mounted ', widget.cid);
      //this.$data.name = widget.name.substring(6, widget.name.length);
      this.$data.name = widget.name;
      this.$data.cid = widget.cid;
      console.log('ComponentShell mounted ' + this.$data.cid);
      let loadedConfig = this.$store.state.views[index].widgets[widgetIndex].config;
      if(!_.isUndefined(loadedConfig)) {
        //TODO BELOW SHOULD USE DEFAULT NEED TO FIX ARRAY ISSUE IN STORE
        //loaded config represents the last selection need to merge this with default config
        //this.config = loadedConfig;
        this.config = this.$parent.widgetConfig;
      } else {
        console.log('ComponentShell target widget Config ' + this.$parent.widgetConfig); 
        this.config = this.$parent.widgetConfig;
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
  max-width: 800px;
  min-height: 200px;
}
.component-shell .md-toolbar {
  background-color: white !important;
}
.widget-show-toolbar {
  margin: 15px;
}
.md-card-header {
  display: flex;
}
.md-title {
  color: #616161;
}
</style>
