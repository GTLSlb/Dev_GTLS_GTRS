
import { useState, useEffect} from "react";
import GtamButton from "./components/Buttons/GtamButton";
import EmployeesTable from "./components/EmployeesTable";

export default function GtamUsers({activeIndex,currentUser,useTypesDb, setActiveIndex,url, employees, setUserProfile, setUserTypeFromPage}) {
    
function createUser(){
    setUserTypeFromPage(2);
    setActiveIndex(6);
}
const [users,setUsers]= useState(employees);
const [userType, setUserType] = useState(null);
useEffect(()=>{
    if(useTypesDb){
        let arr = useTypesDb?.find((type)=>
        type.TypeName == 'Employee')
        setUserType(arr);
    }
},[useTypesDb])
useEffect(()=>{
    if(employees && useTypesDb){
        setUsers(employees.filter((item)=>
            item.TypeId === userType?.TypeId
        ))
        console.log(userType?.TypeId)
    }
},[employees])
    return (
        <div className="px-6 lg:px-8 p-2">
            <div className="mt-6 sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Employees
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the employees in your account including their
                        name, title, email and role.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    
                    <GtamButton
                    name={"Create Employee"}
                    onClick={createUser}
                    className={"w-[9rem]"}
                    />
                </div>
            </div>
            <EmployeesTable setActiveIndex={setActiveIndex} employees={users} setUserProfile={setUserProfile}/>
        </div>
    );
}
