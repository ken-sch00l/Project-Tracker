import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, usePage, router } from '@inertiajs/react'

import DeleteUserForm from './Partials/DeleteUserForm'
import UpdatePasswordForm from './Partials/UpdatePasswordForm'
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm'

export default function Edit({ mustVerifyEmail, status }) {

    const { auth } = usePage().props

    // safer role detection
    const role = auth?.user?.roles?.length
        ? auth.user.roles[0].name
        : null

    const dashboardRoute = role === 'writer'
        ? 'writer.dashboard'
        : role === 'editor'
        ? 'editor.dashboard'
        : role === 'student'
        ? 'student.dashboard'
        : null

    const dashboardLabel = role === 'writer'
        ? 'Writer Dashboard'
        : role === 'editor'
        ? 'Editor Dashboard'
        : role === 'student'
        ? 'Student Dashboard'
        : 'Home'

    const goBack = () => {

        if (dashboardRoute) {

            router.visit(route(dashboardRoute))

        } else {

            router.visit('/')

        }

    }

    return (

        <AuthenticatedLayout
            header={
                <h2 className="text-3xl font-serif">
                    Profile
                </h2>
            }
        >

            <Head title="Profile" />

            <div className="max-w-7xl mx-auto px-10 pb-20">

                {/* BACK BUTTON */}

                <button
                    onClick={goBack}
                    className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
                >
                    ← Back to {dashboardLabel}
                </button>

                <div className="space-y-10">

                    {/* PROFILE INFO */}

                    <div className="p-6 bg-white border border-gray-200 rounded-xl">

                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="p-6 bg-white border border-gray-200 rounded-xl">

                        <UpdatePasswordForm
                            className="max-w-xl"
                        />

                    </div>


                    {/* DELETE ACCOUNT */}

                    <div className="p-6 bg-white border border-gray-200 rounded-xl">

                        <DeleteUserForm
                            className="max-w-xl"
                        />

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>

    )
}