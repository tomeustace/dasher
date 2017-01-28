<template>
  <component-shell :widget="name">
    <div slot="name">
      <h2>My First Widget</h2>
      <div class="save-configuration" v-for="field in fields">
        <label for="field.id">{{field.title}}</label>
      </div>
    </div>
    <div slot="config">
      <h2>My Widget config</h2>
      <!-- TODO
        need to find way to populate fields in widgets from component shell where config data is available.
        maybe don't use slot for config CREATE NEW COMPONENT FOR CONFIG
      -->
        <md-dialog-content>
          <md-input-container class="save-configuration" v-for="field in getWidgetConfig">
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
  </component-shell>
</template>

<script>
/*eslint-disable */

import ComponentShell from './../components/ComponentShell';

const vm = {
  props: ['config','cid'],
  data() {
    return {
      fields: [
        {id: '', title: 'username'},
        {id: '', title: 'URL'},
      ],
      name: 'Widdie',
      component: 'Add Component',
    };
  },
  computed: {
    getWidgetConfig() {
    },
  },
  methods: {
    addComponent() { },
    //TODO be better to allow for save to occur in shell component
    save() {
      let cid = this.$el.getAttribute('cid');
      let viewName = this.$parent.id;
      let fields = this.fields;
      this.$store.dispatch('updateWidgetConfig', {viewName, cid, fields}); 
    },
  },
  beforecreate() {
    console.log('widget1 beforecreate');
  },
  created() {
    console.log('widget1 beforecreate');
  },
  beforemount() {
    console.log('widget1 bbeforemount');
  },
  mounted() {
    console.log('widget1 bbeforemount');
  },
  beforeupdate() {
    console.log('widget1 bbeforeupdate ' + this.test);
  },
  updated() {
    console.log('widget1 bupdated');
  },
  components: {
    ComponentShell,
  }
};
/*eslint-disable */
export default vm;
</script>

<style>
#widget1 {
  background-color:green;
}
</style>
