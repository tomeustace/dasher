<template>
  <component-shell>
      <div slot="widget6" id="widget6"> </div>
      <div slot="name">
        <h2>Google Chart Integration</h2>
         <!--Div that will hold the pie chart-->
         <div id="bubble_div"></div>
      </div>
  </component-shell>
</template>

<script>

/*eslint-disable*/
import ComponentShell from './../components/ComponentShell';

const vm = {
  data() {
    return {
      name: 'Line Chart',
      component: 'Add Component',
    };
  },
  beforecreate() {
  },
  created() { },
  beforemount() { },
  mounted() {
      //var el = document.createElement('script')
      //el.setAttribute('type', 'text/javascript')
      //el.setAttribute('src', 'https://www.gstatic.com/charts/loader.js')
      //document.getElementsByTagName('head')[0].appendChild(el)
      //setTimeout(function() {
        // Load the Visualization API and the corechart package.
        google.charts.load('current', {'packages':['corechart']});
        // Set a callback to run when the Google Visualization API is loaded.
        google.charts.setOnLoadCallback(drawChart);
        // Callback that creates and populates a data table, // instantiates the pie chart, passes in the data and // draws it.
        function drawChart() {
          var data = google.visualization.arrayToDataTable([
          ['ID', 'X', 'Y', 'Temperature'],
          ['',   80,  167,      120],
          ['',   79,  136,      130],
          ['',   78,  184,      50],
          ['',   72,  278,      230],
          ['',   81,  200,      210],
          ['',   72,  170,      100],
          ['',   68,  477,      80]
        ]);

        var options = {
          colorAxis: {colors: ['yellow', 'red']}
        };

        var chart = new google.visualization.BubbleChart(document.getElementById('bubble_div'));
        chart.draw(data, options);
        }
      //}, 5000);
  
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
