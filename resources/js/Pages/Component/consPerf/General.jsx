import moment from "moment";

export default function General({ item }) {
    return (
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-900">
                        CONSIGNMENT STATUS
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                        {item["CONSIGNMENTSTATUS"]}
                    </dd>
                    <dt className="text-sm font-medium text-gray-900">
                        ACCOUNT NAME
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                        {item["ACCOUNTNUMBER"]}
                    </dd>
                    <dt className="text-sm font-medium text-gray-900">
                        KPI DATETIME
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                        {item["KPI DATETIME"]
                            ? moment(
                                  item["KPI DATETIME"].replace("T", " "),
                                  "YYYY-MM-DD HH:mm:ss"
                              ).format("DD-MM-YYYY h:mm A")
                            : null}
                    </dd>
                    <dt className="text-sm font-medium text-gray-900">
                        STATUS
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                        {item["STATUS"]}
                    </dd>
                </div>
            </dl>
        </div>
    );
}
