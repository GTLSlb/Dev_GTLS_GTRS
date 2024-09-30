import {
    Bars3BottomLeftIcon,
} from "@heroicons/react/24/outline";
export default function MainNavbar({
    setMobileMenuOpen,
}) {

    return (
        <header className="w-full flex flex-1 flex-col  md:ml-20 fixed top-0 z-50 shadow-md">
            <div className="relative z-10 flex h-16 flex-shrink-0 w-full border-b border-gray-200 bg-white shadow-sm ">
                <button
                    type="button"
                    className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3BottomLeftIcon
                        className="h-6 w-6"
                        aria-hidden="true"
                    />
                </button>
                <div className="flex justify-between items-center lg:gap-x-16 px-4 sm:px-6 w-11/12">
                    <div className=" text-sm font-bold leading-7 text-gray-700 sm:truncate sm:text-lg sm:tracking-tight mr-2">
                        <span className="text-goldd">GOLD </span>TIGER{" "}
                        Report System
                    </div>
                </div>
            </div>
        </header>
    );
}
