import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'
import JoditEditor from "jodit-react"
import { useRef } from "react"

export default function CreateArticle({ categories = [] }) {

    const editor = useRef(null)

    const { data, setData, post, processing } = useForm({
        title: "",
        content: "",
        category_id: ""
    })

    const submit = (e) => {
        e.preventDefault()
        post(route("writer.articles.store"))
    }

    return (

        <AuthenticatedLayout
            header={<h2 className="text-3xl font-serif">Create Article</h2>}
        >

            <Head title="Create Article" />

            <div className="max-w-5xl mx-auto px-12 py-12">

                <form onSubmit={submit} className="space-y-6">

                    <input
                        type="text"
                        placeholder="Article Title"
                        className="w-full border rounded-lg px-4 py-3"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                    />

                    <select
                        className="w-full border rounded-lg px-4 py-3"
                        value={data.category_id}
                        onChange={(e) => setData("category_id", e.target.value)}
                    >

                        <option value="">Select Category</option>

                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}

                    </select>

                    <JoditEditor
                        ref={editor}
                        value={data.content}
                        onBlur={(newContent) => setData("content", newContent)}
                    />

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-[#0F172A] text-white px-8 py-3 rounded-md"
                    >
                        Save Article
                    </button>

                </form>

            </div>

        </AuthenticatedLayout>
    )
}