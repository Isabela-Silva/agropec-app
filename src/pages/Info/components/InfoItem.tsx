import React from 'react';

interface InfoItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, icon }) => (
  <div className="flex items-center space-x-3">
    {icon && <div className="text-base-gray">{icon}</div>}
    <div className="flex-1">
      <p className="font-semibold text-base-black">{label}</p>
      <p className="text-sm text-base-gray">{value}</p>
    </div>
  </div>
);

export default InfoItem;
