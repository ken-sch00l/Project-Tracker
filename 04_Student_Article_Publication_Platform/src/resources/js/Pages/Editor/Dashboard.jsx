import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react'

export default function Dashboard({ pending = [], needsRevision = [] }) {

    return (

        <AuthenticatedLayout
            header={<h2 className="text-4xl font-serif">Editor Dashboard</h2>}
        >

            <Head title="Editor Dashboard" />

            <div className="max-w-6xl mx-auto px-12 pb-20">

                {/* COUNTERS */}

                <div className="grid md:grid-cols-2 gap-6 mb-14">

                    <StatCard title="Pending Reviews" value={pending.length}/>
                    <StatCard title="Needs Revision" value={needsRevision.length}/>

                </div>

                {/* PENDING */}

                <h3 className="text-2xl font-serif mb-6">
                    Pending Articles
                </h3>

                <div className="grid md:grid-cols-3 gap-8 mb-14">

                    {pending.map(article => (

                        <ArticleCard key={article.id} article={article}/>

                    ))}

                </div>

                {/* REVISION */}

                <h3 className="text-2xl font-serif mb-6">
                    Needs Revision
                </h3>

                <div className="grid md:grid-cols-3 gap-8">

                    {needsRevision.map(article => (

                        <ArticleCard key={article.id} article={article}/>

                    ))}

                </div>

            </div>

        </AuthenticatedLayout>
    )
}

function ArticleCard({article}){

    return(

        <div className="bg-white border rounded-xl p-8">

            <h4 className="font-semibold mb-2">
                {article.title}
            </h4>

            <p className="text-sm text-gray-500 mb-4">
                {article.writer?.name}
            </p>

            <Link
                href={route('editor.articles.review', article.id)}
                className="bg-[#0F172A] text-white px-4 py-2 rounded text-sm"
            >
                Review
            </Link>

        </div>

    )
}

function StatCard({title,value}){

    return(
        <div className="bg-white border rounded-xl p-6 text-center">
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-3xl font-semibold">{value}</p>
        </div>
    )
}