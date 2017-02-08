<template>
  <component-shell>
    <div slot="widget" v-on:update="configUpdate">
      <h2>Dynamic Bar Chart</h2>
      {{message}}
      <div id="dynamic-bar"></div>
    </div>
  </component-shell>
</template>

<script>

import ComponentShell from './../components/ComponentShell';

/*eslint-disable */
/*widgets should be able to provide a structure for their configuration.  However they should not be concerned with how it is saved or retreived.*/
const vm = {
  props: ['id','viewname'],
  data() {
    return {
      message: '',
      config: [
        {id: '', title: 'endpoint'},
      ],
    };
  },
  computed: { },
  methods: {
   configUpdate() {
     alert('yes');
   },
  },
  mounted() {

    //this.update();

    var socket = new WebSocket("ws://localhost:9090/", "dashboard-issues");
    socket.onopen = function(event) {
        socket.send("issues");
    };

    socket.onclose = function(event) {
       console.log("Connection closed");
    }

    socket.onmessage = function(event) {
      var data = JSON.parse(event.data);
      var key = Object.keys(data.text)[0];
      console.log(data.text[key]);
    }
  },
  components: {
    ComponentShell,
  }
};

function update() {
  vm.data = 'hey';
}

/*eslint-disable */
export default vm;
</script>

<style> </style>
