import React from 'react';
import { FoodIcon } from './FoodIcon';
import { TransportIcon } from './TransportIcon';
import { HomeIcon } from './HomeIcon';
import { LeisureIcon } from './LeisureIcon';
import { HealthIcon } from './HealthIcon';
import { EducationIcon } from './EducationIcon';
import { BillsIcon } from './BillsIcon';
import { OtherIcon } from './OtherIcon';
import { SalaryIcon } from './SalaryIcon';
import { InvestmentsIcon } from './InvestmentsIcon';
import { SalesIcon } from './SalesIcon';

export const CategoryIcon: React.FC<{ category: string; }> = ({ category }) => {
    const commonClasses = "h-8 w-8 text-white p-1.5 rounded-lg";
    switch (category) {
        case 'Alimentação':
            return <FoodIcon className={`${commonClasses} bg-yellow-500`} />;
        case 'Transporte':
            return <TransportIcon className={`${commonClasses} bg-blue-500`} />;
        case 'Moradia':
            return <HomeIcon className={`${commonClasses} bg-orange-500`} />;
        case 'Lazer':
            return <LeisureIcon className={`${commonClasses} bg-pink-500`} />;
        case 'Saúde':
            return <HealthIcon className={`${commonClasses} bg-red-500`} />;
        case 'Educação':
            return <EducationIcon className={`${commonClasses} bg-indigo-500`} />;
        case 'Contas':
            return <BillsIcon className={`${commonClasses} bg-cyan-500`} />;
        case 'Salário':
            return <SalaryIcon className={`${commonClasses} bg-green-500`} />;
        case 'Investimentos':
            return <InvestmentsIcon className={`${commonClasses} bg-teal-500`} />;
        case 'Vendas':
            return <SalesIcon className={`${commonClasses} bg-purple-500`} />;
        default:
            return <OtherIcon className={`${commonClasses} bg-gray-500`} />;
    }
};