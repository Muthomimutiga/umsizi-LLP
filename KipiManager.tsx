
import React, { FC, useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
    Lightbulb, Copyright, FileText as FileTextIconLucide, Users, FilePlus2, SearchCheck, ListChecks, Factory, Home as HomeIcon, ChevronLeft
} from 'lucide-react';
import { Button } from './components';
import { questionVariants } from './constants';
import { ManagerProps, SubTypeInfo } from './types';
import ComingSoonPlaceholder from './ComingSoonPlaceholder';

const kipiMainSubTypes: SubTypeInfo[] = [
    { key: 'patents', title: 'Patents', icon: <Lightbulb className="mr-3 h-6 w-6 text-green-600" /> },
    { key: 'trademarks', title: 'Trademarks', icon: <Copyright className="mr-3 h-6 w-6 text-green-600" /> },
];

const patentSubTypes: SubTypeInfo[] = [
    { key: 'patentDisclosureForm', title: 'Patent Disclosure Form', icon: <FileTextIconLucide className="mr-3 h-6 w-6 text-green-600" /> },
];

const trademarkSubTypes: SubTypeInfo[] = [
    { key: 'tm1', title: 'Form TM1 (Appointment of Agent)', icon: <Users className="mr-3 h-6 w-6 text-green-600" /> },
    { key: 'tm2', title: 'Form TM 2 - Application for Registration', icon: <FilePlus2 className="mr-3 h-6 w-6 text-green-600" /> },
    { key: 'tm27', title: 'Form TM 27 - Request for Search', icon: <SearchCheck className="mr-3 h-6 w-6 text-green-600" /> },
    { key: 'trademarkChecklist', title: 'Registration Checklist - Trade Marks', icon: <ListChecks className="mr-3 h-6 w-6 text-green-600" /> },
];

// --- Page Components ---
interface KipiMainPageProps {
    onMainTypeSelect: (type: 'patents' | 'trademarks') => void;
    onGoHome: () => void; // This onGoHome is for "Back to Main Portal Menu"
}
const KipiMainPage: FC<KipiMainPageProps> = ({ onMainTypeSelect, onGoHome }) => (
    <motion.div 
        variants={questionVariants} 
        initial="hidden" 
        animate="visible" 
        exit="exit" 
        className="space-y-3 py-4 flex flex-col h-full"
    >
        <div className="grid grid-cols-1 gap-3 mt-2 flex-grow">
            {kipiMainSubTypes.map(subType => (
                <Button
                    key={subType.key}
                    onClick={() => onMainTypeSelect(subType.key as 'patents' | 'trademarks')}
                    variant="outline"
                    className="py-4 text-md h-auto justify-start pl-4"
                >
                    {subType.icon} {subType.title}
                </Button>
            ))}
        </div>
        <div className="mt-auto pt-4 border-t border-gray-200">
            <Button
                onClick={onGoHome} // Correctly uses onGoHome for main portal menu
                variant="secondary"
                className="w-full py-3 text-md"
            >
                <HomeIcon className="mr-2 h-5 w-5" />
                Back to Main Menu
            </Button>
        </div>
    </motion.div>
);

interface KipiPatentsPageProps {
    onFormSelect: (subType: SubTypeInfo) => void;
    onGoBackToKipiMain: () => void; // Changed from onGoHome
}
const KipiPatentsPage: FC<KipiPatentsPageProps> = ({ onFormSelect, onGoBackToKipiMain }) => (
    <motion.div 
        variants={questionVariants} 
        initial="hidden" 
        animate="visible" 
        exit="exit" 
        className="space-y-3 py-4 flex flex-col h-full"
    >
        <div className="grid grid-cols-1 gap-3 mt-2 flex-grow">
            {patentSubTypes.map(subType => (
                <Button key={subType.key} onClick={() => onFormSelect(subType)} variant="outline" className="py-4 text-md h-auto justify-start pl-4">
                    {subType.icon} {subType.title}
                </Button>
            ))}
        </div>
        <div className="mt-auto pt-4 border-t border-gray-200">
            <Button
                onClick={onGoBackToKipiMain} // Use the new prop
                variant="secondary"
                className="w-full py-3 text-md"
            >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Back to KIPI Services
            </Button>
        </div>
    </motion.div>
);

interface KipiTrademarksPageProps {
    onFormSelect: (subType: SubTypeInfo) => void;
    onGoBackToKipiMain: () => void; // Changed from onGoHome
}
const KipiTrademarksPage: FC<KipiTrademarksPageProps> = ({ onFormSelect, onGoBackToKipiMain }) => (
    <motion.div 
        variants={questionVariants} 
        initial="hidden" 
        animate="visible" 
        exit="exit" 
        className="space-y-3 py-4 flex flex-col h-full"
    >
        <div className="grid grid-cols-1 gap-3 mt-2 flex-grow">
            {trademarkSubTypes.map(subType => (
                <Button key={subType.key} onClick={() => onFormSelect(subType)} variant="outline" className="py-4 text-md h-auto justify-start pl-4">
                    {subType.icon} {subType.title}
                </Button>
            ))}
        </div>
        <div className="mt-auto pt-4 border-t border-gray-200">
            <Button
                onClick={onGoBackToKipiMain} // Use the new prop
                variant="secondary"
                className="w-full py-3 text-md"
            >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Back to KIPI Services
            </Button>
        </div>
    </motion.div>
);


