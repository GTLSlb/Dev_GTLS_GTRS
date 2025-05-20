import { useEffect, useState } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import AnimatedLoading from "@/Components/AnimatedLoading";

export default function Customers({ Token, currentUser }) {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const gtamUrl = window.Laravel.gtamUrl;
    const fetchDeliveryReport = () => {
        axios
            .get(`${gtamUrl}Customers`, {
                headers: {
                    UserId: currentUser.UserId,
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((res) => {
                const x = JSON.stringify(res.data);
                const parsedDataPromise = new Promise((resolve, reject) => {
                    const parsedData = JSON.parse(x);
                    resolve(parsedData);
                });
                parsedDataPromise.then((parsedData) => {
                    setLoading(false);
                    setAccounts(parsedData || []);
                });
            })
            .catch((err) => {
                setLoading(false);
                if (err.response && err.response.status === 401) {
                    // Handle 401 error using SweetAlert
                    swal({
                        title: "Session Expired!",
                        text: "Please login again",
                        type: "success",
                        icon: "info",
                        confirmButtonText: "OK",
                    }).then(function () {
                        axios
                            .post("/logoutAPI")
                            .then((response) => {
                                if (response.status == 200) {
                                    window.location.href = "/";
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    });
                } else {
                    // Handle other errors
                    console.log(err);
                }
            });
    };
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchDeliveryReport();
    }, []);

    // const accounts = [
    //     {
    //         id: 1,
    //         name: "Account Alpha",
    //         description: "Alpha account for management.",
    //     },
    //     {
    //         id: 2,
    //         name: "Account Beta",
    //         description: "Beta account for invoicing.",
    //     },
    //     {
    //         id: 3,
    //         name: "Account Gamma",
    //         description: "Gamma account for sales.",
    //     },
    //     {
    //         id: 4,
    //         name: "Account Delta",
    //         description: "Delta account for operations.",
    //     },
    // ];

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const renderCustomerCard = (account) => (
        <Card
            key={account.CustomerId}
            shadow="md"
            radius="lg"
            isHoverable
            isPressable
            onPress={() => {
                navigate("/gtrs/customer-profile", {
                    state: {
                        CustomerId: account.CustomerId,
                    },
                });
            }}
        >
            <CardHeader className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-gray-500" />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-lg text-start font-medium text-gray-900">
                        {account.CustomerName}
                    </h2>
                    <p className="text-sm text-gray-500">{account.Email}</p>
                </div>
            </CardHeader>
        </Card>
    );

    const renderAccountsTab = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map(renderCustomerCard)}
        </div>
    );

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-4xl font-bold mb-4">Customers</h1>

            <div className="mt-4">
                {loading ? (
                    <AnimatedLoading />
                ) : (
                    renderAccountsTab()
                )}
            </div>
        </div>
    );
}
