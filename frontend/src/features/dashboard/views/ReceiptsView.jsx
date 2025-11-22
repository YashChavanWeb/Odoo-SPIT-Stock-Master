import { useState } from 'react';
import Button from '../../../components/ui/Button';
import TableView from '../components/TableView';
import KanbanView from '../components/KanbanView';
import SearchBar from '../../../components/ui/SearchBar';
import Tooltip from '@mui/material/Tooltip';
import ReceiptDetail from '../components/receipt/ReceiptDetail';

const sampleData = [
  { reference: 'WH/IN/0001', from: 'Vendor', to: 'WH/Stock1', contact: 'Azure Interior', scheduleDate: '2025-11-22', status: 'Ready' },
  { reference: 'WH/IN/0002', from: 'Vendor', to: 'WH/Stock2', contact: 'Azure Interior', scheduleDate: '2025-11-23', status: 'Waiting' },
];

const ReceiptsView = ({ onBack }) => {
  const [viewMode, setViewMode] = useState('list');
  const [search, setSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null); // NEW

  const filteredData = sampleData.filter(d =>
    d.reference.toLowerCase().includes(search.toLowerCase()) ||
    d.from.toLowerCase().includes(search.toLowerCase()) ||
    d.to.toLowerCase().includes(search.toLowerCase()) ||
    d.contact.toLowerCase().includes(search.toLowerCase())
  );

  // Render detail page if a receipt is selected
  if (selectedReceipt) {
    return (
      <ReceiptDetail
        receipt={selectedReceipt}
        onBack={() => setSelectedReceipt(null)}
        currentUser="Operator" // Replace with actual logged-in user
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tooltip title="Back to previous page" arrow>
          <Button variant="ghost" onClick={onBack}>
            <ion-icon name="arrow-back-outline" class="mr-2 dark:text-yellow-300 text-yellow-800"></ion-icon>
            Back
          </Button>
        </Tooltip>

        <div className="flex gap-2 items-center">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by reference/contact..." />

          <Tooltip title="Switch to List view" arrow>  
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'contained' : 'outlined'}
            >
              <ion-icon name="list-outline" size='large' class="mr-1 dark:text-yellow-300 text-yellow-800"></ion-icon>
            </Button>
          </Tooltip>

          <Tooltip title="Switch to Kanban view" arrow>
            <Button
              onClick={() => setViewMode('kanban')}
              variant={viewMode === 'kanban' ? 'contained' : 'outlined'}
            >
              <ion-icon name="calendar-clear-outline" size='large' class="mr-1 dark:text-yellow-300 text-yellow-800"></ion-icon>
            </Button>           
          </Tooltip>
        </div>
      </div>

      {viewMode === 'list' 
        ? <TableView data={filteredData} onRowClick={(row) => setSelectedReceipt(row)} /> 
        : <KanbanView data={filteredData} />
      }
    </div>
  );
};

export default ReceiptsView;
