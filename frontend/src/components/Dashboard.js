import React, { useState } from 'react';
import TransactionTable from './TransactionTable';
import Statistics from './Statistics';
import BarChartComponent from './BarChart';
import PieChartComponent from './PieChart';

const Dashboard = () => {
    const [month, setMonth] = useState('March');

    return (
        <div>
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((monthName) => (
                    <option key={monthName} value={monthName}>
                        {monthName}
                    </option>
                ))}
            </select>
            <h1>Transactions Table</h1>
            <TransactionTable month={month} />
            <h1>Statistics</h1>
            <Statistics month={month} />
            <h1>Bar Chart</h1>
            <BarChartComponent month={month} />
            <h1>Pie Chart</h1>
            <PieChartComponent month={month} />
        </div>
    );
};

export default Dashboard;
