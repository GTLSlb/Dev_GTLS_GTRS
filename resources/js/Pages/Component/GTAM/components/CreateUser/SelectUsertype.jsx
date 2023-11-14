import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon} from '@heroicons/react/20/solid'
import { useEffect } from 'react';

export default function SelectUserAccount({ setCheckStep1, setType, userType, userTypes }) {
    const [selectedType, setSelectedType] = useState(userType);
    function handleSelected(event) {
        setSelectedType(event);
        setCheckStep1(true)
        setType(event);
    }
    return (
        <div className="my-5 overflow-auto w-1/3 border-2 rounded-xl border-gray-100 max-h-full">
            <div>
            <div className="">
      <Listbox value={selectedType} onChange={handleSelected}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{selectedType.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Listbox.Options className='my-2'>
        {userTypes.map((type) => (
          <Listbox.Option
            key={type.id}
            value={type}
            disabled={type.unavailable}
            className={`${type.id==1 ? "bg-gray-100" : ""} py-0.5 hover:bg-gray-50 hover:cursor-pointer`}
          >
            <span className='p-2'>{type.name}</span>
          </Listbox.Option>
        ))}
      </Listbox.Options>
        </div>
      </Listbox>
            </div>
        </div>
        </div>
    );
}
