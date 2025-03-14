import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem
} from '@mui/material';
import { DownloadOutlined } from '@mui/icons-material';
import { PieChart, Pie, Cell, Legend } from 'recharts';

const SubscriptionReports = () => {
  const [reports, setReports] = useState({
    summary: {},
    details: [],
    metrics: []
  });
  const [reportType, setReportType] = useState('monthly');

  useEffect(() => {
    fetchReports();
  }, [reportType]);

  const fetchReports = async () => {
    try {
      const response = await fetch(`/api/admin/reports/subscriptions?type=${reportType}`);
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const exportReport = async () => {
    try {
      const response = await fetch(`/api/admin/reports/export?type=${reportType}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscription-report-${reportType}.xlsx`;
      a.click();
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Subscription Reports
          <Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            size="small"
            sx={{ ml: 2 }}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
          <Button
            startIcon={<DownloadOutlined />}
            onClick={exportReport}
            sx={{ float: 'right' }}
          >
            Export Report
          </Button>
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <PieChart width={400} height={300}>
              <Pie
                data={reports.metrics}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {reports.metrics.map((entry, index) => (
                  <Cell key={index} fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </Grid>

          <Grid item xs={12} md={6}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell align="right">Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Total Active Subscriptions</TableCell>
                  <TableCell align="right">{reports.summary.activeCount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Monthly Recurring Revenue</TableCell>
                  <TableCell align="right">${reports.summary.mrr}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Churn Rate</TableCell>
                  <TableCell align="right">{reports.summary.churnRate}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SubscriptionReports;