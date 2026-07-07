import clsx from 'clsx';

const PremiumCard = ({ children, className, title, action }) => {
  return (
    <div className={clsx("bg-white rounded-2xl shadow-soft p-6 border border-gray-50 flex flex-col", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-lg font-bold text-gray-900">{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default PremiumCard;
