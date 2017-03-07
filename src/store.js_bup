/**
 * TODO
 * STORE.JS DOESN'T WORK AS IS, NEED TO INVESTIGATE MAY TAKE AN HOUR OR SO TO FIGURE OUT
 */
import Vue from 'vue';
import Vuex from 'vuex';

import { addNewView, addWidgetToView, addIdToWidget, removeWidgetFromView } from './util/ViewLoader';

Vue.use(Vuex);

/*eslint-disable */
export const store = new Vuex.Store({
  state: {
    views: [],
  },
  actions: {
    addView ({ commit, state }, viewName) {
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
        commit('loadViews', loadedViews);
      } 
    },
    /* Invoked when widget is rendered for first time. Only required for local storage as id is already available on widget at this point */
    addIdToWidget({commit, state }, view) {
      let viewName = view.name;
      let widgetId = view.id;
      addIdToWidget(viewName, widgetId); 
      //need to find index of view by name
      let index = _.findIndex(state.views, function(view) {
        return view.name === viewName; 
      });
      let widgetIndex = _.findIndex(state.views[index].widgets, function(widget) {
        return !widget.hasOwnProperty('id'); 
      });
      commit('addIdToWidget', {index: index, widgetIndex: widgetIndex, viewName: viewName, widgetId: widgetId})
    },
    addWidgetToView ({ commit, state }, view ) {
      let viewName = view.name;
      let widgetName = view.widget;
      addWidgetToView(viewName, {name: widgetName}); 

      //need to find index of view by name
      let index = _.findIndex(state.views, function(view) {
        return view.name === viewName; 
      });
      commit('addWidgetToView', {index: index, widget: {name: widgetName}})
    },
    removeWidgetFromView ({ commit, state }, view ) {
      let viewName = view.name;
      let widgetName = view.widget;
      removeWidgetFromView(viewName, {id: view.id, name: widgetName}); 

      //need to find index of view by name
      let index = _.findIndex(state.views, function(view) {
        return view.name === viewName; 
      });
      commit('removeWidgetFromView', {index: index, viewName: viewName, widget: {id: view.id}})
    },
  },
  mutations: {
    addView(state, viewName) {
      console.log('addView ' + viewName);
      state.views.push({name: viewName});
    },
    loadViews(state, views) {
      console.log('loadedViews ' + views);
      state.views = views;
    },
    addIdToWidget(state, view) {
      //TODO need to update this to use splice
      //state.views[view.index].widgets[view.widgetIndex].id = view.widgetId;

      //take target view out of views
      let viewAdd = state.views.splice(view.index,1)[0];
      //get target widget
      let widget = viewAdd.widgets.splice(view.widgetIndex, 1)[0];
      //add id property to target widget
      widget.id = view.widgetId;
      //add updated widget into widgets
      viewAdd.widgets.splice(view.widgetIndex, 0, widget);
      //add updated widgets into views 
      state.views.splice(view.index, 1, viewAdd);
    },
    addWidgetToView(state, view) {
      console.log('addWidgetToView ' + view.widget);
      if(_.isUndefined(state.views[view.index].widgets)) {
        state.views[view.index].widgets = [];
      }
      //this triggers rendering of added widget
      let viewAdd = state.views[view.index];
      viewAdd.widgets.push(view.widget);
      state.views.splice(view.index, 1, viewAdd);
      //state.views[view.index].widgets.push(view.widget);
    },
    removeWidgetFromView(state, view) {
      let widgetsTarget = state.views[view.index].widgets;
      console.log('widget removed - length: ' + widgetsTarget.length);
      //remove widget 
      //TODO REMOVE IS NOT WORKING HERE, MAY USE FIND INDEX AND SPLICE INSTEAD
      _.remove(widgetsTarget, function(c) {
        //TODO change to be id
        return c.id === view.widget.id; 
      });

      //
      //HAVE TO USE SPLICE TO UPDATE VALUES IN VUE
      //
      //add updated view
      let viewAdd = state.views[view.index];
      viewAdd.widgets = widgetsTarget;
      state.views.splice(view.index, 1, viewAdd);
      //state.views[view.index].widgets = widgetsTarget;
    }
  },
});
