<template>
  <component-shell>
      <div slot="widget" :config="config"> </div>
  </component-shell>
</template>

<script>

/*eslint-disable*/
import ComponentShell from './../components/ComponentShell';

function updateChart(config, widgetId) {
    if(_.isUndefined(config)) return;

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(redrawChart);
    function redrawChart() {
      let title = '';
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Dimension');
      data.addColumn('number', 'Measure');

      //var myuri = "http://localhost:8080/myapp/myresource/1/" + encodeURIComponent(JSON.stringify(globalChartQuery[idx]));
      //iterate selectedOptions and add value as  
      //TODO FIX CONFIG ARRAY TO CLEAN UP BELOW
      if(!_.isUndefined(config.Keys)) {
        title = config.Title;
        _.each(config.Keys, function(option) {
          data.addRow([option, Math.floor((Math.random() * 10) + 1)]);
        });
      } else if(!_.isUndefined(config.selected)) {
        title = config.selected.Title;
        _.each(config.selected.Keys, function(option) {
          data.addRow([option, Math.floor((Math.random() * 10) + 1)]);
        });
      } else {
        _.each(config[0].Keys, function(option) {
          data.addRow([option, Math.floor((Math.random() * 10) + 1)]);
        });
      }

      var options = { title, width: 380, height: 300, chartArea: { width: "70%", height: "70%" } };
      let selector = `[widget-cid="${widgetId}"]`;
      var chart = new google.visualization.PieChart(document.querySelector(selector));
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

      var options = { title: 'Pie Chart', width: 380, height: 300, chartArea: { width: "70%", height: "70%" } };
      let selector = `[widget-cid="${widgetId}"]`;
      console.log('create chart, selector is ' + selector);
      var ele = document.querySelector(selector);
      if(!_.isNull(ele)) {
        var chart = new google.visualization.BarChart(ele);
        chart.draw(data, options);
      } else {
        setTimeout(function() {
          var ele = document.querySelector(selector);
          var chart = new google.visualization.PieChart(ele);
          chart.draw(data, options);
        }, 4000);
      }
    }
}
const vm = {
  data() {
    return { 
      //get tables from store getter
      name: 'Google Pie Chart',
      widgetConfig: [
        { type: 'select', name: 'Keys', options: this.$store.getters.getKeys() },
      ],
    }
  },
  beforecreate() {
  },
  created() { },
  beforemount() { },
  mounted() {
    this.cid = this.$children[0].cid;
    console.log('GooglePie mounted ' + this.cid);
    //is this right/best way to get cid here
    createChart(this.cid);
    //TODO THIS IS COMING BACK AS ARRAY SHOULD BE CONFIG OBJECT
    let conf = this.$store.getters.getWidgetConfig(this.$parent.id, this.cid);
    if(!_.isUndefined(conf)) {
      let cid = this.cid;
      updateChart(conf, cid);
    }
  },
  //can use this.$store.subscribe... also
  computed: {
    config () {
      let conf = this.$store.getters.getWidgetConfig(this.$parent.id, this.cid);
      if(!_.isUndefined(conf)) {
        updateChart(conf, this.$children[0].cid);
      }
    }
  },
  beforeupdate() { },
  updated() { },
  components: {
    ComponentShell,
  }
};
/*eslint-disable */
export default vm;
</script>

<style>
</style>
