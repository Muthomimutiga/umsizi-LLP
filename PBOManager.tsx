
import React, { FC, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FilePlus2, MapPin, UsersRound, BookCheck, Edit3, HeartHandshake, Home as HomeIcon
} from 'lucide-react';
import { Button } from './components';
import { questionVariants } from './constants';
import { ManagerProps, SubTypeInfo, MainMenuSelection } from './types'; 
import ComingSoonPlaceholder from './ComingSoonPlaceholder';

const pboSubTypes: SubTypeInfo[] = [
    { key: 'applicationRegistration', title: 'Application for Registration', icon: <FilePlus2 className="mr-3 h-6 w-6 text-green-600" />, keyForComingSoon: 'applicationRegistration' },
    { key: 'changeOfAddress', title: 'Notification of Change of Address (Form 4)', icon: <MapPin className="mr-3 h-6 w-6 text-green-600" />, docTypeToSet: 'form4' }, // Updated: launches Form4Wizard
    { key: 'changeOfOfficeBearers', title: 'Notification of Change of Office Bearers', icon: <UsersRound className="mr-3 h-6 w-6 text-green-600" />, keyForComingSoon: 'changeOfOfficeBearers' },
    { key: 'annualReturns', title: 'Annual Returns', icon: <BookCheck className="mr-3 h-6 w-6 text-green-600" />, keyForComingSoon: 'annualReturns' },
    { key: 'changeOfName', title: 'Change of Name (Form 16)', icon: <Edit3 className="mr-3 h-6 w-6 text-green-600" />, docTypeToSet: 'pboChangeOfName' },
];

interface PBOSelectionPageProps {
    onSelectPBOSubType: (subTypeKey: string, docTypeToSet?: MainMenuSelection, managerType?: MainMenuSelection, keyForComingSoon?: string) => void;
    onGoHome: () => void;
}

const PBOSelectionPage: FC<PBOSelectionPageProps> = ({ onSelectPBOSubType, onGoHome }) => (
    <motion.div 
        variants={questionVariants} 
        initial="hidden" 
        animate="visible" 
        exit="exit" 
        className="space-y-3 py-4 flex flex-col h-full"
    >
        <div className="grid grid-cols-1 gap-3 mt-2 flex-grow">
            {pboSubTypes.map(subType => (
                <Button
                    key={subType.key}
                    onClick={() => onSelectPBOSubType(subType.key, subType.docTypeToSet, undefined, subType.docTypeToSet ? undefined : subType.keyForComingSoon)} // Pass keyForComingSoon only if docTypeToSet is not present
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

const PBOManager: FC<ManagerProps> = ({ onGoHome, onSelectSubType, selectedSubTypeKey, onSetPageConfig }) => {

    useEffect(() => {
        if (!selectedSubTypeKey) {
            onSetPageConfig({
                title: "Public Benefit Organizations",
                icon: <HeartHandshake className="h-6 w-6" />,
                desc: "Select the PBO service you require."
            });
        } else {
            // This case handles when a sub-item that is "Coming Soon" is selected.
            // The actual wizard launching (like for Form 4 or Form 16) is handled by App.tsx.
            const subType = pboSubTypes.find(st => st.keyForComingSoon === selectedSubTypeKey && !st.docTypeToSet);
            if (subType) {
                onSetPageConfig({
                    title: subType.title,
                    icon: React.cloneElement(subType.icon as React.ReactElement<{ className?: string }>, {className: "h-6 w-6"}),
                    desc: "This service is currently under development."
                });
            }
        }
    }, [selectedSubTypeKey, onSetPageConfig]);


    if (selectedSubTypeKey && pboSubTypes.find(st => st.keyForComingSoon === selectedSubTypeKey && !st.docTypeToSet)) {
        const subType = pboSubTypes.find(st => st.keyForComingSoon === selectedSubTypeKey && !st.docTypeToSet);
        return <ComingSoonPlaceholder title={subType?.title} icon={subType?.icon} />;
    }

    return <PBOSelectionPage onSelectPBOSubType={onSelectSubType} onGoHome={onGoHome} />;
};

export default PBOManager;