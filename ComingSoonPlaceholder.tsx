
import React, { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { questionVariants } from './constants';
import { FileQuestion } from 'lucide-react';

interface ComingSoonPlaceholderProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
}

const ComingSoonPlaceholder: FC<ComingSoonPlaceholderProps> = ({
  title = "Coming Soon!",
  message = "We're working on bringing this feature to you.",
  icon
}) => {
  const displayIcon = icon ? 
    React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {className: "h-16 w-16 text-green-500 opacity-70 mb-4"}) : icon
    : <FileQuestion className="h-16 w-16 text-green-500 opacity-70 mb-4" />;

  return (
    // @ts-ignore TypeScript is not correctly recognizing framer-motion animation props here.
    <motion.div
        variants={questionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-5 py-10 text-center flex flex-col items-center justify-center min-h-[250px]"
    >
        {displayIcon}
        <p className="text-lg text-gray-700 font-medium">{title}</p>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
            {message}
        </p>
    </motion.div>
  );
};

export default ComingSoonPlaceholder;