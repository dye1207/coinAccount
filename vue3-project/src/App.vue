<template>
  <div>
    <h1 style="text-align: center;">{{ name }}</h1>
    <v-chart class="chart" :autoresize="true" :option="option"></v-chart>
    <a-table :dataSource="accountList" :columns="columns" @change="handleTableChange"></a-table>
  </div>
</template>

<script>
import axios from 'axios';
import { provide, ref } from "vue";
import VChart, { THEME_KEY } from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
  PieChart,
]);

export default {
  name: 'App',
  components: {
    VChart
  },
  provide: {
    [THEME_KEY]: 'dark'
  },
  setup() {
    const accountList = ref([])
    const columns = ref([])
    const originAccountList = ref([])
    const option = ref({
      title: {
        text: 'upbit 자산 그래프',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      series: [
        {
          name: 'upbit자산 그래프',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            // { value: 335, name: 'Direct' },
            // { value: 310, name: 'Email' },
            // { value: 234, name: 'Ad Networks' },
            // { value: 135, name: 'Video Ads' },
            // { value: 1548, name: 'Search Engines' },
            // { value: 1548, name: 'Search Engines1' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    });
    async function test() {
      try {
        const output = await axios.get('http://localhost:3000/')
        const bitumbRes = await axios.get('http://localhost:3000/bitumb')
        console.log('bitumbRes: ', bitumbRes);
        
        
        accountList.value = output.data.map(accountInfo => {
          return {
            ...accountInfo,
            balanceLock: Number(accountInfo.balance) + Number(accountInfo.locked) 
          }
        })
        originAccountList.value = JSON.parse(JSON.stringify(accountList.value))
        console.log('originAccountList.value: ', originAccountList.value);

        // 사용할 수 있는 마켓코드 조회
        const marketAll = await axios.get('http://localhost:3000/market-all')
        console.log('marketAll: ', marketAll);
        const totalMarketCodeList = marketAll.data.map(marketInfo => marketInfo.market)


        const marketCodeList = originAccountList.value
          .filter(account => account.currency !== 'KRW')
          .map(account => 'KRW-'+account.currency)
          .filter(code => totalMarketCodeList.includes(code))

        // originAccountList.value
        const currentPrice = await axios.get(`http://localhost:3000/current-price?marketList=${marketCodeList.join()}`)
        console.log('currentPrice: ', currentPrice);
        const seriesData = originAccountList.value.map(account => ({value: Math.round(account.balanceLock*account.avg_buy_price
) , name: account.currency}))
        // const seriesData =[
        //   { value: 335, name: 'Direct' },
        //     { value: 310, name: 'Email' },
        //     { value: 234, name: 'Ad Networks' },
        //     { value: 135, name: 'Video Ads' },
        //     { value: 1548, name: 'Search Engines' },
        //     { value: 1548, name: 'Search Engines1' },
        //   ]
        // option.value = {...option.value, series: []}
        // series.data = seriesData
        // console.log('option.value.series.data: ', option.value.series.data);
        option.value.series[0].data = seriesData

        const korColNameMap = {
          currency: '자산',
          avg_buy_price: '매수평균',
          balanceLock: '보유'
        }


        const someAccount = accountList.value[0]
        const ignoreColList = [
          'avg_buy_price_modified',
          'unit_currency',
          'balance',
          'locked',
        ]
        const colNameList = Object.keys(someAccount)
        columns.value = colNameList
          .filter(colName => {
            return !ignoreColList.includes(colName)
          })
          .map(accountCol => ({
            title: korColNameMap[accountCol],
            dataIndex: accountCol,
            key: accountCol,
            sorter: true,
          }))
        // try ~ catch 활용해서 get으로 우선 데이터 전체 가져오기먼저
        // 다 가져온 다음에는 


      } catch (error) {

        //
      }

    }
    test()


    const handleTableChange = (pag, filters, sorter) => {

      if (!sorter.order) {
        accountList.value = originAccountList.value
      } else {
        accountList.value.sort(function (a, b) {
          if (sorter.order === "ascend") {
            return a[sorter.columnKey] - b[sorter.columnKey]
          } else if (sorter.order === "descend") {
            return b[sorter.columnKey] - a[sorter.columnKey]
          }
        });
      }
    };


    return {
      accountList, originAccountList, columns, option, handleTableChange

    }
  },
  // data() {
  //   return{
  //     name: 'Upbit Account',
  //     postList: [],
  //     accountList: [],
  //     columns: []

  //   }
  // }
}
</script>

<style>
.ant-table-thead>tr>th {
  font-weight: bold;
}

.chart {
  height: 400px;
}
</style>
