import React, { useState, useEffect } from 'react';
import { getBarChart } from '../services/apiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BarChartComponent = ({ month }) => {
    const [barData, setBarData] = useState([]);

    useEffect(() => {
        fetchBarChart();
    }, [month]);

    const fetchBarChart = async () => {
        const response = await getBarChart(month);
        const data = Object.keys(response.data).map((key) => ({
            name: key,
            count: response.data[key],
        }));
        setBarData(data);
    };

    return (
        <BarChart width={600} height={300} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
    );
};

export default BarChartComponent;
