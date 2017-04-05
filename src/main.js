import 'es6-promise/auto';

import _ from 'lodash';

import Vue from 'vue';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';
import Vuex from 'vuex';
import vueResource from 'vue-resource';
import App from './App';

import { addNewView, addWidgetToView, removeView, removeWidgetFromView, removeWidgetsFromView, updateWidgetConfig } from './util/view.manager';

Vue.use(Vuex);
Vue.use(VueMaterial);
Vue.use(vueResource);

Vue.http.options.xhr = { withCredentials: true };

Vue.material.registerTheme('dasher', {
  primary: {
    color: 'indigo',
    hue: 'A200',
  },
  accent: {
    color: 'white',
    hue: 300,
  },
});

/*eslint-disable */
export const store = new Vuex.Store({
  state: {
    views: [],
    config: {
     default: [],
     selected: [],
    },
    loadedTables: [],
  },
  getters: {
    getWidgetConfig: (state) => (viewName, cid) => {
      let index = _.findIndex(state.views, function(v) {
        return v.name === viewName; 
      });
      let target = _.find(state.views[index].widgets, function(widget) {
        return widget.cid === cid; 
      });
      if(!_.isUndefined(target)) {
        return target.config;
      } else {
        return undefined;
      }
    },
    updateTableData: (state) => (conf) => {
      //TODO if no conf set return, triggered onload
      if(_.isUndefined(conf.selected)) {
        return;
      }

      let table = 'table|' + conf.selected.Tables;
      let attributes = conf.selected.Attributes;
      let keys = conf.selected.Keys;
      let attSet = [...attributes, ...keys];
      let reqObj = {'table':table,'time':'','attSet':[attSet],'trend':0};
      reqObj = JSON.stringify(reqObj);
      reqObj = encodeURIComponent(reqObj);
      let uri = 'http://localhost:8080/myapp/myresource/1/' + reqObj;
      let result = Vue.http.get(uri);
      return result;
      // Vue.http.get(uri).then(response => {
      //   let data = response.body;
      //   console.log(data);
      //   result.resolve(data);
      // }, response => {
      //   console.log('error retrieving data for ' + uri);
      //   result.reject(data);
      // });
    },
    getTables: (state) => () => {
      return state.loadedTables;
    },
    getKeys: (state) => () => {
      let keys = [
        "USER|agentName0",
        "USER|agentName1",
        "USER|agentName2",
        "USER|agentName3",
        "USER|agentName4",
        "USER|agentName5",
      ];
      keys = _.map(keys, function(key) {
          return {"id": key}; 
        });
      return keys;
    },
    getAttributes: (state) => () => {
       let attributes = [
            "att|ALL",
            "service|Credit Card",
            "service|Home Equity",
            "service|savings",
            "service|Auto Loans",
            "service|Checking",
            "service|Mortgage",
            "service|Business Banking",
            "service|Merchant Services",
            "service|Business Credit Card",
            "service|Business Lending",
            "region|New England",
            "region|Mid-Atlantic",
            "region|NorthEast",
            "region|West North Central",
            "region|South Atlantic",
            "region|East South Central",
            "region|West South Central",
            "region|Mountain",
            "region|Pacific",
            "profile|Platinum",
            "profile|Gold",
            "profile|Silver",
            "profile|Bronze",
            "profile|Unknown",
            "lang|English",
            "lang|Spanish",
            "channel|sipuri",
            "channel|Chat",
            "channel|Email",
            "channel|Mobile Video"
        ];
        attributes = _.map(attributes, function(att) {
          return {"id":att}; 
        });
        return attributes;
    },
  },
  actions: {
    addView ({ commit, state }, viewName) {
      console.log(`actions: addView() - ${viewName}`);
      let added = addNewView(viewName); 
      if(added.saved === true) {
        commit('addView', viewName)
      } else {
        //TODO shouldn't do this here, show toast or something
        alert(added.message);
      }
    },
    loadViews ({ commit, state }, loadedViews ) {
      if(!_.isNull(loadedViews)) {
        //load views
        _.each(loadedViews, function(view) {
          commit('addView', view.name);
          console.log(`action: loadViews() - ${view.name} `);
          //load view widgets
          _.each(view.widgets, function(widget) {
            let index = _.findIndex(state.views, function(v) {
              return v.name === view.name; 
            });
            console.log(`action: loadViews() - widget ${widget.name} cid ${widget.cid}`);
            commit('addWidgetToView', {index: index, widget: {name: widget.name, cid: widget.cid}})
            //load widget config
            _.each(widget.config, function(config) {
              let widgetIndex = _.findIndex(state.views[index].widgets, function(v) {
                return v.cid === widget.cid; 
              });
              console.log(`action: loadViews() - config ${widget.name} cid ${widget.cid} config ${config}`);
              commit('addConfigToWidget', {index, widget: {name: widget.name, widgetIndex, cid: widget.cid, config}})
            });
          });
        });
      } 
    },
    loadTables ({ commit, state }) {
      Vue.http.get('http://localhost:8080/myapp/myresource/1/TableNames').then(response => {
        let tables = response.body.split(',');
        tables = tables.map( (table) => { 
          return { id: table };
        });
        console.log('loading tables');
        commit('loadTables', tables);
      }, response => {
        console.log('error loading tables');
      });
    },
    addWidgetToView ({ commit, state }, view ) {
      let viewName = view.name;
      let widgetName = view.widget;
      let cid = Math.random().toString(36).substr(2, 9);
      addWidgetToView(viewName, {name: widgetName, cid: cid}); 
      //need to find index of view by name
      let index = _.findIndex(state.views, function(view) {
        return view.name === viewName; 
      });
      commit('addWidgetToView', {index: index, widget: {name: widgetName, cid: cid}})
    },
    removeView ({ commit, state }, view ) {
      let viewName = view.name;
      let widgetName = view.widget;
      removeView(viewName); 

      //need to find index of view by name
      let index = _.findIndex(state.views, function(view) {
        return view.name === viewName; 
      });
      commit('removeView', {index, viewName})

    },
    removeWidgetFromView ({ commit, state }, view ) {
      let viewName = view.name;
      let widgetName = view.widget;
      removeWidgetFromView(viewName, {cid: view.cid, name: widgetName}); 

      //need to find index of view by name
      let index = _.findIndex(state.views, function(view) {
        return view.name === viewName; 
      });
      commit('removeWidgetFromView', {index: index, viewName: viewName, widget: {cid: view.cid}})
    },
    removeWidgetsFromView ({ commit, state }, view ) {
      let viewName = view.name;
      removeWidgetsFromView(viewName); 

      //need to find index of view by name
      let index = _.findIndex(state.views, function(view) {
        return view.name === viewName; 
      });
      commit('removeWidgetsFromView', {index: index, viewName: viewName})
    },
    updateWidgetConfig ({ commit, state }, options) {
      let viewName = options.viewName;
      let cid = options.cid;
      let conf = options.conf;
      updateWidgetConfig(viewName, options); 
      //need to find index of view by name
      let index = _.findIndex(state.views, function(view) {
        return view.name === viewName; 
      });
      commit('updateWidgetConfig', {index, viewName, conf, cid})
    },
  },
  //TODO CLEAN UP NAMING OF VARIABLES
  mutations: {
    addView(state, viewName) {
      console.log(`mutation: addView() - ${viewName}`);
      state.views.push({name: viewName});
    },
    removeView(state, options) {
      console.log(`mutation: removeView() - ${options.viewName}`);
      state.views.splice(options.index, 1);
    },
    loadViews(state, views) {
      console.log(`mutation: loadedViews() - ${views}`);
      state.views = views;
    },
    addWidgetToView(state, view) {
      if(_.isUndefined(state.views[view.index].widgets)) {
        state.views[view.index].widgets = [];
      }
      //this triggers rendering of added widget
      let viewAdd = state.views[view.index];
      console.log(`mutations: addWidgetToView() - ${viewAdd.name} ${view.widget.name}`);
      viewAdd.widgets.push(view.widget);
      state.views.splice(view.index, 1, viewAdd);
    },
    addConfigToWidget(state, view) {
      if(_.isUndefined(state.views[view.index].widgets[view.widget.widgetIndex].config)) {
        //TODO below defaults to array causes issue when saving an object
        state.views[view.index].widgets[view.widget.widgetIndex].config = {};
      }
      //this triggers rendering of added widget
      let viewAdd = state.views[view.index];
      console.log(`mutations: addConfigToWidget() - ${viewAdd.name} ${view.widget.name}`);
      viewAdd.widgets[view.widget.widgetIndex].config = view.widget.config;
      state.views.splice(view.index, 1, viewAdd);
    },
    removeWidgetFromView(state, view) {
      let widgetsTarget = state.views[view.index].widgets;
      _.remove(widgetsTarget, function(c) {
        //TODO change to be id
        return c.cid === view.widget.cid; 
      });

      //add updated view
      let viewAdd = state.views[view.index];
      viewAdd.widgets = widgetsTarget;
      state.views.splice(view.index, 1, viewAdd);
    },
    removeWidgetsFromView(state, view) {
      let viewAdd = state.views[view.index];
      viewAdd.widgets = [];
      state.views.splice(view.index, 0, viewAdd);
    },
    updateWidgetConfig(state, options) {
      let widgetsTarget = state.views[options.index].widgets;
      let index = _.findIndex(widgetsTarget, function(c) {
        //TODO change to be id
        return c.cid === options.cid; 
      });

      //add updated view
      let viewAdd = state.views[options.index];
      //viewAdd.widgets[index].config = view.config.fields;
      viewAdd.widgets[index].config = options.conf;
      //update the config array to trigger update on widget
      state.config.default.splice(0, state.config.default.length-1);
      _.each(options.conf.default, function(conf) {
        state.config.default.push(conf);
      });
      //state.config.splice(0, 1, ...view.config.config);
      //start at index remove 1 item and add viewAdd
      state.views.splice(options.index, 1, viewAdd);
    },
    loadTables(state, tables) {
      console.log(tables);
      state.loadedTables = tables;
    },
  },
});

export const bus = new Vue();

//export default bus;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
