import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react'

export default function Dashboard({ articles = [] }) {

    const StatCard = ({title,value}) => (

        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition">
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-3xl font-semibold">{value}</p>
        </div>

    )

    const Badge = ({status}) => {

        const styles = {
            published: "bg-green-100 text-green-700 border-green-200"
        }

        return(
            <span className={`text-xs px-3 py-1 rounded-full border ${styles[status]}`}>
                {status}
            </span>
        )
    }

    return (

        <AuthenticatedLayout
            header={<h2 className="text-4xl font-serif">Student Dashboard</h2>}
        >

            <Head title="Student Dashboard" />

            <div className="max-w-6xl mx-auto px-12 pb-20">

                {/* COUNTER */}

                <div className="grid md:grid-cols-1 gap-6 mb-14">

                    <StatCard
                        title="Published Articles"
                        value={articles.length}
                    />

                </div>

                {/* ARTICLES */}

                {articles.length === 0 ? (

                    <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500">
                        No published articles available.
                    </div>

                ) : (

                    <div className="grid md:grid-cols-3 gap-8">

                        {articles.map(article => (

                            <div
                                key={article.id}
                                className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition"
                            >

                                <h3 className="text-lg font-semibold mb-2">
                                    {article.title}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {article.writer?.name}
                                </p>

                                <p className="text-sm text-gray-400 mb-4">
                                    {article.category?.name}
                                </p>

                                <Badge status={article.status?.name}/>

                                <div className="mt-6">

                                    <Link
                                        href={route('articles.show', article.id)}
                                        className="bg-[#0F172A] text-white px-4 py-2 rounded-md text-sm hover:bg-[#1E293B]"
                                    >
                                        Read Article
                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </AuthenticatedLayout>
    )
}