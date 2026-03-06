import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'

import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
)

export default function Dashboard({ pending = [], needsRevision = [], stats = {} }) {

    const workflowData = {
        labels: ["Pending", "Needs Revision", "Published"],
        datasets: [
            {
                data: [
                    stats.pending_reviews ?? 0,
                    stats.needs_revision ?? 0,
                    stats.published_articles ?? 0
                ],
                backgroundColor: [
                    "#2563EB",
                    "#EA580C",
                    "#16A34A"
                ]
            }
        ]
    }

    const reviewBarData = {
        labels: ["Pending", "Needs Revision", "Published", "Reviewed by You"],
        datasets: [
            {
                label: "Articles",
                data: [
                    stats.pending_reviews ?? 0,
                    stats.needs_revision ?? 0,
                    stats.published_articles ?? 0,
                    stats.articles_reviewed ?? 0
                ],
                backgroundColor: "#0F172A"
            }
        ]
    }

    const barOptions = {
        maintainAspectRatio:false,
        plugins:{legend:{display:false}}
    }

    return (

        <AuthenticatedLayout
            header={<h2 className="text-4xl font-serif">Editor Dashboard</h2>}
        >

            <Head title="Editor Dashboard" />

            <div className="max-w-7xl mx-auto px-12 pb-20">

                {/* STATISTICS */}

                <div className="grid md:grid-cols-4 gap-6 mb-14">

                    <StatCard
                        value={stats.pending_reviews ?? 0}
                        label="Pending Reviews"
                        color="#2563EB"
                    />

                    <StatCard
                        value={stats.needs_revision ?? 0}
                        label="Needs Revision"
                        color="#EA580C"
                    />

                    <StatCard
                        value={stats.published_articles ?? 0}
                        label="Published"
                        color="#16A34A"
                    />

                    <StatCard
                        value={stats.articles_reviewed ?? 0}
                        label="Reviewed by You"
                        color="#0F172A"
                    />

                </div>


                {/* ANALYTICS */}

                <div className="grid md:grid-cols-2 gap-8 mb-14">

                    {/* WORKFLOW PIE */}

                    <div className="bg-white border rounded-xl p-8">

                        <h3 className="text-xl font-serif mb-4">
                            Workflow Distribution
                        </h3>

                        <div className="flex justify-center" style={{height:"220px"}}>

                            <div style={{width:"200px"}}>
                                <Doughnut data={workflowData}/>
                            </div>

                        </div>

                    </div>


                    {/* REVIEW ACTIVITY */}

                    <div className="bg-white border rounded-xl p-8">

                        <h3 className="text-xl font-serif mb-4">
                            Article Workflow Overview
                        </h3>

                        <div style={{height:"220px"}}>

                            <Bar
                                data={reviewBarData}
                                options={barOptions}
                            />

                        </div>

                    </div>

                </div>


                {/* PENDING ARTICLES */}

                <h3 className="text-2xl font-serif mb-6">
                    Pending Articles
                </h3>

                <div className="grid md:grid-cols-3 gap-8 mb-14">

                    {pending.map(article => (

                        <ArticleCard key={article.id} article={article}/>

                    ))}

                </div>


                {/* NEEDS REVISION */}

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

        <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition">

            <h4 className="font-semibold mb-2">
                {article.title}
            </h4>

            <p className="text-sm text-gray-500 mb-4">
                {article.writer?.name}
            </p>

            <Link
                href={route('editor.articles.review', article.id)}
                className="bg-[#0F172A] text-white px-4 py-2 rounded text-sm hover:bg-[#1E293B]"
            >
                Review
            </Link>

        </div>

    )

}



function StatCard({ value, label, color }) {

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