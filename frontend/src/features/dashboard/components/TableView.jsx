// src/features/dashboard/components/TableView.jsx
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '../../../components/ui/Card';
import { useThemeMode } from "../../../context/ThemeContext"
import Tooltip from '@mui/material/Tooltip';

const statusIconMap = {
  Draft: 'document-outline',
  Waiting: 'time-outline',
  Ready: 'checkmark-done-outline',
  Done: 'checkmark-circle-outline',
  Cancelled: 'close-circle-outline',
};

const statusColorMap = {
  Draft: '#FACC15',      // amber-400
  Waiting: '#F59E0B',    // amber-500
  Ready: '#10B981',      // green-500
  Done: '#3B82F6',       // blue-500
  Cancelled: '#EF4444',  // red-500
};

const TableView = ({ data , onRowClick }) => {
  const { mode } = useThemeMode();

  const headerBg = mode === 'dark' ? '#2A2A2A' : '#E5E5E5';
  const headerText = mode === 'dark' ? '#FFD966' : '#4B3621';
  const rowText = mode === 'dark' ? '#FFFFFF' : '#000000'; 

  return (
<Card className={`overflow-x-auto p-4 ${mode === 'dark' ? 'bg-black' : 'bg-white'}`}>
  <Table className="text-xl">
    <TableHead>
      <TableRow style={{ backgroundColor: headerBg }}>
        {['Reference', 'From', 'To', 'Contact', 'Schedule Date', 'Status'].map((col) => (
          <TableCell key={col} style={{ color: headerText, fontWeight: 'bold', fontSize: '1.125rem' }}>
            {col}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {data.length === 0 ? (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-6 text-gray-500 text-lg">
            Loading...
          </TableCell>
        </TableRow>
      ) : (
        data.map((row, idx) => (
          <TableRow
            key={idx}
            className="hover:bg-yellow-50 dark:hover:bg-gray-800 transition-colors"
            style={{ cursor: 'pointer', color: rowText, fontSize: '2rem' }}
            onClick={() => onRowClick(row)}
          >
            <TableCell>{row.reference}</TableCell>
            <TableCell>{row.from}</TableCell>
            <TableCell>{row.to}</TableCell>
            <TableCell>{row.contact}</TableCell>
            <TableCell>{row.scheduleDate}</TableCell>
            <TableCell>
              <Tooltip title={row.status} arrow>
                <span className="flex items-center gap-1 px-2 py-1 rounded-full font-medium justify-evenly"
                  style={{
                    backgroundColor: mode === 'dark'  
                      ? `${statusColorMap[row.status]}33` 
                      : `${statusColorMap[row.status]}44`,  
                    color: statusColorMap[row.status],
                  }}
                >
                  <ion-icon
                    name={statusIconMap[row.status] || 'help-circle-outline'} size='large'
                    style={{ fontSize: '1rem', color: statusColorMap[row.status] }}
                  />
                  {row.status}
                </span>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
</Card>

  );
};

export default TableView;
