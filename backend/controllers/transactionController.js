const axios = require('axios');
const Transaction = require('../models/Transaction');

const THIRD_PARTY_API_URL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

exports.initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get(THIRD_PARTY_API_URL);
        const transactions = response.data;

        await Transaction.deleteMany({});
        await Transaction.insertMany(transactions);

        res.status(200).json({ message: 'Database initialized with seed data' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTransactions = async (req, res) => {
    const { month, page = 1, perPage = 10, search = '' } = req.query;
    const searchRegex = new RegExp(search, 'i');
    const monthInt = new Date(Date.parse(month + " 1, 2021")).getMonth();

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $regex: `-${String(monthInt + 1).padStart(2, '0')}-` },
            $or: [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { price: { $regex: searchRegex } },
            ],
        })
        .skip((page - 1) * perPage)
        .limit(parseInt(perPage));

        const totalTransactions = await Transaction.countDocuments({
            dateOfSale: { $regex: `-${String(monthInt + 1).padStart(2, '0')}-` },
            $or: [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { price: { $regex: searchRegex } },
            ],
        });

        res.status(200).json({
            transactions,
            totalPages: Math.ceil(totalTransactions / perPage),
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStatistics = async (req, res) => {
    const { month } = req.query;
    const monthInt = new Date(Date.parse(month + " 1, 2021")).getMonth();

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $regex: `-${String(monthInt + 1).padStart(2, '0')}-` },
        });

        const totalSales = transactions.reduce((acc, curr) => acc + curr.price, 0);
        const soldItems = transactions.filter(t => t.sold).length;
        const notSoldItems = transactions.filter(t => !t.sold).length;

        res.status(200).json({ totalSales, soldItems, notSoldItems });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBarChart = async (req, res) => {
    const { month } = req.query;
    const monthInt = new Date(Date.parse(month + " 1, 2021")).getMonth();

    const priceRanges = {
        '0-100': 0,
        '101-200': 0,
        '201-300': 0,
        '301-400': 0,
        '401-500': 0,
        '501-600': 0,
        '601-700': 0,
        '701-800': 0,
        '801-900': 0,
        '901+': 0,
    };

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $regex: `-${String(monthInt + 1).padStart(2, '0')}-` },
        });

        transactions.forEach(transaction => {
            if (transaction.price <= 100) priceRanges['0-100']++;
            else if (transaction.price <= 200) priceRanges['101-200']++;
            else if (transaction.price <= 300) priceRanges['201-300']++;
            else if (transaction.price <= 400) priceRanges['301-400']++;
            else if (transaction.price <= 500) priceRanges['401-500']++;
            else if (transaction.price <= 600) priceRanges['501-600']++;
            else if (transaction.price <= 700) priceRanges['601-700']++;
            else if (transaction.price <= 800) priceRanges['701-800']++;
            else if (transaction.price <= 900) priceRanges['801-900']++;
            else priceRanges['901+']++;
        });

        res.status(200).json(priceRanges);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPieChart = async (req, res) => {
    const { month } = req.query;
    const monthInt = new Date(Date.parse(month + " 1, 2021")).getMonth();

    try {
        const transactions = await Transaction.aggregate([
            { $match: { dateOfSale: { $regex: `-${String(monthInt + 1).padStart(2, '0')}-` } } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);

        const pieChartData = transactions.map(transaction => ({
            category: transaction._id,
            count: transaction.count,
        }));

        res.status(200).json(pieChartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCombinedData = async (req, res) => {
    try {
        const transactionsData = await exports.getTransactions(req, res);
        const statisticsData = await exports.getStatistics(req, res);
        const barChartData = await exports.getBarChart(req, res);
        const pieChartData = await exports.getPieChart(req, res);

        res.status(200).json({
            transactions: transactionsData,
            statistics: statisticsData,
            barChart: barChartData,
            pieChart: pieChartData,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
