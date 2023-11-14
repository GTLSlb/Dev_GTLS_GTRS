import React from "react";
import { useEffect, useState } from "react";
export default function CompleteProfile({
    groupPolicy,
    setCheckStep1,
    policy,
    setPolicy,
}) {
    const [selectedGroup, setGroup] = useState(null);

    function handleSelected(event) {
        setPolicy(event.target.id)
    }

    useEffect(()=>{
        if(policy){
            setGroup(groupPolicy?.find((group)=> policy == group.GroupId))
            setCheckStep1(true);
        }
    },[policy])

    return (
        <div className="py-2">
            <h1 className="font-bold text-dark">Group Policy</h1>
            <p className="text-gray-500">
                Assign a group policy for the new user.
            </p>
            <div className="py-5">
                {groupPolicy
                    ? groupPolicy?.map((group) =>
                          group.StatusName == "Active" ? (
                              <div
                                  id={group.GroupId}
                                  key={group.GroupId}
                                  className="pb-2"
                              >
                                  <input
                                      type="radio"
                                      id={group.GroupId}
                                      name={group.GroupName}
                                      checked={selectedGroup?.GroupName == group.GroupName}
                                      className="rounded text-green-400 border-gray-300 focus:ring-green-500 w-4 h-4"
                                      value={group.GroupName}
                                      onChange={handleSelected}
                                  />
                                  <label className="capitalize mx-2 text-sm">
                                      {group.GroupName}
                                  </label>
                              </div>
                          ) : null
                      )
                    : null}
            </div>
        </div>
    );
}
