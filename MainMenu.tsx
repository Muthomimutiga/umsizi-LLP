
import React, { FC } from 'react';
import { motion } from 'framer-motion';
import {
    Gavel, Building2 as Building2Icon, HeartHandshake, Users, ClipboardCheck,
    ShieldCheck, Factory, BookOpenCheck, FileBarChart2
} from 'lucide-react';
import { Button } from './components';
import { questionVariants } from './constants';
import { MainMenuSelection } from './types';

interface MainMenuProps {
  onSelectDocumentType: (docType: MainMenuSelection) => void;
}

const mainMenuItems: { type: MainMenuSelection, label: string, icon: React.ReactNode }[] = [
    { type: 'arbitralRecitals', label: 'Arbitral Award Recitals', icon: <Gavel className="mr-3 h-6 w-6 text-green-600" /> },
    { type: 'companyRegistry', label: 'Company Registry', icon: <Building2Icon className="mr-3 h-6 w-6 text-green-600" /> },
    { type: 'pbo', label: 'Public Benefit Organizations', icon: <HeartHandshake className="mr-3 h-6 w-6 text-green-600" /> },
    { type: 'societies', label: 'Societies', icon: <Users className="mr-3 h-6 w-6 text-green-600" /> },
    { type: 'boardEvaluation', label: 'Board Evaluation', icon: <ClipboardCheck className="mr-3 h-6 w-6 text-green-600" /> },
    { type: 'governanceAudits', label: 'Governance Audits', icon: <ShieldCheck className="mr-3 h-6 w-6 text-green-600" /> },
    { type: 'kipi', label: 'Kenya Industrial Property Institute (KIPI)', icon: <Factory className="mr-3 h-6 w-6 text-green-600" /> },
    { type: 'minutes', label: 'Minutes', icon: <BookOpenCheck className="mr-3 h-6 w-6 text-green-600" /> },
    { type: 'rfp', label: 'Request for Proposals', icon: <FileBarChart2 className="mr-3 h-6 w-6 text-green-600" /> },
    // { type: 'form4', label: 'Form 4 - NGO Address Change', icon: <EditIcon className="mr-3 h-6 w-6 text-green-600" /> }, // Removed
];

const MainMenu: FC<MainMenuProps> = ({ onSelectDocumentType }) => {
  return (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div
        variants={questionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-5 text-center py-6"
    >
        <h1 className="text-3xl font-bold text-gray-800">
            What would you like to generate?
        </h1>
        <p className="text-gray-600 max-w-md mx-auto pb-4">
            Choose a document type below to get started.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {mainMenuItems.map(item => (
                 <Button
                    key={item.type}
                    onClick={() => onSelectDocumentType(item.type)}
                    variant="outline"
                    className="py-6 text-lg h-auto flex flex-col items-center justify-center sm:flex-row sm:justify-start sm:pl-4"
                >
                    {item.icon}
                    <span className="mt-2 sm:mt-0 sm:ml-2 text-center sm:text-left">{item.label}</span>
                </Button>
            ))}
        </div>
        <p className="text-sm text-gray-500 pt-6">
            More document types will be added soon.
        </p>
    </motion.div>
  );
};

export default MainMenu;