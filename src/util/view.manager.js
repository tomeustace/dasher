/*eslint-disable */
import _ from 'lodash';

/**
 * View model: [{id: uniqueId, name: name, widgets: widgets, config: config, options: options}]
 * Component model: [{id: uniqueId, name: name, config: config, options: options}]
 */

/**
 * getViews
 *
 * @returns {undefined}
 */
function getViews() {
  return JSON.parse(localStorage.getItem('vd.views'));
}

export 
function getViewNames() {
  let names = _.map(getViews(), function(view) {
    return view.name; 
  });
  return names;
}

export 
function getComponents(viewName = '') {
  let views = getViews();
  let index = getViewNameIndex(viewName); 

  if(index === -1) return [];
  return views[index].widgets;
}

function getViewByName(viewName = '') {
  return _.find(getViews(), function(view) {
    return view.name === viewName;
  });
}

export
function getViewNameIndex(viewName = '') {
  return _.findIndex(getViews(), function(view) {
    return view.name === viewName; 
  });
}

function updateViews(viewName, view) {
  let views = getViews();
  _.remove(views, function(v) {
    return v.name === viewName; 
  });

  //add new view
  views.push(view);

  //save to local storage
  localStorage.setItem('vd.views', JSON.stringify(views));
}

/**
 * addComponentToView - adds widgets to existing views.
 *
 * @param viewName=''
 * @param widgets=[]
 * @returns {undefined}
 */
export
function addWidgetToView(viewName = '', widget) {
  //get view by name
  let view = getViewByName(viewName);
  //add compnent to view
  view.widgets.push(widget);

  updateViews(viewName, view);
}

/**
 * addIdToWidget - widget is not assigned id until rendered, so need to add id after store is updated with addWidgetToView.
 *
 * @param viewName=''
 * @param widgetId=''
 */
export
function addIdToWidget(viewName = '', widgetId) {
  let view = getViewByName(viewName);
   
  var index = _.findIndex(view.widgets, function(widget) {
    return !widget.hasOwnProperty('id'); 
  });

  if(index != -1) {
    view.widgets[index].id = widgetId;
  }
  
  updateViews(viewName, view);
}

/**
 * removeWidgetFromView - remove component from view.
 *
 * @param viewName=''
 * @param widgets=[]
 * @returns {undefined}
 */
export
function removeWidgetFromView(viewName = '', widget) {

  let view = getViewByName(viewName);

  _.remove(view.widgets, function(c) {
    return c.cid === widget.cid; 
  });

  updateViews(viewName, view);
}

export
function removeWidgetsFromView(viewName = '') {

  let view = getViewByName(viewName);

  view.widgets = [];

  updateViews(viewName, view);
}
export
function addNewView(name = '', widgets = []) {
  let viewState = {
    saved: false,
    message: ''
  };

  if(name === '') {
    viewState.message = 'View name not set';
    return viewState;
  }

  let index = getViewNameIndex(name);
  if(index !== -1) {
    viewState.message = 'View name already exists';
    return viewState;
  }

  let views = getViews();
  if(_.isNull(views)) {
    views = [];
    let view = {};
    view.name = name;
    view.widgets = [];
    view.config = [];
    view.options = [];
    views.push(view);
    localStorage.setItem('vd.views', JSON.stringify(views));
  } else {
    views.push({'name': name, 'widgets': widgets });
    localStorage.setItem('vd.views', JSON.stringify(views));
  }

  viewState.saved = true;
  return viewState;
}

export
function updateWidgetConfig(config) {
  let view = getViewByName(config.viewName);
  let index = _.findIndex(view.widgets, function(c) {
    return c.cid === config.cid; 
  });
  //TODO rename below 
  view.widgets[index].config = config.config;
  updateViews(config.viewName, view);
}


