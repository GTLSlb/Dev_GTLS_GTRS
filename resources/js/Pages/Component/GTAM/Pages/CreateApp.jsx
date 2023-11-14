import { useState } from "react";
import ColorPicker from "../components/ColorPicker";
import GtamButton from "../components/Buttons/GtamButton";
import { useEffect } from "react";
const statuses = [
    { id: 1, title: "Development" },
    { id: 2, title: "Testing" },
    { id: 3, title: "Production" },
];
export default function CreateApp({ url, currentUser ,setActiveIndex,AlertToast,application}) {
    const [file, setFile] = useState();
    const [primary, setPrimary] = useState("red-700");
    const [secondary, setSecondary] = useState("red-500");
    const [isLoading, SetIsLoading] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState(1); // Assuming 'Testing' is the default value
useEffect(()=>{
    console.log("kjno")
    if(application){
        // setSelectedStatus(application.app)
        setPrimary(application.Colors[0].ColorName)
        setSecondary(application.Colors[1].ColorName)
    }
},[])
console.log(primary,secondary)
    // Step 2: Create an event handler to update the state
    const handleStatusChange = (event) => {
        console.log(event.target.value);
        setSelectedStatus(event.target.value);
    };

    function handleFileChange(e) {
        setFile(e.target.files[0]);
    }
    // console.log(file);
    // console.log(primary);
    // console.log(secondary);
    let filename = "";

    const handleFileUpload = async (e) => {
        e.preventDefault();
        SetIsLoading(true);
if(application?.AppPic){
    filename=application?.AppPic 
    handleCreateApp();}else{
        if (file != null) {
            try {
                const formData = new FormData();
                formData.append("file", file);

                try {
                    const response = await axios.post(
                        "/api/uploadlogo",
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );

                    if (response.status === 200) {
                        filename = response.data.filename;

                        // You can perform any additional actions here for each uploaded file if needed
                    }
                } catch (error) {
                    console.error("Error:", error);
                    SetIsLoading(false);
                }

                // Wait for all uploads to complete before proceeding

                // After all uploads are complete, you can proceed with further actions
                handleCreateApp();
            } catch (error) {
                console.error("Error:", error);
                SetIsLoading(false);
            }
        } else {
            handleCreateApp();
            //   alert("Please select one or more files first.");
        }
    }
    };
    const handleCreateApp = () => {
console.log(application)
        const inputValues = {
            AppId: application?application.AppId:null,
            AppName: document.getElementById("AppName").value,
            AppDescription: document.getElementById("description").value,
            AppVersion: document.getElementById("AppVersion").value,
            AppPic: filename,
            AppAbv: document.getElementById("AppAbv").value,
            DevPhase: selectedStatus,
            ReleasedDate: document.getElementById("ReleasedDate").value,
            StatusId: 1,
            AppColors: [
                {

                    AppColorId: application?application.Colors[0].ColorId:null,
                    ColorType: "primary",
                    ColorName: primary,
                },
                {
                    AppColorId: application?application.Colors[1].ColorId:null,
                    ColorType: "second",
                    ColorName: secondary,
                },
            ],
        };
        console.log(inputValues);
        axios
            .post(`${url}api/GTAM/Add/Application`, inputValues, {
                headers: {
                    UserId: currentUser.user_id,
                },
            })
            .then((res) => {
                console.log("done");
                // AlertToast("Saved Successfully", 1);\
                AlertToast("Saved successfully",1)
                SetIsLoading(false);
                setActiveIndex(3)
            })
            .catch((err) => {
                SetIsLoading(false);
                AlertToast("Something went wrong",2)
                // AlertToast("Error please try again.", 2);
                console.log(err);
            });
    };
    return (
        <div className="p-10">
            <div className="bg-white rounded-xl shadow p-8">
                <h1 className="text-dark font-bold text-xl ">Create New App</h1>
                <div className="py-4">
                    <h1 className="text-dark font-semibold">
                        General Information
                    </h1>
                    <span className="text-gray-400">
                        This information will be displayed publicly so be
                        careful what you share.
                    </span>
                </div>
                <form onSubmit={handleFileUpload}>
                    <div>
                        <div className="flex py-3 flex-col xl:flex-row gap-x-10 gap-y-5 justify-start">
                            <div className="flex flex-col sm:flex-row gap-y-5 xl:justify-between gap-x-10 sm:items-center">
                                <label
                                    htmlFor="AppName"
                                    className="text-base font-semibold text-gray-900 w-28"
                                >
                                    App Name:
                                </label>
                                <div className="items-center">
                                    <input
                                        required
                                        type="text"
                                        name="AppName"
                                        id="AppName"
                                        defaultValue={application?application.AppName:""}
                                        className="block w-full md:w-60  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-y-5 xl:justify-between gap-x-10 sm:items-center">
                                <label
                                    htmlFor="AppName"
                                    className="text-base font-semibold text-gray-900 w-28"
                                >
                                    App Abv:
                                </label>
                                <div className="items-center">
                                    <input
                                        required
                                        type="text"
                                        name="AppAbv"
                                        id="AppAbv"
                                        defaultValue={application?application.AppAbv:""}
                                        className="block w-full md:w-60  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex py-3 flex-col xl:flex-row gap-x-10 gap-y-5 justify-start">
                            
                            <div className="flex flex-col sm:flex-row gap-y-5 xl:justify-between gap-x-10 sm:items-center">
                                <label
                                    htmlFor="AppVersion"
                                    className="text-base font-semibold text-gray-900 w-28"
                                >
                                    App Version:
                                </label>
                                <div className="items-center">
                                    <input
                                        required
                                        type="text"
                                        name="AppVersion"
                                        id="AppVersion"
                                        defaultValue={application?application.AppVersion:""}
                                        className="block w-full md:w-60  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-y-5 xl:justify-between gap-x-10 sm:items-center">
                                <label
                                    htmlFor="ReleasedDate"
                                    className="text-base font-semibold text-gray-900 w-28"
                                >
                                    Released Date:
                                </label>
                                <div className="items-center">
                                    <input
                                        required
                                        type="date"
                                        name="ReleasedDate"
                                        defaultValue={application?application.ReleasedDate:""}
                                        id="ReleasedDate"
                                        className="block md:w-60  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* <div className="flex flex-col 2xl:flex-row gap-y-5 gap-x-5 justify-between">
                            <div className="flex flex-col sm:flex-row gap-y-5 xl:justify-between gap-x-10 sm:items-center">
                                <label
                                    htmlFor="AppName"
                                    className="text-base font-semibold text-gray-900 w-28"
                                >
                                    App Name:
                                </label>
                                <div className="items-center">
                                    <input
                                        required
                                        type="text"
                                        name="AppName"
                                        id="AppName"
                                        className="block w-full md:w-auto  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-y-5 xl:justify-between gap-x-10 sm:items-center">
                                <label
                                    htmlFor="AppVersion"
                                    className="text-base font-semibold text-gray-900 w-28"
                                >
                                    App Version:
                                </label>
                                <div className="items-center">
                                    <input
                                        required
                                        type="text"
                                        name="AppVersion"
                                        id="AppVersion"
                                        className="block w-full md:w-auto  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-y-5 xl:justify-between gap-x-10 sm:items-center">
                                <label
                                    htmlFor="ReleasedDate"
                                    className="text-base font-semibold text-gray-900 w-28"
                                >
                                    Released Date:
                                </label>
                                <div className="items-center">
                                    <input
                                        required
                                        type="date"
                                        name="ReleasedDate"
                                        id="ReleasedDate"
                                        className="block md:w-auto  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div> */}
                        <div>
                            <div className="mt-2.5 flex flex-col md:flex-row md:items-center gap-x-10">
                                <label
                                    htmlFor="attachment"
                                    className="text-base font-semibold text-gray-900 w-28"
                                >
                                    Logo:
                                </label>
                                
                                   {application?.AppPic?<p className="text-dark font-semibold">Existing logo :{application.AppPic},want to change it?</p>:null}
                                <div className="flex ">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="text-dark w-8 h-auto"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                                        />
                                    </svg>

                                    <input
                                        required={application?.AppPic? false:true}
                                        // defaultValue={application?application.AppPic:""}
                                        type="file"
                                        accept=".png"
                                        id="attachment"
                                        name="attachment"
                                        onChange={handleFileChange}
                                        className="text-sm text-gray-500 focus:outline-none w-40 sm:w-auto
                                        file:mr-5 file:py-3 file:px-2
                                        file:rounded-full file:border-0
                                        file:text-md file:font-semibold  file:text-blue-500
                                        file:bg-white
                                        hover:file:cursor-pointer "
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex  py-3 flex-row gap-x-10 gap-y-5 md:items-center">
                            <label className="text-base font-semibold text-gray-900 w-28">
                                Status:
                            </label>

                            <div>
                                <fieldset className="">
                                    <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                        {statuses.map((status) => (
                                            <div
                                                key={status.id}
                                                className="flex items-center"
                                            >
                                                <input
                                                    id={status.id}
                                                    name="notification-method"
                                                    type="radio"
                                                    value={status.id} // Step 3: Use the status ID as the value
                                                    checked={
                                                        parseInt(
                                                            selectedStatus
                                                        ) === status.id
                                                    } // Optionally set checked if it matches the selected value
                                                    onChange={
                                                        handleStatusChange
                                                    } // Step 4: Attach the event handler
                                                    className="h-4 w-4 border-gray-300 text-green-600 focus:ring-goldt"
                                                />
                                                <label
                                                    htmlFor={status.id}
                                                    className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                                                >
                                                    {status.title}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="flex py-3 flex-col xl:flex-row gap-x-10 gap-y-5 justify-start">
                            <ColorPicker setColor={setPrimary} color={primary} />
                            <ColorPicker setColor={setSecondary} color={secondary} />
                        </div>
                        <div className="flex flex-col py-3 md:flex-row gap-x-10 gap-y-5 ">
                            <label
                                htmlFor="comment"
                                className="text-base font-semibold text-gray-900 w-28"
                            >
                                Description:
                            </label>
                            <div className="mt-2 w-full">
                                <textarea
                                    rows={4}
                                    name="comment"
                                    defaultValue={application?application.AppDesc:""}
                                    id="description"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-x-5 justify-end">
                    <GtamButton
                            name={
                                    "Cancel"
                                    }
                                    onClick={() => {
                                        setActiveIndex(3)
                                    }}
                            className={""}
                        />
                        <GtamButton
                            name={
                                isLoading ? (
                                    <div className=" inset-0 flex justify-center items-center bg-opacity-50">
                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-smooth"></div>
                                    </div>
                                ) :
                                application?"Save":
                                (
                                    "Create"
                                )
                            }
                            disabled={isLoading}
                            className={""}
                            type={"submit"}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
