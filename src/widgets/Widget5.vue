<template>
  <component-shell>
      <div slot="widget5" id="widget5"> </div>
      <div slot="name">
        <h2>Google Chart Integration</h2>
         <!--Div that will hold the pie chart-->
         <div id="line_div"></div>
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
          // Create the data table.
          var data = new google.visualization.DataTable();
          data.addColumn('string', 'Topping');
          data.addColumn('number', 'Slices');
          data.addRows([ ['Mushrooms', 3], ['Onions', 1], ['Olives', 1], ['Zucchini', 1], ['Pepperoni', 2] ]);
          // Set chart options
          var options = {'title':'How Much Pizza I Ate Last Night', 'width':300, 'height':250};
          // Instantiate and draw our chart, passing in some options.
          var chart = new google.visualization.LineChart(document.getElementById('line_div'));
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
