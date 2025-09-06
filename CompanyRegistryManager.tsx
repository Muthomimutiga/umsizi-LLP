
import React, { FC, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileArchive, FilePlus2, Globe2, Building2 as Building2Icon, Home as HomeIcon
} from 'lucide-react';
import { Button } from './components';
import { questionVariants } from './constants';
import { ManagerProps, SubTypeInfo, MainMenuSelection } from './types';
import ComingSoonPlaceholder from './ComingSoonPlaceholder';

const companyRegistrySubTypes: SubTypeInfo[] = [
    { key: 'returnOfAllotment', title: 'Return of Allotment (CR20)', icon: <FileArchive className="mr-3 h-6 w-6 text-green-600" />, docTypeToSet: 'cr20' },
    { key: 'companyIncorporation', title: 'Incorporation of a Company', icon: <FilePlus2 className="mr-3 h-6 w-6 text-green-600" />, docTypeToSet: 'companyIncorporation' },
    { key: 'incorporationForeign', title: 'Incorporation of a Foreign Company', icon: <Globe2 className="mr-3 h-6 w-6 text-green-600" />, keyForComingSoon: 'incorporationForeign' },
];

interface CompanyRegistrySelectionPageProps {
    onSelectCompanyRegistrySubType: (subTypeKey: string, docTypeToSet?: MainMenuSelection, managerType?: MainMenuSelection, keyForComingSoon?: string) => void;
    onGoHome: () => void; // Added for the back button
}

const CompanyRegistrySelectionPage: FC<CompanyRegistrySelectionPageProps> = ({ onSelectCompanyRegistrySubType, onGoHome }) => (
    <motion.div 
        variants={questionVariants} 
        initial="hidden" 
        animate="visible" 
        exit="exit" 
        className="space-y-3 py-4 flex flex-col h-full" // Added flex flex-col h-full
    >
        <div className="grid grid-cols-1 gap-3 mt-2 flex-grow"> {/* Added flex-grow */}
            {companyRegistrySubTypes.map(subType => (
                <Button
                    key={subType.key}
                    onClick={() => onSelectCompanyRegistrySubType(subType.key, subType.docTypeToSet, subType.isManager ? subType.managerType : undefined, subType.keyForComingSoon)}
                    variant="outline"
                    className="py-4 text-md h-auto justify-start pl-4"
                >
                    {subType.icon} {subType.title}
                </Button>
            ))}
        </div>
        <div className="mt-auto pt-4 border-t border-gray-200"> {/* Added mt-auto for pushing to bottom and border */}
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

const CompanyRegistryManager: FC<ManagerProps> = ({ onGoHome, onSelectSubType, selectedSubTypeKey, onSetPageConfig }) => {
    
    useEffect(() => {
        if (!selectedSubTypeKey) {
             onSetPageConfig({
                title: "Company Registry",
                icon: <Building2Icon className="h-6 w-6" />,
                desc: "Select the company registration service you require."
            });
        } else {
            // This case is for "Coming Soon" items from this manager
            const subType = companyRegistrySubTypes.find(st => st.keyForComingSoon === selectedSubTypeKey);
            if (subType) {
                 onSetPageConfig({
                    title: subType.title,
                    icon: React.cloneElement(subType.icon as React.ReactElement<{ className?: string }>, {className: "h-6 w-6"}),
                    desc: "This service is currently under development."
                });
            }
        }
    }, [selectedSubTypeKey, onSetPageConfig]);


    if (selectedSubTypeKey) { // This means a "Coming Soon" item was selected from this menu.
        const subType = companyRegistrySubTypes.find(st => st.keyForComingSoon === selectedSubTypeKey);
        return <ComingSoonPlaceholder title={subType?.title} icon={subType?.icon} />;
    }
    
    return <CompanyRegistrySelectionPage onSelectCompanyRegistrySubType={onSelectSubType} onGoHome={onGoHome} />;
};

export default CompanyRegistryManager;
