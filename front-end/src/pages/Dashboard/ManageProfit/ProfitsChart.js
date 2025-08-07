import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import OrderService from '../../../services/api/OrderService';
const valueFormatter = (value) => `${value}K VND`;
const chartSetting = {
  series: [{ dataKey: 'totalProfit', label: 'Company profits', valueFormatter }],
  height: 300,
};

export default function ProfitsChart() {

  const [dataset, setDataset] = React.useState([]);

  React.useEffect(() => {
    const currentTime = new Date();
    const getAllProfits = async () => {
      const data = await OrderService.getAllProfitsByYear(currentTime.getFullYear());
      data.forEach(element => {
        element.totalProfit = element.totalProfit / 1000;
      });
      setDataset(data);
    }
    getAllProfits();
  }, [])

  return (
    <div style={{ width: '100%' }}>
      <BarChart
        dataset={dataset}
        xAxis={[
          { scaleType: 'band', dataKey: 'month', tickPlacement: 'middle', tickLabelPlacement: 'middle' },
        ]}
        {...chartSetting}
      />
    </div>
  );
}
