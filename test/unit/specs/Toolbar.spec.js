import Vue from 'vue';
import Vuex from 'vuex';
import VueMaterial from 'vue-material';
import Toolbar from 'src/components/Toolbar';

Vue.use(VueMaterial);
Vue.use(Vuex);

const mockStore = {
  state: {
    views: [],
    config: {
     default: [],
     selected: [],
    },
    loadedTables: [],
  },
  actions: {
    addView ({ commit, state }, viewName) {
      console.log(`mock actions: addView() - ${viewName}`);
    },
  }
};

/*eslint-disable*/
describe('Toolbar.vue', () => {

  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      store: new Vuex.Store(mockStore),
      render: (h) => h(Toolbar),
    });
    expect(vm.$el.querySelector('#toolbar h2').textContent).to.equal('Dasher');
  });

  it('has a mounted hook', () => {
    console.log(Object.keys(Toolbar));
    expect(typeof Toolbar.mounted).to.equal('function')
  });

  it('saves a view', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      store: new Vuex.Store(mockStore),
      render: (h) => h(Toolbar),
    });
    expect(typeof Toolbar.methods.saveView).to.equal('function')
  });

});
/*eslint-enable*/
