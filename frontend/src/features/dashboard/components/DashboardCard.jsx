import Card from '../../../components/ui/Card';

const DashboardCard = ({ title, highlightCount, stats, onClick }) => {
  const iconName = title === 'Receipts' ? 'document-text-outline' : 'cube-outline';

  const borderColor = title === 'Receipts' ? 'border-yellow-500' : 'border-green-500';

  return (
    <Card
      className={`p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 bg-gray-900 text-white w-full rounded-xl border-l-4 ${borderColor}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <ion-icon name={iconName} class="text-yellow-500 text-3xl"></ion-icon>
      </div>
      <p className="text-4xl font-bold my-2">{highlightCount}</p>
      <div className="flex gap-4 text-sm text-gray-400 flex-wrap">
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
