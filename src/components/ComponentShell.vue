<template>
  <div :id="_uid" :cid="cid" class="component-shell">
    <md-toolbar class="md-dense">
      <md-button class="md-icon-button">
        <md-tooltip>Widget ID {{cid}}</md-tooltip>
	<md-icon class="md-accent">menu</md-icon>
      </md-button>

      <h2 class="md-title" style="flex: 1">{{name}}</h2>

      <md-button @click="configureComponent" class="md-icon-button">
        <md-tooltip>Configure Widget</md-tooltip>
	<md-icon class="md-accent">settings</md-icon>
      </md-button>
      <md-button @click="removeComponent" class="md-icon-button">
        <md-tooltip>Delete Widget</md-tooltip>
	<md-icon class="md-accent">delete</md-icon>
      </md-button>
    </md-toolbar> 

    <md-card>
        <md-card-header>
          <slot name="name"></slot>
        </md-card-header>

        <md-card-content>
          <slot name="widget1"></slot>
	</md-card-content>
    </md-card>

  </div>
</template>
<script>

/*eslint-disable */

const vm = {
  data() {
    return {
      counter: 0,
      widget: '',
      name: '',
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
  },
  beforeCreate() { },
  created() { },
  beforeMount() {
  },
  mounted() { 
    let index = this.$parent.$parent.$el.getAttribute('index');
    let widgetIndex = this.$parent.$el.getAttribute('index');
    console.log('ComponentShell - beforeMount index ', index);
    let widget = this.$store.state.views[index].widgets[widgetIndex];
    if(!_.isUndefined(widget)) {
      console.log('ComponentShell - beforeMount ', widget.cid);
      this.name = widget.name;
      this.$data.cid = widget.cid;
    } else {
      console.log('ComponentShell - beforeMount ERROR');
    }
  },
  beforeUpdate() { },
  updated() { },
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
