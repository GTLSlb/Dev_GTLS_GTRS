/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import {
    BuildingOffice2Icon,
    EnvelopeIcon,
    PhoneIcon,
    PrinterIcon,
    InboxStackIcon,
} from "@heroicons/react/24/outline";
import ContactUsForm from "./ContatcUsForm";

export default function ContatcUs() {
    return (
        <div className="bg-dark mt-12">
<div className="relative " id="contact">
    <div className="absolute opacity-40  bg-world bg-cover w-full h-full"></div>
            <div className="relative mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 items-center z-10">
                <div className="relative px-6 pt-24 pb-20 sm:pt-32 lg:static lg:py-24 lg:px-8 ">
                    <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg ">
                        <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden  lg:w-1/2">
                            
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight text-goldt sm:text-4xl">
                            Contact us
                        </h2>
                        <dl className="pl-5 mt-10 space-y-4 text-base leading-7 text-gray-300">
                            {/* <h2 className="text-xl font-bold tracking-tight text-gray-200">
                                Get in touch
                            </h2> */}
                            <div className="flex gap-x-6">
                                <dt className="flex-none">
                                    <span className="sr-only">Telephone</span>
                                    <PhoneIcon
                                        className="h-7 w-6 text-goldt"
                                        aria-hidden="true"
                                    />
                                </dt>
                                <dd>
                                    <a
                                        className="hover:text-goldt text-lg"
                                        href="tel:+1800 04 03 06"
                                    >
                                        1800 04 03 06
                                    </a>
                                </dd>
                            </div>
                            <div className="flex gap-x-6">
                                <dt className="flex-none">
                                    <span className="sr-only">Telephone</span>
                                    <PrinterIcon
                                        className="h-7 w-6 text-goldt"
                                        aria-hidden="true"
                                    />
                                </dt>
                                <dd>
                                    <a
                                        className="hover:text-goldt text-lg"
                                        href="tel:+02 9605 1700"
                                    >
                                        02 9605 1700
                                    </a>
                                </dd>
                            </div>
                            <div className="flex gap-x-6">
                                <dt className="flex-none">
                                    <span className="sr-only">Telephone</span>
                                    <InboxStackIcon
                                        className="h-7 w-6 text-goldt"
                                        aria-hidden="true"
                                    />
                                </dt>
                                <dd>
                                    <a className=" text-lg" href="#">
                                        Box 167, Hoxton Park, NSW 2171
                                    </a>
                                </dd>
                            </div>
                            <div className="flex gap-x-6">
                                <dt className="flex-none">
                                    <span className="sr-only">Telephone</span>
                                    <EnvelopeIcon
                                        className="h-7 w-6 text-goldt"
                                        aria-hidden="true"
                                    />
                                </dt>
                                <dd>
                                    <a
                                        className="hover:text-goldt text-lg"
                                        href="mailto:enquiries@gtls.com.au"
                                    >
                                        enquiries@gtls.com.au
                                    </a>
                                </dd>
                            </div>
                            <div className="flex gap-x-6">
                                <dt className="flex-none">
                                    <span className="sr-only">Telephone</span>
                                    <BuildingOffice2Icon
                                        className="h-7 w-6 text-goldt"
                                        aria-hidden="true"
                                    />
                                </dt>
                                <dd className="text-lg">
                                    SYDNEY BRANCH
                                    <br />
                                    3B Inglis Road, Ingleburn, NSW 2565
                                </dd>
                            </div>

                            <div className="flex gap-x-6">
                                <dt className="flex-none">
                                    <span className="sr-only">Telephone</span>
                                    <BuildingOffice2Icon
                                        className="h-7 w-6 text-goldt"
                                        aria-hidden="true"
                                    />
                                </dt>
                                <dd className="text-lg">
                                    MELBOURNE BRANCH
                                    <br />
                                    60-70 Monash Drive, Dandenong South, VIC 3175
                                </dd>
                            </div>

                            <div className="flex gap-x-6">
                                <dt className="flex-none">
                                    <span className="sr-only">Telephone</span>
                                    <BuildingOffice2Icon
                                        className="h-7 w-6 text-goldt"
                                        aria-hidden="true"
                                    />
                                </dt>
                                <dd className="text-lg">
                                    BRISBANE BRANCH
                                    <br />
                                    341 Freeman Road, Richlands, QLD 4077
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
                {/* <form
                    action="#"
                    method="POST"
                    className="px-6 pb-24 pt-20 sm:pb-32 lg:py-24 lg:px-8"
                >
                    <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="first-name"
                                    className="block text-sm font-semibold leading-6 text-gray-900"
                                >
                                    Name
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-goldt sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="last-name"
                                    className="block text-sm font-semibold leading-6 text-gray-900"
                                >
                                    Company
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-goldt sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold leading-6 text-gray-900"
                                >
                                    Email
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-goldt sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="phone-number"
                                    className="block text-sm font-semibold leading-6 text-gray-900"
                                >
                                    Phone number
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        type="tel"
                                        name="phone-number"
                                        id="phone-number"
                                        autoComplete="tel"
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-goldt sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-semibold leading-6 text-gray-900"
                                >
                                    Message
                                </label>
                                <div className="mt-2.5">
                                    <textarea
                                        name="message"
                                        id="message"
                                        rows={4}
                                        className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-goldt sm:text-sm sm:leading-6"
                                        defaultValue={""}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                className="rounded-md bg-goldt px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldt"
                            >
                                Send message
                            </button>
                        </div>
                    </div>
                </form> */}
                <ContactUsForm />
            </div>
        </div>
        </div>
        
    );
}
