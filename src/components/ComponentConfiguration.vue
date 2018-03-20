<template>
    <div :id="_uid" class="component-configuration">
      <md-dialog-title>Configure {{name}}</md-dialog-title>
      <md-icon class="md-raised md-accent">settings_applications</md-icon>
      <md-dialog-content>

        <md-input-container class="save-configuration">
          <label for="title">Title</label>
          <md-input type="text" placeholder="Widget Title" value="" v-model="title">
        </md-input-container>
        <!-- NEED TO UPDATE CONFIG SO ALL TABLE OPTIONS ARE ALWAYS DISPLAYED IN CONFIG WHILE
          KEEPING PREVIOUS SELECTION INTACT -->
        <!-- NEED TO UPDATE SELECTEDOPTINS TO BE UNIQUE FOR EACH CONF ITEM -->
        <div v-for="conf in config" >

          <md-input-container v-if="conf.type === 'select'">
            <label for="conf.name">{{conf.name}}</label>
            <md-select name="options" id="options" multiple class="save-configuration" :name="conf.name" v-model="selectedOptions[conf.name]">
            <!-- <md-select name="options" id="options" multiple class="save-configuration"> -->
              <md-subheader>{{conf.name}}</md-subheader>
              <md-option v-for="(option, index) in conf.options" :value="option.id">{{option.id}}</md-option>
            </md-select>
          </md-input-container>
          <!-- selection triggers computed property currently -->
          {{selection}}

          <div v-if="selectedOptions[conf.name].length > 0 && conf.name != 'Title'">
            <md-subheader>Selected {{conf.name}}</md-subheader>
            <md-chips v-model="selectedOptions[conf.name]" md-static>
              <template scope="chip">{{ chip.value }}</template>
            </md-chips>
          </div>

          <!-- <md-input-container v-if="conf.type !== 'select'" class="save-configuration" v-for="field in conf"> -->
            <!-- <label for="title">Title</label> -->
            <!-- <md-input type="text" placeholder="Widget Title" value="" v-model="selectedOptions['title']"> -->
          <!-- </md-input-container> -->

        </div>


      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-raised md-primary" @click.native="save('configureComponentDialog')">
          <md-tooltip>Save</md-tooltip>
          <md-icon>save</md-icon>
        </md-button>
     </md-dialog-actions>

      <!-- Cannot nest below in md-dialog-content, causes error undefined -->
      <!-- <dimension-configuration></dimension-configuration> -->

</template>
<script>

/*eslint-disable*/
const vm = {
  props: ['config', 'name', 'cid'],
  data() {
    return {
      title: '',
      selectedOptions: {},
    };
  },
  computed: {
    selection() {
      const options = {};
      _.each(this.config, function (it) {
        options[it.name] = [];
      });
      options['Title'] = this.title;
      this.selectedOptions = options;
    },
  },
  methods: {
    save(ref) {
      const viewName = this.$parent.$parent.$parent.$parent.$el.id;
      const cid = this.cid;
      const conf = {};
      conf.default = this.config;
      conf.selected = this.selectedOptions;
      this.$store.dispatch('updateWidgetConfig', { viewName, conf, cid });
      this.$emit('closeDialog', ref);
    },
  },
  components: { },
};

/*eslint-disable */
export default vm;
</script>

<style>
.component-configuration {
  flex-direction: row;
  margin: 10px;
  padding: 10px;
  min-width: 300px;
  min-height: 200px;
  overflow-y: scroll;
}
</style>
