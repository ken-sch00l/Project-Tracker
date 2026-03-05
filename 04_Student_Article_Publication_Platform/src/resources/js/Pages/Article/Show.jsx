import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, usePage } from '@inertiajs/react'

export default function Show({ article }) {

const { auth } = usePage().props
const user = auth.user

const isStudent = user?.roles?.some(role => role.name === "student")

const { data, setData, post, reset } = useForm({
    content: ""
})

const submitComment = (e) => {
    e.preventDefault()

    post(route('student.articles.comment', article.id), {
        onSuccess: () => reset()
    })
}

return (

    <AuthenticatedLayout
        header={<h2 className="text-4xl font-serif">Article</h2>}
    >

        <Head title={article.title} />

        <div className="max-w-7xl mx-auto px-12 pb-20">

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


            {/* COMMENTS (STUDENT ONLY) */}

            {isStudent && (

                <div className="border-t pt-10 mt-16">

                    <h3 className="text-2xl font-serif mb-6">
                        Comments
                    </h3>

                    <form onSubmit={submitComment} className="mb-8">

                        <textarea
                            className="w-full border rounded-lg p-4 mb-4"
                            rows="4"
                            placeholder="Write a comment..."
                            value={data.content}
                            onChange={(e)=>setData("content",e.target.value)}
                        />

                        <button
                            type="submit"
                            className="bg-[#0F172A] text-white px-6 py-3 rounded-md hover:bg-[#1E293B]"
                        >
                            Post Comment
                        </button>

                    </form>

                    {article.comments?.map(comment => (

                        <div key={comment.id} className="border-b py-4">

                            <p className="text-sm text-gray-600 mb-2">
                                {comment.student?.name}
                            </p>

                            <p className="text-gray-800">
                                {comment.content}
                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>

    </AuthenticatedLayout>

)


}
