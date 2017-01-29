<template>
  <div :id="_uid" :cid="cid" class="component-shell">
    <md-toolbar class="md-dense">
      <md-button class="md-icon-button">
        <md-tooltip>Widget ID {{cid}}</md-tooltip>
	<md-icon class="md-accent">menu</md-icon>
      </md-button>

      <h2 class="md-title" style="flex: 1">{{name}}</h2>

      <md-button @click="openDialog(name, 'configureComponentDialog')" class="md-icon-button">
        <md-tooltip>Configure Widget</md-tooltip>
	<md-icon class="md-accent">settings</md-icon>
      </md-button>
      <md-button @click="removeComponent" class="md-icon-button">
        <md-tooltip>Delete Widget</md-tooltip>
	<md-icon class="md-accent">delete</md-icon>
      </md-button>
    </md-toolbar> 

    <md-card>
      <md-card-content class="widget-card-content">
        <slot name="widget"></slot>
      </md-card-content>
    </md-card>

    <md-dialog md-open-from="#custom" md-close-to="#custom" ref="configureComponentDialog">
        <component-configuration :config="config" :name="name" :cid="cid"></component-configuration>
      <!-- <p v-model="config">{{config}}</p> -->
      <!-- create this component -->
      <!-- <widget-config :config="config"></widget-config> -->
      <!-- <slot :config="config" name="config"></slot> -->
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
      config: '',
      id: this._uid, 
      cid: '',
    };
  },
  methods: { 
    removeComponent: function(name) {
      console.log(this.$parent.$data.name);
      //TODO fix below parent references, find cleaner way
      this.$store.dispatch('removeWidgetFromView', {name: this.$parent.$parent.$el.id, cid: this.$data.cid, widget: this.$parent.$data.name});
    },
    configureComponent: function(name) {
      alert('Configure not implemented.');
    },
    save(ref) {
      let cid = this.$el.getAttribute('cid');
      let viewName = this.$parent.$parent.$el.id;
      let config = this.config;
      this.$store.dispatch('updateWidgetConfig', {viewName, cid, config}); 
      this.$refs[ref].close();
    },
    openDialog(name, ref) {
      this.$refs[ref].open(this.config);
    },
    closeDialog(ref) {
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
      console.log('ComponentShell - beforeMount ', widget.cid);
      this.$data.name = widget.name;
      this.$data.cid = widget.cid;
      let loadedConfig = this.$store.state.views[index].widgets[widgetIndex].config;
      if(!_.isUndefined(loadedConfig)) {
        //load saved config for widget
        this.config = loadedConfig;
      } else {
        //load config structure in widget
        this.config = this.$parent.config;
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