// --- Main Manager Component ---
const KipiManager: FC<ManagerProps> = ({ onGoHome, onSelectSubType, selectedSubTypeKey, onSetPageConfig }) => {
    const [kipiScreen, setKipiScreen] = useState<'main' | 'patents' | 'trademarks' | 'form'>('main');
    // Store the screen from which 'form' screen was accessed, to return correctly
    const [previousKipiScreenForForm, setPreviousKipiScreenForForm] = useState<'patents' | 'trademarks'>('patents');

    // Effect to handle "going back" from a 'form' (ComingSoon) screen
    // This is triggered when App.tsx's back button clears selectedSubTypeKey
    useEffect(() => {
        if (kipiScreen === 'form' && !selectedSubTypeKey) {
            setKipiScreen(previousKipiScreenForForm); // Revert to 'patents' or 'trademarks' list
        }
    }, [selectedSubTypeKey, kipiScreen, previousKipiScreenForForm]);

    // Effect to update page configuration (title, desc, icon) based on current KipiManager state
    useEffect(() => {
        let config = { title: "Kenya Industrial Property Institute", icon: <Factory className="h-6 w-6" />, desc: "Select a KIPI service area." };
        if (kipiScreen === 'patents') {
            config = { title: "Patents", icon: <Lightbulb className="h-6 w-6" />, desc: "Select a patent service." };
        } else if (kipiScreen === 'trademarks') {
            config = { title: "Trademarks", icon: <Copyright className="h-6 w-6" />, desc: "Select a trademark service." };
        } else if (kipiScreen === 'form' && selectedSubTypeKey) {
            const allSubTypes = [...patentSubTypes, ...trademarkSubTypes];
            const subType = allSubTypes.find(st => st.key === selectedSubTypeKey);
            if (subType) {
                config = {
                    title: subType.title,
                    icon: React.cloneElement(subType.icon as React.ReactElement<{ className?: string }>, { className: "h-6 w-6" }),
                    desc: "This service is currently under development."
                };
            } else {
                 // Fallback if selectedSubTypeKey is set but doesn't match a known form; revert to main.
                setKipiScreen('main'); 
            }
        }
        onSetPageConfig(config);
    }, [kipiScreen, selectedSubTypeKey, onSetPageConfig]);


    const handleMainTypeSelect = (type: 'patents' | 'trademarks') => {
        setKipiScreen(type);
    };

    const handleFormSelect = (subType: SubTypeInfo) => {
        // Store which screen ('patents' or 'trademarks') we are coming from before going to 'form'
        if (kipiScreen === 'patents' || kipiScreen === 'trademarks') {
            setPreviousKipiScreenForForm(kipiScreen);
        }
        // Tell App.tsx about the selected sub-type key (for "Coming Soon" or future wizard)
        onSelectSubType(subType.key, subType.docTypeToSet, undefined, subType.keyForComingSoon || subType.key);
        setKipiScreen('form'); // Set internal screen to 'form' to show ComingSoonPlaceholder
    };

    const goBackToKipiMain = () => {
        setKipiScreen('main');
        // Removed: setSelectedSubTypeKey(null); // This was causing an error and is not needed here.
                                            // App.tsx manages selectedSubTypeKey. If this navigation
                                            // implies selectedSubTypeKey should be null, App.tsx's logic
                                            // (e.g., via onSelectSubType or header back button) handles it.
    };

    const kipiViews: Record<string, ReactNode> = {
        main: <KipiMainPage onMainTypeSelect={handleMainTypeSelect} onGoHome={onGoHome} />,
        patents: <KipiPatentsPage onFormSelect={handleFormSelect} onGoBackToKipiMain={goBackToKipiMain} />,
        trademarks: <KipiTrademarksPage onFormSelect={handleFormSelect} onGoBackToKipiMain={goBackToKipiMain} />,
    };

    if (kipiScreen === 'form' && selectedSubTypeKey) {
        const allSubTypes = [...patentSubTypes, ...trademarkSubTypes];
        const subType = allSubTypes.find(st => st.key === selectedSubTypeKey);
        // ComingSoonPlaceholder does not have its own back button.
        // It relies on the App Header's back button.
        // When App Header back is clicked, selectedSubTypeKey becomes null.
        // The useEffect above will catch this and set kipiScreen to previousKipiScreenForForm.
        return <ComingSoonPlaceholder title={subType?.title} icon={subType?.icon} />;
    }
    
    return kipiViews[kipiScreen] || kipiViews.main;
};

export default KipiManager;
