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
    if(_.isUndefined(config)) return;

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(redrawChart);
    function redrawChart() {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Dimension');
      data.addColumn('number', 'Measure');

      //var myuri = "http://localhost:8080/myapp/myresource/1/" + encodeURIComponent(JSON.stringify(globalChartQuery[idx]));
      //iterate selectedOptions and add value as  
      //TODO FIX CONFIG ARRAY TO CLEAN UP BELOW
      if(!_.isUndefined(config.Keys)) {
        _.each(config.Keys, function(option) {
          data.addRow([option, Math.floor((Math.random() * 10) + 1)]);
        });
      } else if(!_.isUndefined(config.selected)) {
        _.each(config.selected.Keys, function(option) {
          data.addRow([option, Math.floor((Math.random() * 10) + 1)]);
        });
      } else {
        _.each(config[0].Keys, function(option) {
          data.addRow([option, Math.floor((Math.random() * 10) + 1)]);
        });
      }

      var options = { title: 'Bar Chart', width: 380, height: 300, chartArea: { width: "70%", height: "70%" } };
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
        { type: 'select', name: 'Tables', options: this.$store.getters.getTables() },
        { type: 'select', name: 'Attributes', options: this.$store.getters.getAttributes() },
        { type: 'select', name: 'Keys', options: this.$store.getters.getKeys() },
      ],
    }
  },
  mounted() {
    //TODO get config to pass in
    this.cid = this.$children[0].cid;
    console.log('GoogleBar mounted ' + this.cid);
    //is this right/best way to get cid here
    createChart(this.cid);
    //TODO THIS IS COMING BACK AS ARRAY SHOULD BE CONFIG OBJECT
    let conf = this.$store.getters.getWidgetConfig(this.$parent.id, this.cid);
    if(!_.isUndefined(conf)) {
      let cid = this.cid;
      setTimeout(function() {
        updateChart(conf[1], cid);
      }, 4000);
      updateChart(conf[1], cid);
    }
  },
  //can use this.$store.subscribe... also
  computed: {
    config () {
      let config = this.$store.state.config;
      console.log('GoogleBar got config update' + this.cid);
      if(config.default.length > 0) {
        let conf = this.$store.getters.getWidgetConfig(this.$parent.id, this.cid);
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
