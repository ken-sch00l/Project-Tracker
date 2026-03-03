import { Link } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenNib, faBookOpen, faUsers } from '@fortawesome/free-solid-svg-icons'

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-[#F8F6F1] text-[#0F172A] antialiased">

            <nav className="flex justify-between items-center px-12 py-8 max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold tracking-wide">
                    PublishHub
                </h1>

                <div className="space-x-8 text-sm font-medium">
                    {auth?.user ? (
                        <Link href="/dashboard" className="hover:text-[#C6A75E] transition duration-200">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-[#C6A75E] transition duration-200">
                                Log In
                            </Link>
                            <Link
                                href="/register"
                                className="bg-[#0F172A] text-white px-6 py-2.5 rounded-md hover:bg-[#1E293B] transition duration-300"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <section className="px-12 pt-28 pb-36 text-center max-w-4xl mx-auto animate-fadeUp">
                <h2 className="text-5xl md:text-6xl font-serif leading-tight mb-8">
                    Publish Your Ideas. <br className="hidden md:block" />
                    Share Your Voice.
                </h2>

                <p className="text-lg md:text-xl text-gray-700 mb-12 leading-relaxed">
                    A structured editorial platform for student writers, editors, and readers.
                    Draft, review, revise, and publish with clarity and purpose.
                </p>

                {!auth?.user && (
                    <div className="flex justify-center gap-6 flex-wrap">
                        <Link
                            href="/register"
                            className="bg-[#0F172A] text-white px-8 py-3 rounded-md text-lg hover:bg-[#1E293B] transition duration-300 shadow-sm hover:shadow-md"
                        >
                            Start Publishing
                        </Link>

                        <Link
                            href="/login"
                            className="border border-[#0F172A] px-8 py-3 rounded-md text-lg hover:bg-[#0F172A] hover:text-white transition duration-300"
                        >
                            Log In
                        </Link>
                    </div>
                )}
            </section>

            <div className="border-t border-gray-200 max-w-6xl mx-auto"></div>

            <section className="grid md:grid-cols-3 gap-12 px-12 py-24 max-w-6xl mx-auto">

                <div className="bg-white p-10 rounded-xl border border-gray-200 text-center transition duration-300 hover:-translate-y-2 hover:shadow-lg animate-fadeUp">
                    <FontAwesomeIcon icon={faPenNib} className="text-3xl mb-6 text-[#C6A75E]" />
                    <h3 className="text-xl font-semibold mb-4">Write & Submit</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Create structured drafts, revise content, and submit articles
                        through a guided editorial workflow.
                    </p>
                </div>

                <div className="bg-white p-10 rounded-xl border border-gray-200 text-center transition duration-300 hover:-translate-y-2 hover:shadow-lg animate-fadeUp">
                    <FontAwesomeIcon icon={faUsers} className="text-3xl mb-6 text-[#C6A75E]" />
                    <h3 className="text-xl font-semibold mb-4">Editorial Review</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Editors evaluate submissions, request revisions,
                        and approve content with clear status transitions.
                    </p>
                </div>

                <div className="bg-white p-10 rounded-xl border border-gray-200 text-center transition duration-300 hover:-translate-y-2 hover:shadow-lg animate-fadeUp">
                    <FontAwesomeIcon icon={faBookOpen} className="text-3xl mb-6 text-[#C6A75E]" />
                    <h3 className="text-xl font-semibold mb-4">Publish & Showcase</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Approved articles are published and organized
                        for academic and creative communities.
                    </p>
                </div>

            </section>
        </div>
    )
}