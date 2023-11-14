import React, { Component } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

class ContactForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            message: "",
            phone: "",
            attachment: null,
            errors: {},
            recaptchaValue: false,
        };
    }

    handleRecaptchaChange = (value) => {
        this.setState({ recaptchaValue: true });
    };

    handleRecaptchaExpired = () => {
        this.setState({ recaptchaValue: false });
    };


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
        formData.append("name", this.state.name);
        formData.append("email", this.state.email);
        formData.append("message", this.state.message);
        formData.append("phone", this.state.phone);
        formData.append("attachment", this.state.attachment);

        axios
            .post("/contact", formData)
            .then((response) => {
                this.setState({
                    name: "",
                    email: "",
                    message: "",
                    phone: "",
                    attachment: null,
                    errors: {},
                    isLoading: false,
                    success: response.status === 200,
                });
            })
            .catch((error) => {
                this.setState({
                    errors: error.response.data.errors,
                    isLoading: false,
                });
            });
    };

    render() {
        const { errors, previewUrl } = this.state;
        const { isLoading, success } = this.state;
        const { recaptchaValue } = this.state;

        return (
            <div>
                {/* {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center  bg-opacity-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-100"></div>
        </div>
      )} */}

                {success && (
                    <div
                        className="bg-goldt border border-goldd text-dark px-4 py-3 rounded relative mb-4"
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
                <div className=" flex flex-col border-4 border-goldt rounded-3xl">
                    <div className="p-5">
                        <div className="p-2">
                            <h2 className="text-4xl font-bold tracking-tight text-white">
                                Application form
                            </h2>
                        </div>
                        <form
                            onSubmit={this.handleSubmit}
                            encType="multipart/form-data"
                            className="w-full p-5 flex flex-col gap-y-3"
                        >
                            <div className=" relative group mt-2.5 border-b border-goldt">
                                <input
                                    required
                                    autoComplete="off"
                                    type="text"
                                    id="name"
                                    name="name"
                                    onChange={this.handleChange}
                                    value={this.state.name}
                                    className="w-full h-10 px-4 text-sm text-white peer appearance-none bg-transparent outline-none border-dark focus:outline-0 form-input"
                                />
                                <label
                                    htmlFor="name"
                                    className="text-white transform transition-all absolute top-0 left-0 h-full flex items-center pl-2 text-sm group-focus-within:text-xs peer-valid:text-xs group-focus-within:h-1/2 peer-valid:h-1/2 group-focus-within:-translate-y-full peer-valid:-translate-y-full group-focus-within:pl-0 peer-valid:pl-0"
                                >
                                    Full name
                                </label>
                                {errors.name && (
                                    <div className="error text-goldt">
                                        {errors.name[0]}
                                    </div>
                                )}
                            </div>

                            <div className=" relative group mt-2.5 border-b border-goldt">
                                <input
                                    required
                                    autoComplete="off"
                                    type="text"
                                    id="email"
                                    name="email"
                                    onChange={this.handleChange}
                                    value={this.state.email}
                                    className="w-full h-10 px-4 text-sm text-white peer appearance-none bg-transparent outline-none border-dark focus:outline-0 form-input"
                                />
                                <label
                                    htmlFor="Email"
                                    className="text-white transform transition-all absolute top-0 left-0 h-full flex items-center pl-2 text-sm group-focus-within:text-xs peer-valid:text-xs group-focus-within:h-1/2 peer-valid:h-1/2 group-focus-within:-translate-y-full peer-valid:-translate-y-full group-focus-within:pl-0 peer-valid:pl-0"
                                >
                                    Email
                                </label>
                                {errors.email && (
                                    <div className="error text-goldt">
                                        {errors.email[0]}
                                    </div>
                                )}
                            </div>
                            <div className=" relative group mt-2.5 border-b border-goldt">
                                <input
                                    required
                                    autoComplete="off"
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    onChange={this.handleChange}
                                    value={this.state.phone}
                                    className="w-full h-10 px-4 text-sm text-white peer appearance-none bg-transparent outline-none border-dark focus:outline-0 form-input"
                                />
                                <label
                                    htmlFor="Phone"
                                    className="text-white transform transition-all absolute top-0 left-0 h-full flex items-center pl-2 text-sm group-focus-within:text-xs peer-valid:text-xs group-focus-within:h-1/2 peer-valid:h-1/2 group-focus-within:-translate-y-full peer-valid:-translate-y-full group-focus-within:pl-0 peer-valid:pl-0"
                                >
                                    Phone
                                </label>
                                {errors.phone && (
                                    <div className="error text-goldt">
                                        {errors.phone[0]}
                                    </div>
                                )}
                            </div>

                            {/* <div className="mt-2.5 border-b border-goldt">
                                <input
                                    required
                                    autoComplete="off"
                                    placeholder="Phone"
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    onChange={this.handleChange}
                                    value={this.state.phone}
                                    className="bg-transparent appearance-none block w-full rounded-md border-none py-2 px-3.5 text-gray-100 shadow-sm  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-goldt sm:text-sm sm:leading-6"
                                />
                                {errors.phone && (
                                    <div className="error">
                                        {errors.phone[0]}
                                    </div>
                                )}
                            </div> */}

                            <div className="mt-2.5  border-goldt">
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-semibold leading-6 text-white"
                                >
                                    Message
                                </label>
                                <div className="border rounded border-goldt">
                                    <textarea
                                        required
                                        id="message"
                                        name="message"
                                        onChange={this.handleChange}
                                        value={this.state.message}
                                        className="h-24  appearance-none text-gray-100 placeholder:text-gray-300 bg-transparent border-none w-full text-gray-200 mr-3 py-1 px-2 leading-tight focus:outline-goldt"
                                    />
                                </div>
                                {errors.message && (
                                    <div className="error">
                                        {errors.message[0]}
                                    </div>
                                )}
                            </div>

                            <div className="mt-2.5 ">
                                <label
                                    htmlFor="attachment"
                                    className="block text-sm font-semibold leading-6 text-gray-400"
                                >
                                    Attachment (PDF only)
                                </label>
                                <div className="flex">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="text-white w-8 h-auto"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                                        />
                                    </svg>

                                    <input
                                        required
                                        type="file"
                                        accept=".pdf"
                                        id="attachment"
                                        name="attachment"
                                        onChange={this.handleFileChange}
                                        className="text-sm text-goldt focus:outline-none
                                file:mr-5 file:py-3 file:px-2
                                file:rounded-full file:border-0
                                file:text-md file:font-semibold  file:text-goldd
                                file:bg-dark
                                hover:file:cursor-pointer "
                                    />
                                </div>
                            </div>
                            <ReCAPTCHA
                                sitekey="6Lf30MEmAAAAAA4_iPf9gTM1VMNO9iSFKyaAC1P0"
                                onChange={this.handleRecaptchaChange}
                                onExpired={this.handleRecaptchaExpired}
                                className="mt-0 flex justify-center"
                            size="normal" // Set the desired size here: "compact", "normal", or "invisible"
                            render="explicit" // Use "explicit" rendering
                            theme="dark" // Set the desired theme: "light" or "dark"
                            style={{ transform: 'scale(0.8)' }} // Use CSS transform to adjust the size
                            />
                            <button
                                type="submit"
                                disabled={!recaptchaValue || isLoading}
                                className="mt-10 block w-full sm:w-4/12 rounded-3xl bg-gradient-to-r from-goldl to-goldd hover:from-goldd hover:to-goldl px-3.5 py-2.5 text-center text-sm font-semibold text-dark shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldt"
                            >
                                {isLoading ? (
                                    <div className=" inset-0 flex justify-center items-center bg-opacity-50">
                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-dark"></div>
                                    </div>
                                ) : (
                                    "Submit"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContactForm;
