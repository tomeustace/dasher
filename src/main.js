import _ from 'lodash';

import Vue from 'vue';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';
import Vuex from 'vuex';
import App from './App';

import { addNewView, addWidgetToView, removeWidgetFromView, removeWidgetsFromView } from './util/view.manager';

Vue.use(Vuex);
Vue.use(VueMaterial);

Vue.material.registerTheme('dasher', {
  primary: {
    color: 'indigo',
    hue: 'A200',
  },
  accent: {
    color: 'grey',
    hue: 300,
  },
});

/*eslint-disable */
export const store = new Vuex.Store({
  state: {
    views: [],
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
        _.each(loadedViews, function(view) {
          commit('addView', view.name);
          console.log(`action: loadViews() - ${view.name} `);
          _.each(view.widgets, function(widget) {
            let index = _.findIndex(state.views, function(v) {
              return v.name === view.name; 
            });
            console.log(`action: loadViews() - widget ${widget.name} cid ${widget.cid}`);
            commit('addWidgetToView', {index: index, widget: {name: widget.name, cid: widget.cid}})
          });
        });
      } 
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
  },
  mutations: {
    addView(state, viewName) {
      console.log(`mutation: addView() - ${viewName}`);
      state.views.push({name: viewName});
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
      //state.views[view.index].widgets.push(view.widget);
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
      state.views.splice(view.index, 0, viewAdd);
    },
    removeWidgetsFromView(state, view) {
      let viewAdd = state.views[view.index];
      viewAdd.widgets = [];
      state.views.splice(view.index, 0, viewAdd);
    }
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
