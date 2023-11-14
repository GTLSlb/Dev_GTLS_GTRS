import React from 'react';

function DashboardCard07(props) {
  const data = props.InfoData;
  const percentagePassed = (data.totalNoConsPassed / data.totalNoConsShipped) * 100;
  const percentageFailed = (data.totalConsFailed / data.totalNoConsShipped) * 100;

  return (
    <div className="col-span-full h-full xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-2 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800 ">Information</h2>
      </header>
      <div className="p-3">

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-slate-100">
              {/* Row */}
              <tr>
                <td className="p-1">
                  <div className="flex items-center py-1 font-extrabold">
                    <div className="text-slate-800 text-sm"># of Rec's</div>
                  </div>
                </td>
                <td className="px-1">
                  <div className="text-center text-sm text-right">{data.numUniqueReceivers}</div>
                </td>
              </tr>
              <tr>
                <td className="px-1">
                  <div className="flex items-center py-1 font-extrabold">
                    <div className="text-slate-800 text-sm">Total Weight</div>
                  </div>
                </td>
                <td className="px-1">
                  <div className="text-center text-sm text-right">{data.totalWeight?.toFixed(2)} KG</div>

                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="px-1">
                  <div className="flex items-center py-1 font-extrabold">
                    <div className="text-slate-800 text-sm">Total Pallet Space</div>
                  </div>
                </td>
                <td className="px-1">
                  <div className="text-center text-sm text-right">{data.totalPalletSpace}</div>
                </td>
              </tr>
              <tr>
                <td className="px-1">
                  <div className="flex items-center py-1 font-extrabold">
                    <div className="text-slate-800 text-sm">Total CHEP</div>
                  </div>
                </td>
                <td className="px-1">
                  <div className="text-center text-sm text-right">{data.totalChep}</div>
                </td>
              </tr>
              <tr>
                <td className="px-1">
                  <div className="flex items-center py-1 font-extrabold">
                    <div className="text-slate-800 text-sm">Total LOSCAM</div>
                  </div>
                </td>
                <td className="px-1 text-right">
                  <div className="text-center text-sm text-right">{data.totalLoscam}</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="px-1">
                  <div className="flex items-center py-1 font-extrabold">
                    <div className="text-slate-800 text-sm">Total CUSTOMER OWN</div>
                  </div>
                </td>
                <td className="px-1">
                  <div className="text-center text-sm text-right">{data.totalCustomerOwn}</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="px-1">
                  <div className="flex items-center py-1 font-extrabold">
                    <div className="text-slate-800 text-sm">Cost</div>
                  </div>
                </td>
                <td className="px-1">
                  <div className="text-center text-sm text-right">$ {data.totalCost?.toFixed(2)} </div>
                </td>
              </tr>
              <tr>
                <td className="px-1">
                  <div className="flex items-center py-1 font-extrabold">
                    <div className="text-slate-800 text-sm">Total No. Cons Shipped</div>
                  </div>
                </td>
                <td className="px-1">
                  <div className="text-center text-sm text-right">{data.totalNoConsShipped}</div>
                </td>
              </tr>
              <tr>
                <td className="px-1">
                  <div className="flex items-center py-1 font-extrabold">
                    <div className="text-slate-800 text-sm">Total No. Cons Passed</div>
                  </div>
                </td>
                <td className="px-1">
                  <div className="text-center text-sm text-right">{data.totalNoConsPassed} / {percentagePassed?.toFixed(2)} % </div>
                </td>
              </tr>
              <tr>
                <td className="px-1">
                  <div className="flex items-center py-1 font-extrabold">
                    <div className="text-slate-800 text-sm">Total No. Cons Failed</div>
                  </div>
                </td>
                <td className="px-1">
                  <div className="text-center text-sm text-right">{data.totalConsFailed} / {percentageFailed?.toFixed(2)} %</div>
                </td>
              </tr>
              <tr>
                <td className="px-1">
                  <div className="flex items-center py-1 font-extrabold">
                    <div className="text-slate-800 text-sm"># of True PODs</div>
                  </div>
                </td>
                <td className="px-1">
                  <div className="text-center text-sm text-right">{data.podCounter}</div>
                </td>
              </tr>
              <tr>
                <td className="px-1">
                  <div className="flex items-center py-1 font-extrabold">
                    <div className="text-slate-800 text-sm">% of True PODs</div>
                  </div>
                </td>
                <td className="px-1">
                  <div className="text-center text-sm text-right"> {data.podPercentage?.toFixed(2)} %</div>
                </td>
              </tr>
              <tr>
                <td className="px-1">
                  <div className="flex items-center py-1 font-extrabold">
                    <div className="text-slate-800 text-sm"># of safety issues</div>
                  </div>
                </td>
                <td className="px-1">
                  <div className="text-center text-sm text-right"> {data.safetyCounter} </div>
                </td>
              </tr>
              {/* Row */}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default DashboardCard07;
