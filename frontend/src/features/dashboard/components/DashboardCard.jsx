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
        <h3 className="text-xl font-semibold">{title}</h3>
        {/* Use ion-icon as a normal HTML tag */}
        <ion-icon name={iconName} class="text-yellow-500 text-3xl"></ion-icon>
      </div>
      <p className="text-3xl font-bold my-2">{highlightCount}</p>
      <div className="flex gap-4 text-sm text-gray-400">
        {Object.entries(stats).map(([key, value]) => (
          <span key={key}>
            {value} {key}
          </span>
        ))}
      </div>
    </Card>
  );
};

export default DashboardCard;
