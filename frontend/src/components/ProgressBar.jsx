import clsx from 'clsx';

const ProgressBar = ({ label, percentage, colorClass = "bg-orangeFarm-500", showValue = true }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
        {showValue && <span className="text-sm font-semibold text-gray-900">{percentage}%</span>}
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div 
          className={clsx("h-2.5 rounded-full transition-all duration-1000 ease-out", colorClass)} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
