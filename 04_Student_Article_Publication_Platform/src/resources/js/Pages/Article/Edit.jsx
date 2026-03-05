import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import JoditEditor from 'jodit-react'

export default function Edit({ article }) {

    const [content, setContent] = useState(article.content)

    const save = () => {
        router.post(route('writer.articles.revise', article.id), {
            content: content
        })
    }

    return (

        <AuthenticatedLayout
            header={<h2 className="text-4xl font-serif">Edit Article</h2>}
        >

            <Head title="Edit Article" />

            <div className="max-w-4xl mx-auto px-12 pb-20">

                <div className="mb-8">

                    <h3 className="text-2xl font-serif mb-2">
                        {article.title}
                    </h3>

                    <p className="text-gray-600">
                        Revise your article before submitting again.
                    </p>

                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-8">

                    <JoditEditor
                        value={content}
                        onBlur={(newContent)=>setContent(newContent)}
                    />

                    <div className="mt-6 flex gap-4">

                        <button
                            onClick={save}
                            className="bg-[#0F172A] text-white px-6 py-3 rounded-md hover:bg-[#1E293B] transition"
                        >
                            Save Changes
                        </button>

                        <button
                            onClick={() => history.back()}
                            className="border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>

    )
}