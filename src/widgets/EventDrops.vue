<template>
  <component-shell>
      <!-- this binds config from component shell to widget -->
      <div slot="widget" :config="config" id="event-drops"> </div>
  </component-shell>
</template>

<script>
/*eslint-disable*/
import { mapState } from 'vuex';
import ComponentShell from './../components/ComponentShell';
import eventDrops from 'event-drops';

function updateTimeline(conf, widgetId) {
      // create dataset
      var data = [];
      var endTime = Date.now();
      var month = 30 * 24 * 60 * 60 * 1000;
      var startTime = endTime - 6 * month;

      function createEvent (name, maxNbEvents) {
          maxNbEvents = maxNbEvents | 200;
          var event = { name: name, dates: [] };
          // add up to 200 events
          var max =  Math.floor(Math.random() * maxNbEvents);
          for (var j = 0; j < max; j++) {
              var time = (Math.random() * (endTime - startTime)) + startTime;
              event.dates.push(new Date(time));
          }
          return event;
      }
      for (var i = 0; i < conf.length; i++) {
          data.push(createEvent(conf[i]));
      }

      var color = d3.scale.category20();

      // create chart function
      var eventDropsChart = d3.chart.eventDrops()
          .eventLineColor(function (datum, index) {
              return color(index);
          })
          .eventHover(function(d) {
              console.log(d);
              console.log(this);
              d3.select(this)
                .on('mouseout', function() {
                  d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r','4');
                })
                .transition()
                .duration(500)
                .attr('r','20');
          })
          .start(new Date(startTime))
          .end(new Date(endTime));

      // bind data with DOM
      let selector = `[widget-cid="${widgetId}"]`;
      d3.select(selector).select('svg').remove();
      var element = d3.select(selector).datum(data);
      // draw the chart
      eventDropsChart(element);
}

const vm = {
  data() {
    return {
      //get tables from store getter
      name: 'D3 Event Drops',
      widgetConfig: [
      { type: 'select', name: 'Services', options:[{id:"Car"}, {id:"Home"}, {id:"Business"}, {id:"Life"}, {id:"Loans"}, {id:"Planning"}] },
      ],
    }
  },
  methods: { },
  mounted() {
    //this is required to set cid
    this.cid = this.$children[0].cid;
    let conf = this.$store.getters.getWidgetConfig(this.$parent.id, this.cid);
    let that = this;
    if(!_.isUndefined(conf)) {
      setTimeout(function() {
        updateTimeline(conf.Services, that.cid);
      }, 2000);
    }
  },
  //can use this.$store.subscribe... also
  computed: {
    config () {
      let conf = this.$store.getters.getWidgetConfig(this.$parent.id, this.cid);
      if(!_.isUndefined(conf) && !_.isUndefined(conf.selected)) {
        console.log('Event Drops config updated ');
        updateTimeline(conf.selected.Services, this.$children[0].cid);
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
#event-drops {
  min-width: 600px;
}
</style>
