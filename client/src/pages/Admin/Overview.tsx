import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from "chart.js";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { useUser } from "../../context/UserContextProvider";
import { useEffect, useMemo, useState } from "react";
import { UseOrders } from "../../context/OrderContextProvider";
import * as OrderServices from "../../services/Order.service";
import { Order } from "../../types/types";
import { currency } from "../../helper/helper";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

interface MonthlySalesData {
    month: string;
    total_sales: number;
}

interface ChartDataType {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[]
    }[]
}

const MonthsOfYear = [
    "Jan", "Feb", "Mar","Apr",
    "May", "Jun","Jul", "Aug", 
    "Sep", "Oct", "Nov", "Dec"
];

const MetricCard = ({ title, value, change }: { title: string; value: number; change: number }) => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold mb-2">{value}</p>
      <p className={`flex items-center ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
        {Math.abs(change)}% since last week
      </p>
    </div>
);

interface ChartProp {
    chartData: ChartDataType;
}

const Chart = ({chartData}: ChartProp) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Monthly Sales</h3>
      <div>
        <Bar data={chartData} className="" />
      </div>
    </div>
);

interface OrdersProps {
    orders: Order[];
}

const RecentOrders = ({ orders }: OrdersProps) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td className="px-4 py-2 whitespace-nowrap">{order.order_id}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{order.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{new Date(order.order_date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{currency.format(order.total_amount)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
}

const SalesOverview = () => {
    const { users } = useUser();
    const { orders } = UseOrders();
    const [chartData, setChartData] = useState<ChartDataType>({
        labels: MonthsOfYear,
        datasets: []
    });

    useEffect(() => {
        (async () => {
            const monthlySales = await OrderServices.getMonthlyOrderTotal() as MonthlySalesData[];
            const salesMap = new Map(monthlySales.map(item => [new Date(item.month).toLocaleString('default', { month: 'short'}), item.total_sales]));
            const salesForAllMonths = MonthsOfYear.map(month => salesMap.get(month) || 0);

            // console.log("Montly Sales: ", new Date(monthlySales.month).toLocaleString('default', { month: 'short'}));
            setChartData({
                labels: MonthsOfYear,
                datasets: [
                    {
                        label: "Monthly Sales",
                        data: salesForAllMonths, // Later replace with the actual data from the Backend
                        backgroundColor: ['rgb(75, 192, 192)', 'rgb(75, 125, 200)', 'rgb(105, 80, 192)']
                    }
                ]
            })
        })();
    }, [orders]);

    const noOfUsers = useMemo(() => {
       return users.filter(user => user.role === "user").length
    }, [users]);

    const totalSalesAmount = useMemo(() => {
        return orders
                .filter(order => order.status === "completed")
                .reduce((acc, { total_amount }) => Number(acc) + Number(total_amount), 0);
    }, [orders]);

    return (
        <>
            <div className="flex min-h-screen">
                <main className="flex-1">
                    <h2 className="text-2xl font-semibold mb-6">Overview Pages</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <MetricCard title="Total Sales" value={totalSalesAmount} change={2.65} />
                        <MetricCard title="Customers" value={noOfUsers} change={2.65} />
                        <MetricCard title="Orders" value={orders.length} change={-1.02} />
                    </div>
                    <div className="grid gird-flow-row 2xl:grid-flow-col grid-cols-2 gap-4">
                        <Chart chartData={chartData}/>
                        <RecentOrders orders={orders} />
                    </div>
                </main>
            </div>

            {/* <div>
                <h2>Recent Orders</h2>
                <table>
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Id</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        { orders?.map(order => (
                            <tr key={order.order_id}>
                                <td className="px-6 py-4 whitespace-nowrap">{order.order_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{order.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(order.order_date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{order.total_amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}

        </>
    )
}

export default SalesOverview;
;



