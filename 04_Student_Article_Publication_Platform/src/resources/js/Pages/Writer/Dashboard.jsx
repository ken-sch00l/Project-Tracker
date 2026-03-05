import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react'

export default function Dashboard({ articles = [], stats = {} }) {

    const submitArticle = (id) => {
        router.post(`/writer/articles/${id}/submit`)
    }

    const StatCard = ({ value, label, color }) => {

        const radius = 36
        const circumference = 2 * Math.PI * radius
        const progress = Math.min(value * 10, 100)
        const offset = circumference - (progress / 100) * circumference

        return (

            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition">

                <div className="relative w-24 h-24 mb-3">

                    <svg className="w-24 h-24 transform -rotate-90">

                        <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            stroke="#E5E7EB"
                            strokeWidth="8"
                            fill="none"
                        />

                        <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            stroke={color}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                        />

                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold">
                        {value}
                    </div>

                </div>

                <p className="text-sm text-gray-500">{label}</p>

            </div>

        )
    }

    return (

        <AuthenticatedLayout
            header={
                <h2 className="text-4xl font-serif">
                    Writer Dashboard
                </h2>
            }
        >

            <Head title="Writer Dashboard" />

            <div className="max-w-6xl mx-auto px-12 pb-20">

                {/* STATISTICS */}

                <div className="grid md:grid-cols-5 gap-6 mb-14">

                    <StatCard
                        value={stats.total_articles ?? 0}
                        label="Articles"
                        color="#0F172A"
                    />

                    <StatCard
                        value={stats.drafts ?? 0}
                        label="Drafts"
                        color="#6B7280"
                    />

                    <StatCard
                        value={stats.submitted ?? 0}
                        label="Submitted"
                        color="#2563EB"
                    />

                    <StatCard
                        value={stats.published ?? 0}
                        label="Published"
                        color="#16A34A"
                    />

                    <StatCard
                        value={stats.comments ?? 0}
                        label="Comments"
                        color="#C6A75E"
                    />

                </div>


                {/* HEADER */}

                <div className="flex justify-between items-center mb-12">

                    <div>

                        <h3 className="text-3xl font-serif mb-3">
                            Manage Your Articles
                        </h3>

                        <p className="text-gray-600">
                            Draft, submit, and revise your publications.
                        </p>

                    </div>

                    <Link
                        href={route('writer.articles.create')}
                        className="bg-[#0F172A] text-white px-7 py-3 rounded-md hover:bg-[#1E293B] transition shadow-sm hover:shadow-md"
                    >
                        Create Article
                    </Link>

                </div>


                {/* EMPTY STATE */}

                {articles.length === 0 ? (

                    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">

                        <p className="text-gray-600 text-lg">
                            You have no articles yet. Start writing your first article.
                        </p>

                    </div>

                ) : (

                    <div className="grid md:grid-cols-3 gap-10">

                        {articles.map(article => {

                            const status = article.status?.name

                            return (

                                <div
                                    key={article.id}
                                    className="bg-white p-8 rounded-xl border border-gray-200 hover:-translate-y-1 hover:shadow-lg transition"
                                >

                                    <h4 className="text-xl font-semibold mb-2">
                                        {article.title}
                                    </h4>

                                    <p className="text-sm text-gray-500 mb-4">
                                        {article.category?.name}
                                    </p>

                                    <div className="mb-6">

                                        {status === "draft" && (
                                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                                                Draft
                                            </span>
                                        )}

                                        {status === "submitted" && (
                                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-600">
                                                Submitted
                                            </span>
                                        )}

                                        {status === "needs_revision" && (
                                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-orange-100 text-orange-600">
                                                Needs Revision
                                            </span>
                                        )}

                                        {status === "published" && (
                                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-600">
                                                Published
                                            </span>
                                        )}

                                    </div>

                                    <div className="flex flex-wrap gap-3">

                                        <Link
                                            href={`/articles/${article.id}`}
                                            className="text-sm px-4 py-2 border rounded-md hover:bg-gray-50"
                                        >
                                            View
                                        </Link>

                                        {(status === "draft" || status === "needs_revision") && (

                                            <Link
                                                href={`/articles/${article.id}/edit`}
                                                className="text-sm px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                            >
                                                Edit
                                            </Link>

                                        )}

                                        {status === "draft" && (

                                            <button
                                                onClick={() => submitArticle(article.id)}
                                                className="text-sm px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                            >
                                                Submit
                                            </button>

                                        )}

                                        {status === "needs_revision" && (

                                            <button
                                                onClick={() => submitArticle(article.id)}
                                                className="text-sm px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                            >
                                                Resubmit
                                            </button>

                                        )}

                                    </div>

                                </div>

                            )

                        })}

                    </div>

                )}

            </div>

        </AuthenticatedLayout>

    )
}