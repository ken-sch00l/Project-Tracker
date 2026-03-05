import ApplicationLogo from '@/Components/ApplicationLogo'
import { Link, usePage } from '@inertiajs/react'

export default function AuthenticatedLayout({ header, children }) {

const { auth } = usePage().props
const user = auth.user
const role = user.roles?.[0]?.name

return (

    <div className="min-h-screen bg-[#F8F6F1]">

        {/* NAVBAR */}

        <nav className="border-b border-gray-200 bg-white">

            <div className="max-w-7xl mx-auto px-12 py-6 flex justify-between items-center">

                {/* LEFT SIDE */}

                <Link
                    href="/"
                    className="flex items-center gap-4"
                >
                    <ApplicationLogo className="h-8" />
                </Link>

                {/* RIGHT SIDE */}

                <div className="flex items-center gap-6 text-sm">

                    {role === "writer" && (
                        <Link
                            href={route('writer.dashboard')}
                            className="hover:text-[#C6A75E]"
                        >
                            Writer Dashboard
                        </Link>
                    )}

                    {role === "editor" && (
                        <Link
                            href={route('editor.dashboard')}
                            className="hover:text-[#C6A75E]"
                        >
                            Editor Dashboard
                        </Link>
                    )}

                    {role === "student" && (
                        <Link
                            href={route('student.dashboard')}
                            className="hover:text-[#C6A75E]"
                        >
                            Student Dashboard
                        </Link>
                    )}

                    <Link
                        href={route('profile.edit')}
                        className="hover:text-[#C6A75E]"
                    >
                        Profile
                    </Link>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="hover:text-red-500"
                    >
                        Logout
                    </Link>

                </div>

            </div>

        </nav>

        {/* PAGE HEADER */}

        {header && (

            <header className="max-w-7xl mx-auto px-12 py-10">

                <div className="flex items-center justify-between">

                    {header}

                </div>

            </header>

        )}

        {/* PAGE CONTENT */}

        <main>
            {children}
        </main>

    </div>

)


}
