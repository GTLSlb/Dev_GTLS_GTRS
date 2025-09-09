import { XMarkIcon } from "@heroicons/react/24/outline";
import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
    useMemo,
} from "react";

export const CustomModal = ({
    isOpen,
    onClose,
    title,
    children,
    filterChildren,
    noTitle = false,
    noFilters = false,
    noCloseButton = false,
    size = "2xl",
}) => {
    const modalRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    // Memoize the close handler to prevent child re-renders
    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    // Memoize size classes - calculate once and reuse
    const sizeClasses = useMemo(() => {
        const sizes = {
            sm: "max-w-md",
            md: "max-w-lg",
            lg: "max-w-2xl",
            xl: "max-w-4xl",
            "2xl": "max-w-6xl",
            "3xl": "max-w-7xl",
            "4xl": "max-w-screen-xl",
            "5xl": "max-w-screen-2xl",
            full: "max-w-full mx-4",
        };
        return sizes[size] || sizes["5xl"];
    }, [size]);

    // Memoize CSS classes to prevent recalculation on every render
    const overlayClasses = useMemo(
        () =>
            `fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ease-out ${
                isVisible ? "opacity-100" : "opacity-0"
            }`,
        [isVisible]
    );

    const backdropClasses = useMemo(
        () =>
            `absolute inset-0 bg-black/50 transition-opacity duration-200 ease-out ${
                isVisible ? "opacity-100" : "opacity-0"
            }`,
        [isVisible]
    );

    const modalClasses = useMemo(
        () =>
            `relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full ${sizeClasses} max-h-[90vh] flex flex-col m-4 border border-gray-200 dark:border-gray-700 transition-all duration-200 ease-out ${
                isVisible
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 translate-y-4"
            }`,
        [isVisible, sizeClasses]
    );

    // Optimized animation handling with reduced duration
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            document.body.style.overflow = "hidden";
            // Use setTimeout instead of requestAnimationFrame for more predictable timing
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            // Faster cleanup
            const timer = setTimeout(() => {
                setShouldRender(false);
                document.body.style.overflow = "unset";
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Optimized event handlers with better cleanup
    useEffect(() => {
        if (!isVisible) return;

        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        // Add both listeners at once to minimize DOM operations
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isVisible, handleClose]);

    if (!shouldRender) return null;

    return (
        <div className={overlayClasses}>
            {/* Simplified backdrop - removed heavy blur effects */}
            <div className={backdropClasses} onClick={handleClose} />

            {/* Modal Content - removed excessive backdrop blur */}
            <div ref={modalRef} className={modalClasses}>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-2 px-4 border-b border-gray-200 dark:border-gray-700">
                    {!noTitle ? (
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h2>
                    ) : (
                        <div></div>
                    )}
                    {!noCloseButton && (
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                            aria-label="Close modal"
                        >
                            <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </button>
                    )}
                </div>

                {/* Modal Body - simplified structure */}
                <div className="p-6">
                    <div className="flex gap-4 justify-start items-start">
                        <div className={`${noFilters ? "w-full" : "w-3/4"}`}>
                            {children}
                            <div className="w-px bg-gray-300 dark:bg-gray-600 mx-4 self-stretch" />
                        </div>
                        {!noFilters && (
                            <div className="w-1/4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Filters
                                </h3>
                                <div className="space-y-4">
                                    {filterChildren}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
