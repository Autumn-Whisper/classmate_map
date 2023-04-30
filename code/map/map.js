var echarts = require('echarts');
// 请确保在引入百度地图扩展之前已经引入百度地图 JS API 脚本并成功加载
// https://api.map.baidu.com/api?v=3.0&ak=你申请的AK
require('echarts/extension/bmap/bmap');

var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);
var option;

const data = [
  { name: '李四', city: '合肥', university: '一号大学' },
  { name: '王五', city: '合肥', university: '二号大学' },
  { name: '赵六', city: '武汉', university: '三号大学' },
  { name: '孙七', city: '武汉', university: '四号大学' },
  { name: '周八', city: '武汉', university: '五号大学' },
  { name: '郑九', city: '大庆', university: '六号大学' }
];
const geoCoordMap = {
  合肥: [117.27, 31.86],
  武汉: [114.31, 30.52],
  大庆: [125.03, 46.58]
};
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
