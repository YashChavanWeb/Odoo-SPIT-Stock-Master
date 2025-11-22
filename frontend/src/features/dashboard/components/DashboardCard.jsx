// src/features/dashboard/components/DashboardCard.jsx
import Card from '../../../components/ui/Card';

const DashboardCard = ({ title, highlightCount, stats, onClick }) => {
  const iconName = title === 'Receipts' ? 'document-text-outline' : 'cube-outline';

  return (
    <Card
      className="p-6 cursor-pointer hover:shadow-xl bg-gray-900 text-white w-full"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-bold dark:text-yellow-200 text-yellow-600 border-b-1 border-gray-400">{title}</h3>
        <ion-icon name={iconName} size='large' class="text-yellow-500 text-3xl"></ion-icon>
      </div>
      <p className="text-3xl font-semibold my-2">Total : {highlightCount}</p>
      <div className="flex gap-4 text-sm text-gray-400">
        {Object.entries(stats).map(([key, value]) => (
          <span key={key} className='p-2 px-5 dark:bg-gray-700 bg-gray-400 rounded-full text-xl dark:text-gray-200 text-black'>
            {value} {key}
          </span>
        ))}
      </div>
    </Card>
  );
};

export default DashboardCard;
