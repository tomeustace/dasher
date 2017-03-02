<template>
  <component-shell>
    <div slot="widget" v-on:update="configUpdate">
      <h2>Dynamic Bar Chart</h2>
      <div id="dynamic-bar" slot="widget" :config="config"> </div>
    </div>
  </component-shell>
</template>

<script>

import ComponentShell from './../components/ComponentShell';

/*eslint-disable*/
//const d3 = require('d3');

let margin = { top: 20, right: 20, bottom: 70, left: 40 };
let width = 300 - margin.left - margin.right;
let height = 150 + margin.top + margin.bottom;

function updateBarEx(conf, cid) {

  let y = d3.scale.linear().range([0, (height - margin.top)]);
  let x = d3.scale.ordinal().rangeBands([0, width], .10); 
  let svg = d3.select('#dynamic-bar').select('svg');
  // UPDATE Existing data 
//  svg.selectAll('rect').style("fill", "green").style("opacity", "0.5").data(data).transition().duration(200)
//      .delay(function(d, i) {
//        return i / data.length * 1000;
//      })
//      .duration(500).attr("y", function(d) {
//        return height - y(d.value) + 5;
//      })
//      .attr("height", function(d) {
//        return y(d.value) - 20;
//      })
//      .style("opacity", "1").style("filter", "url(#drop-shadow)").style("fill", function(d) {
//        return "rgb(0, 0, " + (d.value * 10) + ")";
//      });
//
  //Update all labels
  svg.selectAll(".labels").data(conf.selected.Names).transition().delay(500).duration(500).text(function(d) {
        return d.value;
     })
     .attr("x", function(d, i) {
        return (i * x.rangeBand()) + (x.rangeBand() / 2) + (i * i);
     })
     .attr("y", function(d) {
        //return height - y(d.value) + 30;
        return height - y(10) + 30;
     })
     .attr("font-family", "sans-serif").attr("font-size", "12px").attr("fill", "white");

  // ENTER
  // create rect and labels
  svg.selectAll('rect').data(conf.selected.Names).enter().append("rect").style("fill", "steelblue")
      .attr("x", function(d) {
        return x(d);
      })
      .attr("width", x.rangeBand()) .attr("height", function(d) {
        return y(20) - 20; 
      }) 
      .transition().duration(1000)
      .attr("y", function(d) {
        return height - y(20);
      })
      .attr("height", function(d) {
          return y(20) - 20;
      });

  svg.selectAll(".labels").data(conf.selected.Names).enter().append('text')
     .text(function(d) {
        return 20;
     })
     .attr('class','labels')
     .attr("x", function(d, i) {
        return (i * x.rangeBand()) + x.rangeBand() / 2;
     })
     .attr("y", function(d) {
        return height; 
     })
     .attr("font-family", "sans-serif").attr("font-size", "12px").attr("fill", "green");

  var defs = svg.append("defs");

  var filter = defs.append("filter").attr("id", "drop-shadow").attr("height", "130%"); 
  filter.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", 5).attr("result", "blur");
  filter.append("feOffset").attr("in", "blur").attr("dx", 5).attr("dy", 5).attr("result", "offsetBlur");
  var feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "offsetBlur")
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");
}

