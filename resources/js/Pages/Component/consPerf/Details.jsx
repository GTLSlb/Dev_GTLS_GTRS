import moment from "moment";

export default function Details(item) {
    return (
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:py-5 sm:px-6">
                    <dt className="text-sm font-medium text-gray-900">
                        CONSIGNMENT STATUS
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                        {item.item.CONSIGNMENTSTATUS}
                    </dd>
                    <dt className="text-sm font-medium text-gray-900">
                        LOADING TIME
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                        {item.item.LOADINGTIME}
                    </dd>
                    <dt className="text-sm font-medium text-gray-900">
                        DELIVERY REQUIRED DATETIME
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                        {item?.item["DELIVERYREQUIREDDATETIME"] === ""
                            ? ""
                            : moment(
                                  item.item[
                                      "DELIVERYREQUIREDDATETIME"
                                  ]?.replace("T", " "),
                                  "YYYY-MM-DD HH:mm:ss"
                              ).format("DD-MM-YYYY h:mm A")}
                    </dd>
                    <dt className="text-sm font-medium text-gray-900">
                        SERVICE
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                        {item?.item.SERVICE}
                    </dd>
                    <dt className="text-sm font-medium text-gray-900">
                        TOTAL QUANTITY
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                        {item.item["TOTALQUANTITY"]}
                    </dd>
                    <dt className="text-sm font-medium text-gray-900">
                        DELIVERED DATE TIME
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                        {item?.item["DELIVEREDDATETIME"] === ""
                            ? ""
                            : moment(
                                  item.item["DELIVEREDDATETIME"]?.replace(
                                      "T",
                                      " "
                                  ),
                                  "YYYY-MM-DD HH:mm:ss"
                              ).format("DD-MM-YYYY h:mm A")}
                    </dd>
                    <dt className="text-sm font-medium text-gray-900">
                        MANIFEST NO
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                        {item.item["MANIFESTNO"]}
                    </dd>
                    <dt className="text-sm font-medium text-gray-900">
                        TOTAL WEIGHT
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                        {item.item["TOTALWEIGHT"]}
                    </dd>
                    <dt className="text-sm font-medium text-gray-900">
                        DESPATCH DATE
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">
                        {item?.item["DESPATCHDATE"] === ""
                            ? ""
                            : moment(
                                  item.item["DESPATCHDATE"]?.replace("T", " "),
                                  "YYYY-MM-DD HH:mm:ss"
                              ).format("DD-MM-YYYY h:mm A")}
                    </dd>
                    {/* <dt className="text-sm font-medium text-gray-900">
                    DESPATCHDATE
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500  sm:mt-0 ">{moment(item.item['DespatchDate']?.replace("T"," "), 'YYYY-MM-DD ').format('DD-MM-YYYY ')}</dd> */}
                </div>
            </dl>
        </div>
    );
}
