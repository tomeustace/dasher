<template>
  <component-shell>
      <div slot="widget">
        <h2>Google Chart Integration</h2>
         <div id="bar_div"></div>
      </div>
  </component-shell>
</template>

<script>

/*eslint-disable*/
import ComponentShell from './../components/ComponentShell';

const vm = {
  data() {
    return { 
      config: [
        {id: '', title: 'pie-endpoint'},
        {id: '', title: 'options'},
      ]
    }
  },
  beforecreate() { },
  created() { },
  beforemount() { },
  mounted() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Topping');
      data.addColumn('number', 'Slices');
      data.addRows([ ['Mushrooms', 3], ['Onions', 1], ['Olives', 1], ['Zucchini', 1], ['Pepperoni', 2] ]);
      var options = {'title':'How Much Pizza I Ate Last Night', 'width':300, 'height':250};
      var chart = new google.visualization.BarChart(document.getElementById('bar_div'));
      chart.draw(data, options);
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
