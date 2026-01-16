// app/blog/[slug]/page.js
export default async function BlogPost({ params }) {
    const { slug } = await params;
    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h1>Blog Post</h1>

            {/* We display the variable from the URL here */}
            <p>Currently viewing post ID: <strong>{slug}</strong></p>
        </div>
    );
}