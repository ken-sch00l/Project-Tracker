import ApplicationLogo from '@/Components/ApplicationLogo'
import { Link, usePage, router } from '@inertiajs/react'
import { useState } from 'react'

export default function AuthenticatedLayout({ header, children }) {

const { auth } = usePage().props
const user = auth.user
const role = user.roles?.[0]?.name

const notifications = user.unread_notifications || []
const [open, setOpen] = useState(false)

const markAsRead = (id, url) => {

    router.post(route('notifications.read', id), {}, {
        preserveScroll: true,
        onSuccess: () => {
            if (url) window.location.href = url
        }
    })

}

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

                <div className="flex items-center gap-6 text-sm relative">

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

                    {/* NOTIFICATION BELL */}

                    <div className="relative">

                        <button
                            onClick={() => setOpen(!open)}
                            className="relative hover:text-[#C6A75E]"
                        >
                            🔔

                            {notifications.length > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {notifications.length}
                                </span>
                            )}

                        </button>

                        {open && (

                            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">

                                <div className="p-4 border-b text-sm font-semibold">
                                    Notifications
                                </div>

                                {notifications.length === 0 && (

                                    <div className="p-4 text-sm text-gray-500">
                                        No new notifications
                                    </div>

                                )}

                                {notifications.map(notification => (

                                    <div
                                        key={notification.id}
                                        className="p-4 border-b text-sm hover:bg-gray-50 cursor-pointer"
                                        onClick={() => markAsRead(notification.id, notification.data.url)}
                                    >

                                        {notification.data.message}

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

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