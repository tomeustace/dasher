<template>
  <component-shell>
      <div slot="widget2" id="widget2"> </div>
      <div slot="name">
        <h2>My Second Widget</h2>
      </div>
  </component-shell>
</template>

<script>
/*eslint-disable */

import ComponentShell from './../components/ComponentShell';

const vm = {
  data() {
    return {
      name: 'Widget2',
      component: 'Add Component',
    };
  },
  methods: {
    addComponent() {
    },
  },
  beforecreate() {
    console.log('widget2 beforecreate');
  },
  created() { },
  beforemount() {
    console.log('widget2 bbeforemount');
  },
  mounted() { },
  beforeupdate() {
    console.log('widget2 bbeforeupdate');
  },
  updated() {
    console.log('widget2 bupdated');
  },
  components: {
    ComponentShell,
  }
};
/*eslint-disable */
export default vm;
</script>

<style>
#widget2 {
  background-color:yellow;
}
</style>
