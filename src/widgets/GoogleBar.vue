<template>
  <component-shell>
      <!-- this binds config from component shell to widget -->
      <div slot="widget" :config="config"> </div>
  </component-shell>
</template>

<script>

/*eslint-disable*/
import { mapState } from 'vuex';
import ComponentShell from './../components/ComponentShell';

function updateChart(config, measure, widgetId) {
    if(_.isUndefined(config)) return;

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(redrawChart);

    function redrawChart() {
      let title = '';
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Dimension');
      data.addColumn('number', 'Measure');

      if(!_.isUndefined(config.Attributes)) {
        title = config.Title;
        _.each(config.Attributes, function(option) {
          data.addRow([option, measure]);
        });
      } else if(!_.isUndefined(config.selected)) {
        title = config.selected.Title;
        _.each(config.selected.Attributes, function(option) {
          data.addRow([option, measure]);
        });
      }

      var options = { title, width: 380, height: 300, chartArea: { width: "70%", height: "70%" } };
      let selector = `[widget-cid="${widgetId}"]`;
      var chart = new google.visualization.BarChart(document.querySelector(selector));
      chart.clearChart();
      chart.draw(data, options);
    }
}

function createChart(widgetId) {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Dimension');
      data.addColumn('number', 'Measure');

      var options = { title: 'Bar Chart', width: 380, height: 300, chartArea: { width: "70%", height: "70%" } };
      let selector = `[widget-cid="${widgetId}"]`;
      console.log('create chart, selector is ' + selector);
      var ele = document.querySelector(selector);
      if(!_.isNull(ele)) {
        var chart = new google.visualization.BarChart(ele);
        chart.draw(data, options);
      } else {
        setTimeout(function() {
          var ele = document.querySelector(selector);
          var chart = new google.visualization.BarChart(ele);
          chart.draw(data, options);
        }, 4000);
      }
    }
}

const vm = {
  data() {
    return {
      //get tables from store getter
      name: 'Google Bar Chart',
      widgetConfig: [
        { type: 'select', name: 'Attributes', options: this.$store.getters.getAttributes() },
        { type: 'select', name: 'Keys', options: this.$store.getters.getKeys() },
      ],
    }
  },
  methods: {
    dataUpdated: function() {
      console.log('got update');
    },
  },
  mounted() {
    //TODO get config to pass in
    this.cid = this.$children[0].cid;
    console.log('GoogleBar mounted ' + this.cid);
    //is this right/best way to get cid here
    createChart(this.cid);
    //TODO THIS IS COMING BACK AS ARRAY SHOULD BE CONFIG OBJECT
    let conf = this.$store.getters.getWidgetConfig(this.$parent.id, this.cid);
    //TODO need to update upateTableData to operate refresh
    if(!_.isUndefined(conf)) {
      let cid = this.cid;
      updateChart(conf, 5, cid);
    }
  },
  //can use this.$store.subscribe... also
  computed: {
    config () {
      let conf = this.$store.getters.getWidgetConfig(this.$parent.id, this.cid);
      if(!_.isUndefined(conf)) {
        let that = this;
        setInterval(function() {

          let prom = that.$store.getters.updateTableData(conf);
          if(!_.isUndefined(prom)) {
            prom.then( response => {
                let data = response.body;
                console.log(data);
                updateChart(conf, parseInt(data.measures), that.$children[0].cid);
              }, response => {
                console.log('error retrieving data for ' + uri);
              }
            );
          }

        }, 3000);
      }
    },
  },
  components: {
    ComponentShell,
  }
};

export default vm;

</script>

<style>
#bar-chart {
  min-width: 400px;
  margin-top: 40px;
}
</style>
