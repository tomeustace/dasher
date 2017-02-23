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

function updateChart(config, widgetId) {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(redrawChart);
    function redrawChart() {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Dimension');
      data.addColumn('number', 'Measure');

      //var myuri = "http://localhost:8080/myapp/myresource/1/" + encodeURIComponent(JSON.stringify(globalChartQuery[idx]));
      //iterate selectedOptions and add value as  
      _.each(config[0].options.Keys, function(option) {
        data.addRow([option, 5]);
      });

      var options = { title: 'Bar Chart', width: 400, height: 300, chartArea: { width: "70%", height: "70%" } };
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

      //var myuri = "http://localhost:8080/myapp/myresource/1/" + encodeURIComponent(JSON.stringify(globalChartQuery[idx]));
      //iterate selectedOptions and add value as  
      //let selo = ['tim','tom'];
      //_.each(selo, function(option) {
      //  console.log('adding ' + option);
      //  data.addRow([option, 5]);
      //});
      var options = { title: 'Bar Chart', width: 400, height: 300, chartArea: { width: "70%", height: "70%" } };
      let selector = `[widget-cid="${widgetId}"]`;
      var chart = new google.visualization.BarChart(document.querySelector(selector));
      chart.draw(data, options);
    }
}

const vm = {
  data() {
    return { 
      //get tables from store getter
      name: 'Google Bar Chart',
      widgetConfig: [
        { type: 'select', name: 'Tables', options: this.$store.getters.getTables() },
        { type: 'select', name: 'Attributes', options: this.$store.getters.getAttributes() },
        { type: 'select', name: 'Keys', options: this.$store.getters.getKeys() },
      ],
    }
  },
  mounted() {
    //TODO get config to pass in
    let cid = this.$children[0].cid;
    console.log('GoogleBar mounted ' + cid);
    //is this right/best way to get cid here
    createChart(cid);
  },
  //can use this.$store.subscribe... also
  computed: {
    config () {
      let config = this.$store.state.config;
      console.log('GoogleBar got config update' + config);
      if(config.length > 0) {
        let conf = this.$store.getters.getWidgetConfig(this.$parent.$el.id, this.$children[0].cid);
        updateChart(conf, this.$children[0].cid);
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
