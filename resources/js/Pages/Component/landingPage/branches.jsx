const people = [
    {
        name: "SYDNEY BRANCH",
        role: "3B Inglis Road, Ingleburn, NSW 2565",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4677.612514708739!2d150.8439555074476!3d-34.00353778176511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ec630f8bd465%3A0x5d25306b8022c9a!2sGold%20Tiger%20Logistics%20Solutions!5e0!3m2!1sen!2slb!4v1677847147994!5m2!1sen!2slb&amp;mode=dark",
        twitterUrl: "#",
        linkedinUrl: "#",
    },
    {
        name: "MELBOURNE BRANCH",
        role: "60-70 Monash Drive, Dandenong South VIC 3175",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d24424.07459902225!2d145.20657445542074!3d-38.036151337929255!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad61116fb34ca11%3A0x227c034317f1f9f!2sGold%20Tiger%20Logistics%20Solutions!5e0!3m2!1sen!2slb!4v1677847628192!5m2!1sen!2slb&amp;mode=dark",
        twitterUrl: "#",
        linkedinUrl: "#",
    },
    {
        name: "BRISBANE BRANCH",
        role: "341 Freeman Rd, Richlands, QLD 4077",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1768.1956935527426!2d152.958802024188!3d-27.581392949605526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b914f05d239f3dd%3A0xd22bdddb5823983a!2sGold%20Tiger%20Logistics%20Soltuions!5e0!3m2!1sen!2slb!4v1679896698046!5m2!1sen!2slb",
        twitterUrl: "#",
        linkedinUrl: "#",
    },
    // More people...<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1768.1956935527426!2d152.958802024188!3d-27.581392949605526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b914f05d239f3dd%3A0xd22bdddb5823983a!2sGold%20Tiger%20Logistics%20Soltuions!5e0!3m2!1sen!2slb!4v1679896698046!5m2!1sen!2slb" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
];

export default function Branches() {
    return (
        <div className="bg-dark py-8 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="">
                    <h2 className="text-3xl  font-bold tracking-tight text-goldt sm:text-4xl ">
                        Our branches
                    </h2>
                    <p className="mt-2 text-lg text-white font-bold">
                        These are our three branches in south-east Australia.
                    </p>
                </div>
                <ul
                    role="list"
                    className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-20 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
                >
                    {people.map((person) => (
                        <li key={person.name}>
                            <iframe
                                title={person.name}
                                src={person.mapUrl}
                                width="600"
                                height="450"
                                allowFullScreen=""
                                maptype="satellite"
                                loading="lazy"
                                className=" aspect-[3/2] w-full shadow-xl rounded-2xl object-cover"
                            ></iframe>
                            <div className="">
                                <h3 className=" mt-2 text-lg font-bold leading-8 tracking-tight text-center text-white">
                                    {person.name}
                                </h3>
                                {/* <p className=" text-base leading-7 text-gray-600">{person.role}</p> */}
                            </div>
                            <ul role="list" className="mt-6 flex gap-x-6"></ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
