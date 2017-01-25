<template>
  <component-shell :widget="name">
    <div slot="name">
      this no workie ;(
      <h2>My First Widget - {{cid}}</h2>
    </div>
  </component-shell>
</template>

<script>
/*eslint-disable */

import ComponentShell from './../components/ComponentShell';

const vm = {
  data() {
    return {
      name: 'Widdie',
      component: 'Add Component',
    };
  },
  props: ['cid'],
  methods: {
    addComponent() {
    },
  },
  beforecreate() {
    console.log('widget1 beforecreate');
  },
  created() { },
  beforemount() {
    console.log('widget1 bbeforemount');
  },
  mounted() { },
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
