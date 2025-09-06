
import React, { FC, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ClipboardCheck, Briefcase, ShieldCheck, ClipboardList, FileBarChart2, Home as HomeIcon
} from 'lucide-react';
import { Button } from './components';
import { questionVariants } from './constants';
import { ManagerProps, SubTypeInfo } from './types';
import ComingSoonPlaceholder from './ComingSoonPlaceholder';

const rfpSubTypes: SubTypeInfo[] = [
    { key: 'rfpBoardEvaluation', title: "Board Evaluations", icon: <ClipboardCheck className="mr-3 h-6 w-6 text-green-600" /> },
    { key: 'rfpCompanySecretarial', title: "Company Secretarial", icon: <Briefcase className="mr-3 h-6 w-6 text-green-600" /> },
    { key: 'rfpGovernanceAudit', title: "Governance Audit", icon: <ShieldCheck className="mr-3 h-6 w-6 text-green-600" /> },
    { key: 'rfpGovernanceReviewBoardEval', title: "Governance Review + Board Evaluations", icon: <ClipboardList className="mr-3 h-6 w-6 text-green-600" /> },
];

interface RfpSelectionPageProps {
    onSelectRfpSubType: (key: string) => void;
    onGoHome: () => void;
}

const RfpSelectionPage: FC<RfpSelectionPageProps> = ({ onSelectRfpSubType, onGoHome }) => (
    <motion.div 
        variants={questionVariants} 
        initial="hidden" 
        animate="visible" 
        exit="exit" 
        className="space-y-3 py-4 flex flex-col h-full"
    >
        <div className="grid grid-cols-1 gap-3 mt-2 flex-grow">
            {rfpSubTypes.map(subType => (
                <Button
                    key={subType.key}
                    onClick={() => onSelectRfpSubType(subType.key)}
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

const RfpManager: FC<ManagerProps> = ({ onGoHome, onSelectSubType, selectedSubTypeKey, onSetPageConfig }) => {
    useEffect(() => {
        if (!selectedSubTypeKey) {
             onSetPageConfig({
                title: "Request for Proposals",
                icon: <FileBarChart2 className="h-6 w-6" />,
                desc: "Select an RFP type."
            });
        } else {
            const subType = rfpSubTypes.find(st => st.key === selectedSubTypeKey);
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
        const subType = rfpSubTypes.find(st => st.key === selectedSubTypeKey);
        return <ComingSoonPlaceholder title={subType?.title} icon={subType?.icon} />;
    }

    return <RfpSelectionPage onSelectRfpSubType={onSelectSubType} onGoHome={onGoHome} />;
};

export default RfpManager;
