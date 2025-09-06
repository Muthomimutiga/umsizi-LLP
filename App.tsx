

import React, { useState, FC, ReactNode, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home as HomeIcon, ChevronLeft } from 'lucide-react';

import { DocumentType, MainMenuSelection, PageConfigItem, WizardProps, ManagerProps } from './types';
import { UmsiziLogo, initialPageConfigItem } from './constants';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from './components';

// Import Wizards and Managers
import MainMenu from './MainMenu';
import ArbitralRecitalsWizard from './ArbitralRecitalsWizard';
import CR20Wizard from './CR20Wizard';
import CompanyIncorporationWizard from './CompanyIncorporationWizard';
import PBOManager from './PBOManager';
import CompanyRegistryManager from './CompanyRegistryManager';
import SocietiesManager from './SocietiesManager';
import BoardEvaluationManager from './BoardEvaluationManager';
import GovernanceAuditsManager from './GovernanceAuditsManager';
import KipiManager from './KipiManager';
import MinutesManager from './MinutesManager';
import RfpManager from './RfpManager';
// import ComingSoonPlaceholder from './ComingSoonPlaceholder'; // No longer directly used by App.tsx
import PBOChangeOfNameWizard from './PBOChangeOfNameWizard';
import Form4Wizard from './Form4Wizard';


// --- Component Maps for Rendering ---
type WizardKey = 'arbitralRecitals' | 'cr20' | 'companyIncorporation' | 'pboChangeOfName' | 'form4';
const wizardComponentsMap: Record<WizardKey, FC<WizardProps>> = {
    arbitralRecitals: ArbitralRecitalsWizard,
    cr20: CR20Wizard,
    companyIncorporation: CompanyIncorporationWizard,
    pboChangeOfName: PBOChangeOfNameWizard,
    form4: Form4Wizard,
};

type ManagerKey = 'pbo' | 'companyRegistry' | 'societies' | 'boardEvaluation' | 'governanceAudits' | 'kipi' | 'minutes' | 'rfp';
const managerComponentsMap: Record<ManagerKey, FC<ManagerProps>> = {
    pbo: PBOManager,
    companyRegistry: CompanyRegistryManager,
    societies: SocietiesManager,
    boardEvaluation: BoardEvaluationManager,
    governanceAudits: GovernanceAuditsManager,
    kipi: KipiManager,
    minutes: MinutesManager, // MinutesManager will now act as the direct form
    rfp: RfpManager,
};


