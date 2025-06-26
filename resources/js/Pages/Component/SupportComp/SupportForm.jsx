import React, { Component } from "react";
import axios from "axios";

class SupportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subject: "",
            name: "",
            email: "",
            message: "",
            attachment: null,
            errors: {},
        };
    }

    handleDrop = (acceptedFiles) => {
        // check if the file is a PDF
        const pdfType = ["application/pdf"];
        if (acceptedFiles[0].type && !pdfType.includes(acceptedFiles[0].type)) {
            this.setState({
                errors: {
                    attachment: ["Only PDF files are allowed."],
                },
            });
            return;
        }

        // set the state with the uploaded file
        this.setState({
            attachment: acceptedFiles[0],
            errors: {
                attachment: null,
            },
        });

        // create a preview of the uploaded file
        const reader = new FileReader();
        reader.onload = (e) => {
            this.setState({
                previewUrl: e.target.result,
            });
        };
        reader.readAsDataURL(acceptedFiles[0]);
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleFileChange = (e) => {
        this.setState({ attachment: e.target.files[0] });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ isLoading: true });

        const formData = new FormData();
        formData.append("subject", this.state.subject);
        formData.append("name", this.state.name);
        formData.append("email", this.state.email);
        formData.append("message", this.state.message);
        formData.append("attachment", this.state.attachment);
        axios
            .post("/support", formData)
            .then((response) => {
                this.formRef.reset();
                this.setState({
                    subject: "",
                    name: "",
                    email: "",
                    message: "",
                    attachment: null,
                    errors: {},
                    isLoading: false,
                    success: response.status === 200,
                });
            })
            .catch((error) => {
                console.log(error.response);
                this.setState({
                    errors: error.response.data.errors,
                    isLoading: false,
                });
            });
    };

    render() {
        const { errors } = this.state;
        const { isLoading, success } = this.state;

        return (
            <div>
                {success && (
                    <div
                        className="bg-goldt border border-goldd text-dark px-4 py-3 rounded relative mb-4 z-50"
                        role="alert"
                    >
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline">
                            Your message has been sent.
                        </span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                            <svg
                                onClick={() =>
                                    this.setState({ success: false })
                                }
                                className="fill-current h-6 w-6 text-dark cursor-pointer"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 1024 1024"
                                fill="currentColor"
                            >
                                <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />{" "}
                            </svg>
                        </span>
                    </div>
                )}

                <form
                ref={(ref) => (this.formRef = ref)}
                    onSubmit={this.handleSubmit}
                    encType="multipart/form-data"
                >
                    <div className="space-y-12 pr-2 z-50">
                        <div className="border-b border-gray-900/10 pb-12">
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label
                                        htmlFor="subject"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Subject
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            required
                                            autoComplete="off"
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            onChange={this.handleChange}
                                            value={this.state.subject}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 input-field"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-3">
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Name
                                    </label>
                                    <div className="mt-2 ">
                                        <input
                                            required
                                            autoComplete="off"
                                            type="text"
                                            id="name"
                                            name="name"
                                            onChange={this.handleChange}
                                            value={this.state.name}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 input-field"
                                        />
                                        {errors?.name && (
                                            <div className="error text-goldt">
                                                {errors?.name[0]}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="sm:col-span-6">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            required
                                            autoComplete="off"
                                            type="text"
                                            id="email"
                                            name="email"
                                            onChange={this.handleChange}
                                            value={this.state.email}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 input-field"
                                        />
                                        {errors?.email && (
                                            <div className="error text-goldt">
                                                {errors?.email[0]}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="col-span-full">
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Message
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            required
                                            id="message"
                                            name="message"
                                            onChange={this.handleChange}
                                            value={this.state.message}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-goldd sm:text-sm sm:leading-6"
                                            defaultValue={""}
                                        />
                                        {errors?.message && (
                                            <div className="error">
                                                {errors?.message[0]}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <div className="mt-2.5 ">
                                        <label
                                            htmlFor="attachment"
                                            className="block text-sm font-semibold leading-6 text-gray-400"
                                        >
                                            Attachment
                                        </label>
                                        <div className="flex">
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
                                                type="file"
                                                id="attachment"
                                                name="attachment"
                                                onChange={this.handleFileChange}
                                                className="text-sm text-dark focus:outline-none
                                                        file:mr-5 file:ml-5 file:py-2 file:px-10
                                                        file:rounded-full file:border-0
                                                        file:text-md file:font-semibold  file:text-smooth
                                                        file:bg-dark
                                                        hover:file:cursor-pointer "
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className=" block w-full sm:w-4/12 rounded-3xl bg-dark px-3.5 py-2.5 text-center text-sm font-semibold text-smooth shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldt"
                        >
                            {isLoading ? (
                                <div className=" inset-0 flex justify-center items-center bg-opacity-50">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-smooth"></div>
                                </div>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default SupportForm;
