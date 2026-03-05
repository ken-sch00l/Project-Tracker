import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react'

export default function Dashboard({
    articles = [],
    stats = {},
    popularArticles = [],
    activity = []
}) {

    const submitArticle = (id) => {
        router.post(`/writer/articles/${id}/submit`)
    }

    const maxActivity = Math.max(...activity.map(a => a.total), 1)

    return (

        <AuthenticatedLayout
            header={<h2 className="text-4xl font-serif">Writer Dashboard</h2>}
        >

            <Head title="Writer Dashboard" />

            <div className="max-w-6xl mx-auto px-12 pb-20">

                {/* STATISTICS */}

                <div className="grid md:grid-cols-4 gap-6 mb-16">

                    <StatCard title="Total Articles" value={stats.total_articles || 0}/>
                    <StatCard title="Drafts" value={stats.drafts || 0}/>
                    <StatCard title="Submitted" value={stats.submitted || 0}/>
                    <StatCard title="Published" value={stats.published || 0}/>

                </div>

                {/* WRITING ACTIVITY */}

                <div className="mb-16">

                    <h3 className="text-2xl font-serif mb-6">
                        Writing Activity
                    </h3>

                    <div className="bg-white border rounded-xl p-8 space-y-6">

                        {activity.length === 0 ? (

                            <p className="text-gray-500">
                                No activity data yet.
                            </p>

                        ) : (

                            activity.map(item => {

                                const width = (item.total / maxActivity) * 100

                                return (

                                    <div key={item.month}>

                                        <div className="flex justify-between mb-2">

                                            <span>
                                                {item.month}
                                            </span>

                                            <span className="text-sm text-gray-500">
                                                {item.total} articles
                                            </span>

                                        </div>

                                        <div className="w-full bg-gray-200 rounded-full h-2">

                                            <div
                                                className="bg-[#0F172A] h-2 rounded-full"
                                                style={{ width: `${width}%` }}
                                            />

                                        </div>

                                    </div>

                                )

                            })

                        )}

                    </div>

                </div>


                {/* MOST ENGAGING ARTICLES */}

                <div className="mb-16">

                    <h3 className="text-2xl font-serif mb-6">
                        Most Engaging Articles
                    </h3>

                    {popularArticles.length === 0 ? (

                        <div className="bg-white border rounded-xl p-8 text-gray-500">
                            No engagement data yet.
                        </div>

                    ) : (

                        <div className="bg-white border rounded-xl p-8 space-y-6">

                            {popularArticles.map((article,index) => (

                                <div key={article.id}>

                                    <div className="flex justify-between mb-2">

                                        <span className="font-medium">
                                            #{index + 1} {article.title}
                                        </span>

                                        <span className="text-sm text-gray-500">
                                            {article.comments_count} comments
                                        </span>

                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-2">

                                        <div
                                            className="bg-[#0F172A] h-2 rounded-full"
                                            style={{
                                                width: `${Math.min(article.comments_count * 25, 100)}%`
                                            }}
                                        />

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>


                {/* ARTICLE MANAGEMENT */}

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
                        className="bg-[#0F172A] text-white px-7 py-3 rounded-md hover:bg-[#1E293B]"
                    >
                        Create Article
                    </Link>

                </div>


                <div className="grid md:grid-cols-3 gap-10">

                    {articles.map(article => {

                        const status = article.status?.name

                        return (

                            <div
                                key={article.id}
                                className="bg-white p-8 rounded-xl border hover:shadow-lg transition"
                            >

                                <h4 className="text-xl font-semibold mb-2">
                                    {article.title}
                                </h4>

                                <p className="text-sm text-gray-500 mb-4">
                                    {article.category?.name}
                                </p>

                                <div className="flex flex-wrap gap-3">

                                    <Link
                                        href={`/articles/${article.id}`}
                                        className="text-sm px-4 py-2 border rounded-md"
                                    >
                                        View
                                    </Link>

                                    {(status === "draft" || status === "needs_revision") && (

                                        <Link
                                            href={`/articles/${article.id}/edit`}
                                            className="text-sm px-4 py-2 bg-blue-500 text-white rounded-md"
                                        >
                                            Edit
                                        </Link>

                                    )}

                                    {status === "draft" && (

                                        <button
                                            onClick={() => submitArticle(article.id)}
                                            className="text-sm px-4 py-2 bg-green-600 text-white rounded-md"
                                        >
                                            Submit
                                        </button>

                                    )}

                                </div>

                            </div>

                        )

                    })}

                </div>

            </div>

        </AuthenticatedLayout>

    )
}


function StatCard({ title, value }) {

    const percent = Math.min(value * 10, 100)

    return (

        <div className="bg-white border rounded-xl p-6 flex flex-col items-center">

            <div className="relative w-20 h-20 mb-3">

                <svg className="w-20 h-20 transform -rotate-90">

                    <circle cx="40" cy="40" r="34" stroke="#e5e7eb" strokeWidth="6" fill="none"/>

                    <circle
                        cx="40"
                        cy="40"
                        r="34"
                        stroke="#0F172A"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray="214"
                        strokeDashoffset={214 - (214 * percent) / 100}
                        style={{ transition: "stroke-dashoffset 1s ease" }}
                    />

                </svg>

                <div className="absolute inset-0 flex items-center justify-center font-semibold">
                    {value}
                </div>

            </div>

            <p className="text-sm text-gray-500">{title}</p>

        </div>

    )
}