<template>
  <component-shell>
      <!-- this binds config from component shell to widget -->
      <div slot="widget" :config="config" id="d3pie"> </div>
  </component-shell>
</template>

<script>
/*eslint-disable*/
import { mapState } from 'vuex';
import ComponentShell from './../components/ComponentShell';

let cid;
var svg, pie, arc, color, legendGroup, legendCount;
var optionsCreated = false;
var socket = new WebSocket("ws://localhost:8080/", "dashboard-visitor");

socket.onopen = function(event) {
  socket.send("visitor");
  createPie(cid);
};

socket.onclose = function(event) {
    console.log("Connection closed");
}

socket.onmessage = function(event) {
  if (event.currentTarget.protocol === "dashboard-visitor") {
    var data = JSON.parse(event.data);
    updatePie(data.text);
  }
}

function createPie(widgetId) {
  //let selector = `[widget-cid="${widgetId}"]`;
  let selector = '#d3pie';
  var width = 280, height = 300, radius = Math.min(width, height) / 2;
    color = d3.scale.category10();
    pie = d3.layout.pie()
        .value(function(d) {
            var key = Object.keys(d)[1];
            return d[key];
        })
        .sort(null);

  arc = d3.svg.arc().innerRadius(radius - 100).outerRadius(radius - 65);

  svg = d3.select(selector) 
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var legend = d3.select(selector).append("svg")
      .attr("width", width / 2)
      .attr("height", height / 1.5);

  legendGroup = legend.append("g").attr("transform", "translate(0,20)");
  legendCount = legend.append("g").attr("transform", "translate(80,20)");

  var div = d3.select("body").append("div").attr("class", "toolTip");
}

function updatePie(data) {

  legendGroup.selectAll('text')
    .data(function() {
      var key = Object.keys(data)[0];
      return data[key];
    })
    .enter()
    .append('text')
    .attr('x', '10')
    .attr('y', function(d, i) {
        return 25 * i;
    })
    .style('stroke', function(d, i) {
        return color(i);
    })
    .text(function(d) {
      var key = Object.keys(d)[0];
      return d[key];
    });

  legendCount.selectAll('text')
      .data(function() {
        var key = Object.keys(data)[0];
        return data[key];
      })
      .enter()
      .append('text')
      .attr('x', '10')
      .attr('y', function(d, i) {
          return 25 * i;
      })
      .style('fill', function(d, i) {
          return color(i);
      })
      .text(function(d) {
          var key = Object.keys(d)[1];
          return d[key];
      });

  legendCount
      .selectAll('text')
      .data(function() {
        var key = Object.keys(data)[0];
        return data[key];
      })
      .text(function(d) {
          var key = Object.keys(d)[1];
          return d[key];
      });

  svg.selectAll("path")
      .data(function() {
        var key = Object.keys(data)[0];
        return pie(data[key]);
      })
      .enter()
      .append("path")
      .attr("fill", function(d, i) {
          return color(i);
      })
      .attr("d", arc)
      .each(function(d) {
          this._current = d;
      });

    svg.selectAll("path")
      .data(function() {
        var key = Object.keys(data)[0];
        return pie(data[key]);
      })
      .transition()
      .duration(750)
      .attrTween("d", arcTween); // redraw the arcs
    
  function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
          return arc(i(t));
      };
  }
}

const vm = {
  data() {
    return { 
      //get tables from store getter
      name: 'D3 Pie',
      widgetConfig: [],
    }
  },
  methods: { },
  mounted() {
    //TODO get config to pass in
    this.cid = this.$children[0].cid;
    let cid = this.cid;
    console.log('D3 Pie mounted ' + this.cid);
    //is this right/best way to get cid here
      //wait for element to render
      //initPie(cid);
      //TODO THIS IS COMING BACK AS ARRAY SHOULD BE CONFIG OBJECT
      //let conf = this.$store.getters.getWidgetConfig(this.$parent.id, this.cid);
      //TODO need to update upateTableData to operate refresh
      //if(!_.isUndefined(conf)) {
      //  let cid = this.cid;
      //  updatePie(conf, 5, cid);
      //}
  },
  //can use this.$store.subscribe... also
  computed: {
    config () {
      let conf = this.$store.getters.getWidgetConfig(this.$parent.id, this.cid);
      if(!_.isUndefined(conf)) {
        //this.$store.getters.updateTableData(conf).then( response => {
        //    let data = response.body;
            console.log(data);
            //updatePie(conf, parseInt(data.measures), this.$children[0].cid);
            //updatePie(conf, '', this.$children[0].cid);
        //  }, response => {
        //    console.log('error retrieving data for ' + uri);
        //  }
        //);
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
