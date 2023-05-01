var echarts = require('echarts');
require('echarts/extension/bmap/bmap');
var d3 = require('d3');

var chartDom = document.getElementById('map');
var myChart = echarts.init(chartDom);
var option;

d3.csv("content/students.csv").then(function (data) {
  d3.csv("content/location.csv").then(function (geoCoordData) {
    let geoCoordMap = {};
    geoCoordData.forEach((row) => {
      geoCoordMap[row.city] = [+row.longitude, +row.latitude];
    });

    const convertData = function (data) {
      let res = [];
      let resultMap = {};

      for (let i = 0; i < data.length; i++) {
        let cityName = data[i].city;
        let geoCoord = geoCoordMap[cityName];
        if (geoCoord) {
          if (!resultMap[cityName]) {
            resultMap[cityName] = {
              name: cityName,
              value: geoCoord.concat(0),
              classmates: []
            };
            res.push(resultMap[cityName]);
          }
          resultMap[cityName].classmates.push(
            `${data[i].name} ${data[i].university}`
          );
          resultMap[cityName].value[2]++;
        }
      }

      return res;
    };

    option = {
      title: {
        text: '同学分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return `${params.name}<br/>${params.data.classmates.join('<br/>')}`;
        }
      },
      bmap: {
        center: [104.114129, 37.550339],
        zoom: 5,
        roam: true
      },
      series: [
        {
          name: '同学分布',
          type: 'scatter',
          coordinateSystem: 'bmap',
          data: convertData(data),
          symbolSize: function (val) {
            return 10;
          },
          encode: {
            value: 3
          },
          itemStyle: {
            color: '#505050'
          },
          label: {
            formatter: '{b}',
            position: 'right',
            show: false
          },
          emphasis: {
            label: {
              show: true
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  });
});
