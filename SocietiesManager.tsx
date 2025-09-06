
import React, { FC, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListChecks, Users, Home as HomeIcon } from 'lucide-react';
import { Button } from './components';
import { questionVariants } from './constants';
import { ManagerProps, SubTypeInfo } from './types';
import ComingSoonPlaceholder from './ComingSoonPlaceholder';

const societiesSubTypes: SubTypeInfo[] = [
    { key: 'registrationChecklist', title: 'Registration of Society Checklist', icon: <ListChecks className="mr-3 h-6 w-6 text-green-600" /> },
];

interface SocietiesSelectionPageProps {
    onSelectSocietiesSubType: (key: string) => void;
    onGoHome: () => void;
}

const SocietiesSelectionPage: FC<SocietiesSelectionPageProps> = ({ onSelectSocietiesSubType, onGoHome }) => (
    <motion.div 
        variants={questionVariants} 
        initial="hidden" 
        animate="visible" 
        exit="exit" 
        className="space-y-3 py-4 flex flex-col h-full"
    >
        <div className="grid grid-cols-1 gap-3 mt-2 flex-grow">
            {societiesSubTypes.map(subType => (
                <Button
                    key={subType.key}
                    onClick={() => onSelectSocietiesSubType(subType.key)}
                    variant="outline"
                    className="py-4 text-md h-auto justify-start pl-4"
                >
                    {subType.icon} {subType.title}
                </Button>
            ))}
        </div>
        <div className="mt-auto pt-4 border-t border-gray-200">
            <Button
                onClick={onGoHome}
                variant="secondary"
                className="w-full py-3 text-md"
            >
                <HomeIcon className="mr-2 h-5 w-5" />
                Back to Main Menu
            </Button>
        </div>
    </motion.div>
);

const SocietiesManager: FC<ManagerProps> = ({ onGoHome, onSelectSubType, selectedSubTypeKey, onSetPageConfig }) => {
    useEffect(() => {
        if (!selectedSubTypeKey) {
             onSetPageConfig({
                title: "Societies",
                icon: <Users className="h-6 w-6" />,
                desc: "Select the society service you require."
            });
        } else {
            const subType = societiesSubTypes.find(st => st.key === selectedSubTypeKey);
            if (subType) {
                 onSetPageConfig({
                    title: subType.title,
                    icon: React.cloneElement(subType.icon as React.ReactElement<{ className?: string }>, {className: "h-6 w-6"}),
                    desc: "This service is currently under development."
                });
            }
        }
    }, [selectedSubTypeKey, onSetPageConfig]);

    if (selectedSubTypeKey) {
        const subType = societiesSubTypes.find(st => st.key === selectedSubTypeKey);
        return <ComingSoonPlaceholder title={subType?.title} icon={subType?.icon} />;
    }

    return <SocietiesSelectionPage onSelectSocietiesSubType={onSelectSubType} onGoHome={onGoHome} />;
};

export default SocietiesManager;