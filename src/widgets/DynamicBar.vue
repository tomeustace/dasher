<template>
  <component-shell>
    <div slot="widget">
      <h2>Dynamic Bar Chart</h2>
      <p>See documentation to get started adding your content.</p>
    </div>
  </component-shell>
</template>

<script>
/*eslint-disable */

import ComponentShell from './../components/ComponentShell';

/*widgets should be able to provide a structure for their configuration.  However they should not be concerned with how it is saved or retreived.*/
const vm = {
  props: ['id','viewname'],
  data() {
    return {
      config: [
        {id: '', title: 'endpoint'},
      ],
    };
  },
  computed: { },
  methods: { },
  components: {
    ComponentShell,
  }
};
/*eslint-disable */
export default vm;
</script>

<style> </style>
