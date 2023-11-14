import { PencilIcon } from "@heroicons/react/24/outline";

export default function GtamProfile(props) {
    const { activeIndex } = props;
    return (
        <div className=" ml-2 mt-6 flex flex-col sm:flex sm:items-center p-5">
            <div className="mb-6 flex flex-row justify-between w-full">
                <a href="#" className=" ">
                    <img
                        alt="profile"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className=" mx-auto object-cover rounded-full h-24 w-24 border-4"
                    />
                </a>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <PencilIcon
                            className="-ml-1 mr-3 h-5 w-5"
                            aria-hidden="true"
                        />
                        Edit
                    </button>
                </div>
            </div>
            <div className="sm:flex-auto text-left w-full">
                <div className="flex flex-row">
                    <div>
                        <p className="text-sm  text-gray-900">Full Name :</p>
                        <p className="text-sm  text-gray-900">Job Title:</p>
                        <p className="text-sm  text-gray-900">Role:</p>
                    </div>
                    <div className="flex flex-col ml-16">
                        <p className=" text-sm font-semibold text-gray-700">
                            Tom
                        </p>
                        <p className=" text-sm font-semibold text-gray-700">
                            Progammer
                        </p>
                        <p className=" text-sm font-semibold text-gray-700">
                            Admin
                        </p>
                    </div>
                </div>
                
            </div>
            <div className="mt-20 sm:flex-auto text-left w-full">
                <h1 className="text-xl font-semibold text-gray-900">Setting</h1>
                <p className="mt-2 text-sm text-gray-700">Change Password.</p>
            </div>
        </div>
    );
}
