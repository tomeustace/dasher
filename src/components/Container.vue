<template>
  <div id="container">
    <div v-if="views.length === 0">
      <md-card id="start-container">
          <md-card-content>
            <h3>Create a view and add some widgets to start.</h3>
          </md-card-content>
      </md-card>
    </div>
    <div v-if="views.length > 0">

      <md-dialog md-open-from="#custom" md-close-to="#custom" ref="addComponentDialog">
        <md-dialog-title v-model="activeView">Choose widgets for <i>{{activeView}}</i> </md-dialog-title>

        <md-dialog-content>
          <!-- <div v-for="option in components"> -->
          <div v-for="option in getComponents">
            <p href="#" @click="addWidget(activeView, option)">{{option}}</p>
            <!--<md-checkbox :true-value="option" :false-value="!option" :id="option" :name="option" v-model="selectedOptions">{{option}}</md-checkbox>-->
          </div>
        </md-dialog-content>

        <md-dialog-actions>
          <md-button class="md-primary" @click="closeDialog('addComponentDialog')">Cancel</md-button>
          <md-button class="md-primary" @click="closeDialog('addComponentDialog')">Ok</md-button>
        </md-dialog-actions>
      </md-dialog>

      <md-tabs id="tabs" v-on:change="changeView()" class="md-primary">
        <md-tab v-for="(view, index) in views" md-active v-bind:id="view.name" class="tab" :index="index" v-bind:md-label="view.name">

          <div class="widget-container">
            <component-shell v-for="(widget, index) in view.widgets" :index="index" class="widget" :is="widget.name"></component-shell>
          </div>

          <div class="bottom-bar">
            <md-button @click="openDialog(view.name, 'addComponentDialog')">
              <md-tooltip>Add Widget</md-tooltip>
              <md-icon>add</md-icon>
            </md-button>
            <md-button @click="removeWidgetsFromView(view.name)">
              <md-tooltip>Delete All Widgets</md-tooltip>
              <md-icon>delete</md-icon>
            </md-button>
            <md-button @click="removeWidgetsFromView(view.name)">
              <md-tooltip>Delete View</md-tooltip>
              <md-icon>delete_forever</md-icon>
            </md-button>
          </div>
        </md-tab>
      </md-tabs>
    </div>
  </div>
</template>
<script>

/*eslint-disable */
import { mapState } from 'vuex';
/*eslint-enable */
import { getViewNames } from './../util/view.manager';
import ComponentShell from './ComponentShell';
import Widget1 from './../widgets/Widget1';
import Widget2 from './../widgets/Widget2';
import Widget3 from './../widgets/Widget3';
import Widget4 from './../widgets/Bar';
import Widget5 from './../widgets/Widget5';
import Widget6 from './../widgets/Widget6';
import WebRTC from './../widgets/WebRTC';

/*eslint-disable */
function created() {
  console.log(vm.components);
}

var components = { ComponentShell, Widget1, Widget2, Widget3, Widget4, Widget5, Widget6, WebRTC };

const vm = {
  data() {
    return { 
      selected: '',
      activeView: '',
      widgets: [],
      components: Object.keys(components),
    };
  },
  created: function created() {
    //On create load any pre configured views
    var viewNames = getViewNames();
    var loadedViews = localStorage.getItem('vd.views');
    loadedViews = JSON.parse(loadedViews);
    this.$store.dispatch('loadViews', loadedViews); ;
  },
  //computed: mapState([ 'count' ])
  computed: {
    // map this.views to store.state.views
    //...mapState(['views']),
    views () {
      return this.$store.state.views;
    },
    //Adds available components to dialog for selection
    getComponents: function() {
      var widgets = [];
      this.components.forEach(function(item) {
        if(item.toLowerCase().charAt(0) === 'w') {
          widgets.push(item); 
        }
      });
      return widgets;
    },
  },
  methods: {
    changeView(activeView) {
      console.log(`changeView ${activeView}`);
    },
    addWidget(activeView, name) {
      console.log('Container.addWidget');
      this.$store.dispatch('addWidgetToView', {name: activeView, widget: name});
    },
    removeWidgetsFromView(activeView, name) {
      console.log('Container.removeWidgetsFromView');
      this.$store.dispatch('removeWidgetsFromView', { name: activeView });
    },
    openDialog(viewName, ref) {
      this.activeView = viewName;
      this.$refs[ref].open();
    },
    closeDialog(ref) {
      //console.log(this.selectedOptions);
      this.$refs[ref].close();
    },
  },
  components: components,
};

/*eslint-disable */
export default vm;
</script>

<style>
#container {
  background-color: #cccccc;
  width: 100%;
  height: 90%;
}
#start-container {
  opacity: .6;
}
.bottom-bar {
  background-color: white;
  height: 50px;
}
.widget-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
}
.widget {
  margin: 5px;  
}
.tab {
  display: flex;
  flex-direction: column;
}
#tabs {
  height: 100%;
}
#tabs.md-tabs-content {
  height: 100%;
}
</style>
