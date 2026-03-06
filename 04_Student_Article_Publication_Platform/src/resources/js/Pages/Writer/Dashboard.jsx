import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'

import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
)

export default function Dashboard({
    articles = [],
    stats = {},
    popularArticles = [],
    activity = [],
    categoryStats = []
}) {

    const submitArticle = (id) => {
        router.post(`/writer/articles/${id}/submit`)
    }

    const activitySafe = activity ?? []
    const popularSafe = popularArticles ?? []
    const categorySafe = categoryStats ?? []

    const truncate = (text, length = 25) => {
        if (!text) return ""
        return text.length > length
            ? text.substring(0, length) + "..."
            : text
    }

    /*
    ---------------------------
    Writing Activity Chart
    ---------------------------
    */

    const activityChartData = {
        labels: activitySafe.map(a => a.month),
        datasets: [
            {
                label: "Articles",
                data: activitySafe.map(a => a.total),
                borderColor: "#0F172A",
                backgroundColor: "rgba(15,23,42,0.12)",
                fill: true,
                tension: 0.4
            }
        ]
    }

    const activityOptions = {
        maintainAspectRatio:false,
        animation:{duration:1000}
    }

    /*
    ---------------------------
    Status Chart
    ---------------------------
    */

    const statusData = {
        labels:["Drafts","Submitted","Published"],
        datasets:[
            {
                data:[
                    stats.drafts || 0,
                    stats.submitted || 0,
                    stats.published || 0
                ],
                backgroundColor:[
                    "#94A3B8",
                    "#3B82F6",
                    "#16A34A"
                ]
            }
        ]
    }

    /*
    ---------------------------
    Engagement Chart
    ---------------------------
    */

    const engagementData = {
        labels: popularSafe.map(a => truncate(a.title)),
        datasets:[
            {
                label:"Comments",
                data: popularSafe.map(a => a.comments_count),
                backgroundColor:"#0F172A"
            }
        ]
    }

    const engagementOptions = {
        indexAxis:"y",
        maintainAspectRatio:false,
        plugins:{legend:{display:false}},
        scales:{x:{ticks:{precision:0}}}
    }

    /*
    ---------------------------
    Category Chart
    ---------------------------
    */

    const categoryData = {
        labels: categorySafe.map(c => c.category),
        datasets:[
            {
                data: categorySafe.map(c => c.total),
                backgroundColor:[
                    "#0F172A",
                    "#3B82F6",
                    "#16A34A",
                    "#F59E0B",
                    "#8B5CF6"
                ]
            }
        ]
    }

    return (

        <AuthenticatedLayout
            header={<h2 className="text-4xl font-serif">Writer Dashboard</h2>}
        >

            <Head title="Writer Dashboard" />

            <div className="max-w-7xl mx-auto px-12 pb-20">

                {/* STATISTICS */}

                <div className="grid md:grid-cols-4 gap-6 mb-14">

                    <StatCard title="Total Articles" value={stats.total_articles || 0}/>
                    <StatCard title="Drafts" value={stats.drafts || 0}/>
                    <StatCard title="Submitted" value={stats.submitted || 0}/>
                    <StatCard title="Published" value={stats.published || 0}/>

                </div>


                {/* WRITING ACTIVITY */}

                <div className="bg-white border rounded-xl p-8 mb-14">

                    <h3 className="text-2xl font-serif mb-6">
                        Writing Activity
                    </h3>

                    <div style={{height:"260px"}}>

                        <Line
                            data={activityChartData}
                            options={activityOptions}
                        />

                    </div>

                </div>


                {/* ANALYTICS */}

                <div className="grid md:grid-cols-3 gap-8 mb-14">

                    {/* STATUS */}

                    <div className="bg-white border rounded-xl p-6">

                        <h3 className="font-serif text-lg mb-4">
                            Article Status
                        </h3>

                        <div className="flex justify-center items-center" style={{height:"220px"}}>

                            <div style={{width:"180px"}}>
                                <Doughnut data={statusData}/>
                            </div>

                        </div>

                    </div>


                    {/* CATEGORY */}

                    <div className="bg-white border rounded-xl p-6">

                        <h3 className="font-serif text-lg mb-4">
                            Articles by Category
                        </h3>

                        <div className="flex justify-center items-center" style={{height:"220px"}}>

                            <div style={{width:"180px"}}>
                                <Pie data={categoryData}/>
                            </div>

                        </div>

                    </div>


                    {/* ENGAGEMENT */}

                    <div className="bg-white border rounded-xl p-6">

                        <h3 className="font-serif text-lg mb-4">
                            Engagement
                        </h3>

                        <div style={{height:"200px"}}>

                            {popularSafe.length === 0
                                ? <p className="text-gray-500">No engagement data yet.</p>
                                : <Bar data={engagementData} options={engagementOptions}/>
                            }

                        </div>

                    </div>

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


                {/* ARTICLE GRID */}

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


/*
--------------------------------
STAT CARD
--------------------------------
*/

function StatCard({ title, value }) {

    const percent = Math.min(value * 10, 100)

    return (

        <div className="bg-white border rounded-xl p-6 flex flex-col items-center">

            <div className="relative w-20 h-20 mb-3">

                <svg className="w-20 h-20 transform -rotate-90">

                    <circle
                        cx="40"
                        cy="40"
                        r="34"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                        fill="none"
                    />

                    <defs>

                        <linearGradient id="grad1">

                            <stop offset="0%" stopColor="#0F172A"/>
                            <stop offset="100%" stopColor="#3B82F6"/>

                        </linearGradient>

                    </defs>

                    <circle
                        cx="40"
                        cy="40"
                        r="34"
                        stroke="url(#grad1)"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray="214"
                        strokeDashoffset={214 - (214 * percent) / 100}
                        style={{transition:"stroke-dashoffset 1s ease"}}
                    />

                </svg>

                <div className="absolute inset-0 flex items-center justify-center font-semibold text-lg">

                    {value}

                </div>

            </div>

            <p className="text-sm text-gray-500">{title}</p>

        </div>

    )

}