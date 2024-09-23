import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from "chart.js";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const orders = [
    {
        orderId: 1,
        billingName: "Ye Htet",
        totalAmount: 1000,
        date: '2-Jan-2024',
        status: 'Success',
    },
    {
        orderId: 2,
        billingName: "Kaung Khant",
        totalAmount: 200,
        date: '13-Mar-2024',
        status: 'Success',
    },
    {
        orderId: 3,
        billingName: "Tim",
        totalAmount: 3800,
        date: '2-Sep-2024',
        status: 'Pending',
    },
]

const SalesOverview = () => {
    return (
        <>
            <h1>Overview Pages</h1>
            <div>
                {/* Summarize Data Cards  */}
                <div className="flex gap-4 justify-between">
                    <div className="shadow-lg p-4 rounded-sm">
                        <h1>$34,152</h1>
                        <h4>Total Revenue</h4>
                        <br />
                        <p> <ArrowUpIcon width={20} className="inline" /> 2.65% since last week </p>
                    </div>

                    <div className="shadow-lg p-4 rounded-sm">
                        <h1>100,152</h1>
                        <h4>Customers</h4>
                        <br />
                        <p> <ArrowUpIcon width={20} className="inline" /> 2.65% since last week </p>
                    </div>

                    <div className="shadow-lg p-4 rounded-sm">
                        <h1>14,002</h1>
                        <h4>Orders</h4>
                        <br />
                        <p> <ArrowDownIcon width={20} className="inline" /> 1.02% since last week </p>
                    </div>
                </div>
                <div>
                    <Bar 
                        data={{
                            labels: ["Jan", "Feb", "Mar"],// Later replace with the acutal data from Backend
                            datasets: [
                                {
                                    label: "Monthly Sales Ananlysis",
                                    data: [1000, 700, 1350], // Later replace with the actual data from the Backend
                                    backgroundColor: ['rgb(75, 192, 192)', 'rgb(75, 125, 200)', 'rgb(105, 80, 192)']
                                }
                            ]
                        }}
                    />
                </div>

                <div>
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
                                <tr key={order.orderId}>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.orderId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.billingName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.totalAmount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )
}

export default SalesOverview;
;