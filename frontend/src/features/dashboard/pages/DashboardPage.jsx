// src/features/dashboard/pages/DashboardPage.jsx
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import DashboardCard from '../components/DashboardCard';
import ReceiptsView from '../views/ReceiptsView';
import DeliveryView from '../views/DeliveryView';

const DashboardPage = () => {
  const [activeView, setActiveView] = useState('dashboard');

  if (activeView === 'receipts') return <ReceiptsView onBack={() => setActiveView('dashboard')} />;
  if (activeView === 'delivery') return <DeliveryView onBack={() => setActiveView('dashboard')} />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Grid container spacing={6} className="w-full">
        <Grid item xs={12} sm={12} md={6} className="flex">
          <DashboardCard
            title="Receipts"
            highlightCount={4}
            stats={{ late: 1, operations: 6 }}
            onClick={() => setActiveView('receipts')}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} className="flex">
          <DashboardCard
            title="Delivery"
            highlightCount={4}
            stats={{ late: 1, waiting: 2, operations: 3 }}
            onClick={() => setActiveView('delivery')}
          />
        </Grid>
      </Grid>

    </div>
  );
};

export default DashboardPage;
