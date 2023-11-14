import { useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'

import kpi from '@/assets/screenshots/KPI-GTLS.webp'
import consignments from '@/assets/screenshots/CONS-GTLS.webp'
import dashboard from '@/assets/screenshots/DASH-GTLS.webp'
import performance from '@/assets/screenshots/PERF-GTLS.webp'

const features = [
  {
    title: 'Dashboard',
    description:
      "The statistics charts offer visual representations of important metrics, such as the total number of receivers, total weight, cost, PODs.",
    image: dashboard,
  },
  {
    title: 'Consignments',
    description:
      "The consignments page displays a list of all consignments charged to the selected accounts.",
    image: consignments,
  },
  {
    title: 'Kpi report',
    description:
      "KPI report page displays whether the delivery date matches the required delivery date of a consignment.",
    image: kpi,
  },
  {
    title: 'Performance',
    description:
      'The report provides a comprehensive performance report for each consignment. It includes general information about the consignment, detailed information, the amount, sender and receiver data.',
    image: performance,
  },
]

export function Softwares() {
  let [tabOrientation, setTabOrientation] = useState('vertical')

  useEffect(() => {
    let lgMediaQuery = window.matchMedia('(min-width: 1024px)')

    function onMediaQueryChange({ matches }) {
      setTabOrientation(matches ? 'horizontal' : 'vertical')
    }

    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener('change', onMediaQueryChange)

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [])

  return (
    <section
      id="features"
      aria-label="Features for running your books"
      className="relative overflow-hidden bg-dark pt-20 pb-28 sm:py-32"
    >
      {/* <Image
        className="absolute top-1/2 left-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]"
        src={backgroundImage}
        alt=""
        width={2245}
        height={1636}
        unoptimized
      /> */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto pt-10 w-full">
                    <p className=" text-4xl font-bold tracking-tight text-goldt sm:text-5xl">
                        Gold Tiger reporting system
                    </p>
                </div>
        <Tab.Group
          as="div"
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === 'vertical'}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 mx-0 sm:overflow-visible sm:pb-0 lg:col-span-3">
                <Tab.List className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        'group relative rounded-full py-1 px-4 lg:rounded-r-none lg:rounded-l-xl lg:p-4',
                        selectedIndex === featureIndex
                          ? 'bg-white/10 lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-white/10'
                          : 'hover:bg-white/10 lg:hover:bg-white/5'
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            'font-display text-lg [&:not(:focus-visible)]:focus:outline-none focus:outline-none',
                            selectedIndex === featureIndex
                              ? 'text-goldd lg:text-goldd'
                              : 'text-goldl hover:text-white lg:text-goldl'
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-r-none lg:rounded-l-xl focus:outline-none" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          'mt-2 hidden text-sm lg:block',
                          selectedIndex === featureIndex
                            ? 'text-white'
                            : 'text-blue-100 group-hover:text-white'
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </Tab.List>
              </div>
              <Tab.Panels className="lg:col-span-7">
                {features.map((feature) => (
                  <Tab.Panel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 top-[-6.5rem] bottom-[-3rem]  border-t border-l border-r border-yellow-200 border-opacity-20 sm:inset-x-0 sm:rounded-t-xl" />
                      <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                        {feature.description}
                      </p>
                    </div>
                    <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50  w-auto lg:mt-0 lg:w-[65rem]">
                      <img
                        className="w-full"
                        src={feature.image}
                        alt=""
                        priority
                        sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                      />
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </>
          )}
        </Tab.Group>
      </div>
    </section>
  )
}
