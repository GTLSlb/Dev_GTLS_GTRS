import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />
            <div className="mt-1 mb-2">
                            <a
                                href="/login"
                                className="text-white hover:text-goldd flex items-center"
                            >
                                <svg
                                    viewBox="0 0 64 64"
                                    fill="currentColor"
                                    height="1.3em"
                                    width="1.3em"
                                >
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinejoin="bevel"
                                        strokeMiterlimit={10}
                                        strokeWidth={2}
                                        d="M32.936 48.936l-17-17 17-17"
                                    />
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinejoin="bevel"
                                        strokeMiterlimit={10}
                                        strokeWidth={2}
                                        d="M47.936 48.936l-17-17 17-17"
                                    />
                                </svg>{" "}
                                Back to login
                            </a>
                        </div>
            <div className="mb-4 text-sm text-white">
                Forgot your password? No problem. Just let us know your email address and we will email you a password
                reset link that will allow you to choose a new one.
            </div>

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={onHandleChange}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="flex w-full justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" disabled={processing}>
                        Email Password Reset Link
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
