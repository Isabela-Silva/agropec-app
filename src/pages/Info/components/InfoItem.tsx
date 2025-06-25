import React from 'react';

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div>
    <p className="font-semibold">{label}</p>
    <p className="text-sm text-base-gray">{value}</p>
  </div>
);

export default InfoItem;
