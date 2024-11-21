// ConfirmationModal.js
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleX, TriangleAlert } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, content, isReversible = "", showbuttons = "" }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg border border-red-600 sure-popup-set "
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                    >
                        <div className='text-center smallct'>
                            <h2 className="text-lg mb-3 font-semibold">
                                <span className=" f-20">
                                    {content}
                                </span>
                            </h2>
                            {isReversible && (
                                <p className="bg-red-100 p-1 rounded flex my-2">
                                    <TriangleAlert className="mr-2 text-red-600 font-semibold ic1" />
                                    This is an irreversible process
                                </p>
                            )}
                            {/* <span className="block text-gray-700">{content}</span> */}
                        </div>
                        {!showbuttons && (<>
                            <div className="flex justify-center mt-3 smallcta">
                                <button
                                    onClick={onClose}
                                    className="bg-gray-300 text-gray-800 py-1 px-2 rounded mr-2 transition duration-200 hover:bg-gray-400"
                                >
                                    No
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="bg-red-600 text-white py-1 px-3 rounded transition duration-200 hover:bg-red-700"
                                >
                                    Yes
                                </button>
                            </div>
                        </>)}

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