const UmsiziDocumentPortalApp: FC = () => {
    const [selectedDocCategory, setSelectedDocCategory] = useState<DocumentType>(null);
    const [activeWizard, setActiveWizard] = useState<MainMenuSelection | null>(null);
    const [selectedSubTypeKey, setSelectedSubTypeKey] = useState<string | null>(null);
    
    const [currentPageConfig, setCurrentPageConfig] = useState<PageConfigItem>(initialPageConfigItem);
    const [previousScreenManager, setPreviousScreenManager] = useState<DocumentType>(null);


    const resetToMainMenu = useCallback(() => {
        setSelectedDocCategory(null);
        setActiveWizard(null);
        setSelectedSubTypeKey(null);
        setCurrentPageConfig(initialPageConfigItem);
        setPreviousScreenManager(null);
    }, []);

    const handleGoHome = () => { 
        resetToMainMenu();
    };
    
    const handleSetPageConfig = useCallback((config: PageConfigItem) => {
        setCurrentPageConfig(config);
    }, []);

    const handleSetInitialWizardPageConfig = useCallback((title: string, description: string, icon?: ReactNode) => {
        setCurrentPageConfig({ title, desc: description, icon });
    }, []);

    // Effect to ensure the header is correctly set to initial config when on the main menu
    useEffect(() => {
        if (selectedDocCategory === null && activeWizard === null) {
            setCurrentPageConfig(initialPageConfigItem);
        }
    }, [selectedDocCategory, activeWizard]);

    const handleSelectDocumentType = (docType: MainMenuSelection) => {
        resetToMainMenu(); 
    
        if (docType === 'arbitralRecitals' || docType === 'cr20' || docType === 'companyIncorporation') {
            setActiveWizard(docType); // Set as active wizard for direct launch
            setSelectedDocCategory(docType); // Also set category for context if needed
        } else if (managerComponentsMap[docType as ManagerKey]) {
            // This handles 'pbo', 'companyRegistry', 'minutes', etc.
            setSelectedDocCategory(docType);
        } else {
            // Fallback for types not directly wizards or managers (should not happen with current setup)
            console.warn(`Document type ${docType} selected but no direct wizard or manager mapped. Defaulting to category view.`);
            setSelectedDocCategory(docType);
        }
    };
    

    const handleSelectSubType = (
        subTypeKey: string, 
        docTypeToSet?: MainMenuSelection, // e.g., 'form4', 'pboChangeOfName'
        managerType?: MainMenuSelection,  // e.g., 'pbo' (the manager we are in)
        keyForComingSoon?: string
    ) => {
        if (docTypeToSet && wizardComponentsMap[docTypeToSet as WizardKey]) {
            // This launches a wizard like Form4Wizard or PBOChangeOfNameWizard from a manager
            setActiveWizard(docTypeToSet);
            setPreviousScreenManager(selectedDocCategory); // The manager we were just in (e.g., 'pbo')
            setSelectedDocCategory(docTypeToSet); // Category becomes the wizard type
            setSelectedSubTypeKey(null); // Clear sub-type from previous manager
        } else if (keyForComingSoon) {
            // This is for "Coming Soon" items within a manager
            setSelectedSubTypeKey(keyForComingSoon);
            // The manager itself (e.g., KipiManager, PBOManager) will handle displaying ComingSoonPlaceholder
            // and setting its own page config.
        } else {
            // This path is for navigating within managers that have further sub-menus (not currently used for PBO, but for Kipi)
            setSelectedSubTypeKey(subTypeKey);
        }
    };
    
    const handleGoBackFromWizard = () => {
        if (previousScreenManager) {
            // Came from a manager (e.g., PBOManager -> Form4Wizard, now back to PBOManager)
            setActiveWizard(null);
            setSelectedDocCategory(previousScreenManager); 
            setSelectedSubTypeKey(null); // Reset sub-type key for the manager
            setPreviousScreenManager(null); 
        } else {
            // Was a direct wizard from main menu
            resetToMainMenu();
        }
    };


    const renderContent = () => {
        const wizardProps: WizardProps = { 
            onGoHome: handleGoBackFromWizard, 
            onSetInitialPageTitle: handleSetInitialWizardPageConfig 
        };
    
        if (activeWizard && wizardComponentsMap[activeWizard as WizardKey]) {
            const WizardComponent = wizardComponentsMap[activeWizard as WizardKey];
            return <WizardComponent {...wizardProps} initialPreviousScreen={previousScreenManager || undefined} />;
        }
    
        const managerProps: ManagerProps = { 
            onGoHome: resetToMainMenu, 
            onSelectSubType: handleSelectSubType, 
            selectedSubTypeKey: selectedSubTypeKey,
            onSetPageConfig: handleSetPageConfig 
        };
    
        if (selectedDocCategory && managerComponentsMap[selectedDocCategory as ManagerKey]) {
            const ManagerComponent = managerComponentsMap[selectedDocCategory as ManagerKey];
            return <ManagerComponent {...managerProps} />;
        }
        
        // Fallback for direct wizards (should ideally be caught by activeWizard)
        if (selectedDocCategory && wizardComponentsMap[selectedDocCategory as WizardKey]) {
             const WizardComponent = wizardComponentsMap[selectedDocCategory as WizardKey];
             return <WizardComponent {...wizardProps} onGoHome={resetToMainMenu} initialPreviousScreen={previousScreenManager || undefined} />;
        }
        
        if (activeWizard || selectedDocCategory) {
             const title = activeWizard || selectedDocCategory || "Selected Item";
             console.error(`No component mapping found for: ${title}. Resetting to main menu.`);
             resetToMainMenu(); // Safety net
        }

        return <MainMenu onSelectDocumentType={handleSelectDocumentType} />;
    };
    
    const isHomePage = !selectedDocCategory && !activeWizard;
    const canGoBack = selectedDocCategory || activeWizard;

    let appHeaderBackAction: () => void;
    if (activeWizard) { // If a wizard is active (e.g. CR20, Form4)
        appHeaderBackAction = handleGoBackFromWizard; 
    } else if (selectedDocCategory && selectedSubTypeKey) { // If inside a manager at a sub-type/coming soon screen
        appHeaderBackAction = () => {
            setSelectedSubTypeKey(null); // Go back to the manager's main selection screen
            // The manager's useEffect should then reset its pageConfig
        };
    } else if (selectedDocCategory) { // If at a manager's main selection screen (or a direct form like MinutesManager)
        // For MinutesManager, its internal handlePreviousStep will call onGoHome if it's on step 1.
        // For other managers, this resets to main menu.
        appHeaderBackAction = resetToMainMenu;
    } else { // On main menu
        appHeaderBackAction = resetToMainMenu; // Should be disabled anyway
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-green-50 flex flex-col items-center justify-center p-4 selection:bg-green-200 selection:text-green-800">
            {/* @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here. */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-2xl"
            >
                <Card className="shadow-2xl overflow-hidden">
                    <CardHeader className="bg-white border-b border-gray-200">
                        <div className="flex justify-center items-center relative py-2">
                            {canGoBack && !isHomePage && (
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={appHeaderBackAction} 
                                    className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-600 hover:bg-gray-100"
                                    aria-label="Go back"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                            )}
                             <button
                                onClick={resetToMainMenu} 
                                className="p-0 bg-transparent border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-md disabled:cursor-not-allowed"
                                aria-label="Go to Homepage"
                                title="Go to Homepage"
                                disabled={isHomePage}
                            >
                                <UmsiziLogo />
                            </button>
                        </div>
                        <div className="pt-2 text-center"> 
                            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 justify-center">
                                {React.isValidElement(currentPageConfig.icon) && React.cloneElement(currentPageConfig.icon as React.ReactElement<{ className?: string }>, { className: "mr-3 h-7 w-7 text-green-600"})}
                                {currentPageConfig.title}
                            </CardTitle>
                            <CardDescription className="mt-1.5 text-gray-600">{currentPageConfig.desc}</CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="min-h-[300px] flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            {renderContent()}
                        </AnimatePresence>
                    </CardContent>
                </Card>
                 <p className="text-center text-xs text-gray-500 mt-6 pb-4">
                    Umsizi LLP Document Portal &copy; {new Date().getFullYear()}. For internal use.
                </p>
            </motion.div>
        </div>
    );
};

export default UmsiziDocumentPortalApp;
