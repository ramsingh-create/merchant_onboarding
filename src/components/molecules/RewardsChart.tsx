import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
    name: string;
    Earning: number;
    Utilization: number;
}

const RewardsChart = ({ chartData }: { chartData: ChartData[] }) => {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE7F6" />
                <XAxis
                    dataKey="name"
                    tick={{ fill: '#7E67DA', fontSize: 12 }}
                    axisLine={{ stroke: '#EDE7F6' }}
                />
                <YAxis
                    tick={{ fill: '#7E67DA', fontSize: 12 }}
                    axisLine={{ stroke: '#EDE7F6' }}
                    tickFormatter={(value) => value !== 0 ? `${value}K` : '0'}
                />
                <Tooltip />
                <Legend />
                <Bar
                    dataKey="Earning"
                    fill="#7E67DA"
                    radius={[6, 6, 0, 0]}
                    name="Earning"
                />
                <Bar
                    dataKey="Utilization"
                    fill="#D1C4E9"
                    radius={[6, 6, 0, 0]}
                    name="Utilization"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default RewardsChart;