/*eslint-disable */
/*widgets should be able to provide a structure for their configuration.  However they should not be concerned with how it is saved or retreived.*/
const vm = {
  props: ['id','viewname'],
  data() {
    return {
      svg: {},
      name: 'Dynamic Bar Chart',
      widgetConfig: [
      { type: 'select', name: 'Names', options: [{id:'Mary'},{id:'James'},{id:'Paul'},{id:'Sue'},{id:'Max'}] },
      ],
    }
  },
  computed: { },
  methods: {
   configUpdate() {
     alert('yes');
   },
  },
  //can use this.$store.subscribe... also
  computed: {
    config () {
      let config = this.$store.state.config;
      console.log('Dynamic Bar got config update' + this.cid);
      if(config.default.length > 0) {
        let conf = this.$store.getters.getWidgetConfig(this.$parent.id, this.cid);
        //updateBarEx(conf, this.$children[0].cid);
        //updateBar(this.svg, data);
      }
    },
  },
  mounted() {
    /*eslint-disable*/
    this.cid = this.$children[0].cid;
    var margin, width, height, parseDate, x, y, xAxis, yAxis, svg;
    var initialised = false;
    var socket = new WebSocket("ws://localhost:9090/", "dashboard-issues");
    socket.onopen = function(event) {
      this.svg = createBar();
      socket.send("issues");
    };

    socket.onclose = function(event) {
      console.log("Connection closed");
    };
    socket.onmessage = function(event) {
      var data = JSON.parse(event.data);
      var key = Object.keys(data.text)[0];
      data = data.text[key];
      if(!initialised) {
        initialise(this.svg, data);
        updateBar(this.svg, data);
      } else {
        updateBar(this.svg, data);
      }
    };

    function createBar() {
      margin = { top: 20, right: 20, bottom: 70, left: 40 },
      width = 300 - margin.left - margin.right,
      height = 150 + margin.top + margin.bottom;

      y = d3.scale.linear().range([0, (height - margin.top)]);
      x = d3.scale.ordinal().rangeBands([0, width], .10); 

      xAxis = d3.svg.axis().scale(x).orient("bottom");

      let svg = d3.select("#dynamic-bar").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      return svg;
    }

    function initialise(svg, data) {
      initialised = true;

      //add y domain
      y.domain([0, d3.max(data, function(d) {
         return d.value;
          })]);

          //add x domain
          x.domain(data.map(function(d) {
              return d.user;
          }));

          //append and call xAxis
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);
    }

    function updateBar(svg, data) {
  
      // UPDATE Existing data 
      svg.selectAll('rect').style("fill", "green").style("opacity", "0.5").data(data).transition().duration(200)
          .delay(function(d, i) {
            return i / data.length * 1000;
          })
          .duration(500).attr("y", function(d) {
            return height - y(d.value) + 5;
          })
          .attr("height", function(d) {
            return y(d.value) - 20;
          })
          .style("opacity", "1").style("filter", "url(#drop-shadow)").style("fill", function(d) {
            return "rgb(0, 0, " + (d.value * 10) + ")";
          });

      //Update all labels
      svg.selectAll(".labels").data(data).transition().delay(function(d, i) {
            return i / data.length * 1000;
         })
         .duration(500).text(function(d) {
            return d.value;
         })
         .attr("x", function(d, i) {
            return (i * x.rangeBand()) + (x.rangeBand() / 2) + (i * i);
         })
         .attr("y", function(d) {
            return height - y(d.value) + 30;
         })
         .attr("font-family", "sans-serif").attr("font-size", "12px").attr("fill", "white");

      // ENTER
      // create rect and labels
      svg.selectAll('rect').data(data).enter().append("rect").style("fill", "steelblue")
          .attr("x", function(d) {
            return x(d.user);
          })
          .attr("width", x.rangeBand()) .attr("height", function(d) {
            return y(d.value) - 20; 
          }) 
          .transition().duration(1000)
          .attr("y", function(d) {
            return height - y(d.value);
          })
          .attr("height", function(d) {
              return y(d.value) - 20;
          });

      svg.selectAll(".labels").data(data).enter().append('text')
         .text(function(d) {
            return d.value;
         })
         .attr('class','labels')
         .attr("x", function(d, i) {
            return (i * x.rangeBand()) + x.rangeBand() / 2;
         })
         .attr("y", function(d) {
            return height; 
         })
         .attr("font-family", "sans-serif").attr("font-size", "12px").attr("fill", "green");

      var defs = svg.append("defs");

      var filter = defs.append("filter").attr("id", "drop-shadow").attr("height", "130%"); 
      filter.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", 5).attr("result", "blur");
      filter.append("feOffset").attr("in", "blur").attr("dx", 5).attr("dy", 5).attr("result", "offsetBlur");
      var feMerge = filter.append("feMerge");
      feMerge.append("feMergeNode").attr("in", "offsetBlur")
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");
    }

  },
  components: {
    ComponentShell,
  }
};


/*eslint-disable */
export default vm;
</script>

<style> </style>
