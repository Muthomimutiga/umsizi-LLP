
import React, { FC, useEffect } from 'react';
import { ClipboardCheck } from 'lucide-react';
import { ManagerProps } from './types';
import ComingSoonPlaceholder from './ComingSoonPlaceholder';

const BoardEvaluationManager: FC<ManagerProps> = ({ onSetPageConfig }) => {
    useEffect(() => {
        onSetPageConfig({
            title: "Board Evaluation",
            icon: <ClipboardCheck className="h-6 w-6" />,
            desc: "This service is currently under development. Form details will be available soon."
        });
    }, [onSetPageConfig]);

    return <ComingSoonPlaceholder title="Board Evaluation" icon={<ClipboardCheck className="h-16 w-16 text-green-500 opacity-70 mb-4" />} />;
};

export default BoardEvaluationManager;
