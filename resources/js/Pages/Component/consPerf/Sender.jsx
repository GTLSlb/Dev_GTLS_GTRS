export default function Sender(item) {
    return (
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-900">
                    SENDER NAME
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">{item.item['SENDERNAME']}</dd>
                    <dt className="text-sm font-medium text-gray-900">
                    SENDER SUBURB
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">{item.item['SENDERSUBURB']}</dd>
                    <dt className="text-sm font-medium text-gray-900">
                    SENDER REFERENCE
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">{item.item['SENDERREFERENCE']}</dd>
                    <dt className="text-sm font-medium text-gray-900">
                    SENDER ZONE
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">{item.item['SENDERZONE']}</dd>
                    <dt className="text-sm font-medium text-gray-900">
                    SENDER POSTCODE
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">{item.item['SENDERPOSTCODE']}</dd>
                    
                </div>
            </dl>
        </div>
    );
}
