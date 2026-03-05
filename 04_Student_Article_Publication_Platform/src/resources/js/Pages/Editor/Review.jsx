import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'

export default function Review({ article }) {

    const [comments, setComments] = useState("")

    const requestRevision = () => {
        router.post(route('editor.articles.requestRevision', article.id), {
            comments
        })
    }

    const publish = () => {
        router.post(route('editor.articles.publish', article.id))
    }

    return (

        <AuthenticatedLayout
            header={<h2 className="text-4xl font-serif">Editor Review</h2>}
        >

            <Head title="Review Article" />

            <div className="max-w-7xl mx-auto px-12 pb-20">

                <div className="grid grid-cols-3 gap-10">

                    {/* ARTICLE SECTION */}

                    <div className="col-span-2">

                        {/* ARTICLE HEADER */}

                        <div className="mb-8">

                            <h1 className="text-3xl font-serif mb-2">
                                {article.title}
                            </h1>

                            <p className="text-gray-500 text-sm">
                                {article.writer?.name} • {article.category?.name}
                            </p>

                        </div>

                        {/* ARTICLE CARD */}

                        <div className="bg-white border border-gray-200 rounded-xl p-10 overflow-hidden">

                            <div
                                className="prose prose-lg max-w-none break-words"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />

                        </div>

                    </div>


                    {/* EDITOR PANEL */}

                    <div className="bg-white border border-gray-200 rounded-xl p-6 h-fit sticky top-10">

                        <h3 className="text-lg font-semibold mb-4">
                            Editorial Actions
                        </h3>

                        <textarea
                            value={comments}
                            onChange={(e)=>setComments(e.target.value)}
                            placeholder="Explain what needs revision..."
                            className="w-full border border-gray-300 rounded-md p-3 mb-6"
                            rows="6"
                        />

                        <div className="flex flex-col gap-3">

                            <button
                                onClick={requestRevision}
                                className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md transition"
                            >
                                Request Revision
                            </button>

                            <button
                                onClick={publish}
                                className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition"
                            >
                                Publish Article
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>

    )
}