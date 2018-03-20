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
          <div id="widget-select-container">
            <md-card v-for="option in getComponents" id="widget-select-card">
                <md-card-content>
                  <div id="widget-select-header">
                    <md-icon class="md-raised md-accent">widgets</md-icon>
                    <md-subheader href="#" @click.native="addWidget(activeView, option.componentName)">{{option.displayName}}</md-subheader>
                  </div>
                  <p>Some description here...</p>
                </md-card-content>
            </md-card>
          </div>
            <!--<md-checkbox :true-value="option" :false-value="!option" :id="option" :name="option" v-model="selectedOptions">{{option}}</md-checkbox>-->
        </md-dialog-content>

        <md-dialog-actions>
          <md-button class="md-primary" @click.native="closeDialog('addComponentDialog')">Cancel</md-button>
          <md-button class="md-primary" @click.native="closeDialog('addComponentDialog')">Ok</md-button>
        </md-dialog-actions>
      </md-dialog>

      <md-tabs id="tabs" @change="changeView" class="md-primary">
        <md-tab v-for="(view, index) in views" md-active :viewname="view.name" :id="view.name" class="tab" :index="index" :md-label="view.name">

          <div class="widget-container">
            <component-shell v-for="(widget, index) in view.widgets" :index="index" class="widget" :is="widget.name"></component-shell>
          </div>

          <div class="bottom-bar">
            <md-button @click.native="openDialog(view.name, 'addComponentDialog')">
              <md-tooltip>Add Widget</md-tooltip>
              <md-icon>add</md-icon>
            </md-button>
            <md-button @click.native="configureView(view.name)">
              <md-tooltip>Configure View</md-tooltip>
              <md-icon>edit</md-icon>
            </md-button>
            <md-button @click.native="removeWidgetsFromView(view.name)">
              <md-tooltip>Delete All Widgets</md-tooltip>
              <md-icon>delete</md-icon>
            </md-button>
            <md-button @click.native="removeView(view.name)">
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
import ComponentShell from './ComponentShell';
import widgetTemplate from './../widgets/WidgetTemplate';
import widgetWebRTC from './../widgets/WebRTC';
import widgetGoogleBar from './../widgets/GoogleBar';
import widgetGoogleLine from './../widgets/GoogleLine';
import widgetGooglePie from './../widgets/GooglePie';
import widgetEventDrops from './../widgets/EventDrops';

/*eslint-disable */
function created() {
  console.log(vm.components);
}

var components = { ComponentShell, widgetTemplate, widgetEventDrops, widgetWebRTC, widgetGoogleBar, widgetGoogleLine, widgetGooglePie };

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
    var loadedViews = localStorage.getItem('vd.views');
    loadedViews = JSON.parse(loadedViews);
    this.$store.dispatch('loadViews', loadedViews);
    this.$store.dispatch('loadTables');
  },
  computed: {
    // map this.views to store.state.views
    views () {
      return this.$store.state.views;
    },
    //Adds available components to dialog for selection
    getComponents: function() {
      var widgets = [];
      this.components.forEach(function(item) {
        if(item.toLowerCase().charAt(0) === 'w') {
          widgets.push({componentName: item, displayName: item.substring(6,item.length) } );
          //widgets.push(item);
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
    configureView(activeView, name) {
      console.log('Container.configureView');
    },
    removeWidgetsFromView(activeView, name) {
      console.log('Container.removeWidgetsFromView');
      this.$store.dispatch('removeWidgetsFromView', { name: activeView });
    },
    removeView(activeView, name) {
      console.log('Container.removeView');
      this.$store.dispatch('removeView', { name: activeView });
    },
    openDialog(viewName, ref) {
      this.activeView = viewName;
      this.$refs[ref].open();
    },
    closeDialog(ref) {
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
#widget-select-container {
  max-width: 500px;
  display: flex;
  flex-wrap: wrap;
  margin: 10px;
}
#widget-select-card {
  max-width: 200px;
  overflow: noscroll;
  min-height: 120px;
  margin: 10px;
}
#widget-select-header {
  display: flex;
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
