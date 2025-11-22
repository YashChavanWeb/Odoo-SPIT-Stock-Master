// src/features/dashboard/components/KanbanView.jsx
import Card from '../../../components/ui/Card';
import clsx from 'clsx';

const STATUS_COLOR = {
  Draft: 'bg-gray-700/50 text-gray-200',
  Waiting: 'bg-yellow-600/30 text-yellow-300',
  Ready: 'bg-green-600/30 text-green-300',
  Done: 'bg-blue-600/30 text-blue-400',
  Cancelled: 'bg-red-600/30 text-red-300',
};

const KanbanView = ({ data }) => {
  const statuses = ['Draft', 'Waiting', 'Ready', 'Done', 'Cancelled'];

  return (
    <div className="flex gap-4 overflow-x-auto py-4 px-2">
      {statuses.map((status) => (
        <div
          key={status}
          className="flex-1 min-w-[260px] flex flex-col bg-gray-100 dark:bg-gray-900 rounded-xl p-2 shadow-sm"
        >
          <h4
            className={clsx(
              'font-semibold text-lg mb-3 px-3 py-1 rounded-md text-center',
              STATUS_COLOR[status]
            )} 
          >
            {status}
          </h4>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {data
              .filter((d) => d.status === status)
              .map((item, idx) => (
                <Card
                  key={idx}
                  className="p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow hover:shadow-lg hover:scale-[1.02] transition-transform duration-150 cursor-pointer border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-sm truncate">{item.reference}</p>
                    <span
                      className={clsx(
                        'text-xs px-2 py-0.5 rounded-full font-medium',
                        STATUS_COLOR[item.status]
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {item.from} → {item.to}
                  </p>
                  {item.contact && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      Contact: {item.contact}
                    </p>
                  )}
                  {item.scheduleDate && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      Scheduled: {item.scheduleDate}
                    </p>
                  )}
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanView;
