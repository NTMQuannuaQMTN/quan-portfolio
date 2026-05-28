"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
    Plus,
    Pencil,
    Trash2,
    X,
} from "lucide-react";

export default function AdminPage() {
    const [loading, setLoading] = useState(true);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [link, setLink] = useState("");
    const [published, setPublished] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [blogs, setBlogs] = useState<any[]>([]);

    const [showModal, setShowModal] =
        useState(false);

    const [editingId, setEditingId] =
        useState<string | null>(null);

    useEffect(() => {
        checkUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
            checkUser();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (authorized) {
            fetchBlogs();
        }
    }, [authorized]);

    const checkUser = async () => {
        setLoading(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (
            user &&
            user.email ===
            process.env.NEXT_PUBLIC_ADMIN_EMAIL
        ) {
            setAuthorized(true);
        } else {
            setAuthorized(false);
        }

        setLoading(false);
    };

    const fetchBlogs = async () => {
        const { data } = await supabase
            .from("blogs")
            .select("*")
            .order("published", {
                ascending: false,
            });

        if (data) {
            setBlogs(data);
        }
    };

    const login = async () => {
        if (
            email !==
            process.env.NEXT_PUBLIC_ADMIN_EMAIL
        ) {
            alert("You are not authorized.");
            return;
        }

        const { error } =
            await supabase.auth.signInWithOtp({
                email,
            });

        if (error) {
            alert(error.message);
        } else {
            setOtpSent(true);
            alert("OTP has been sent.");
        }
    };

    const verifyOtp = async () => {
        const { error } =
            await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: "email",
            });

        if (error) {
            alert(error.message);
        } else {
            setAuthorized(true);
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();

        setAuthorized(false);
    };

    const createOrUpdateBlog = async () => {
        if (!title || !link) {
            alert("Please fill all fields.");
            return;
        }

        let error;

        if (editingId) {
            const response = await supabase
                .from("blogs")
                .update({
                    title,
                    image,
                    link,
                })
                .eq("id", editingId);

            error = response.error;
        } else {
            const response = await supabase
                .from("blogs")
                .insert([
                    {
                        title,
                        image,
                        link,
                        published,
                    },
                ]);

            error = response.error;
        }

        if (error) {
            alert(error.message);
            return;
        }

        setTitle("");
        setImage("");
        setLink("");
        setPublished(
            new Date().toISOString().split("T")[0]
        );

        setEditingId(null);

        setShowModal(false);

        fetchBlogs();
    };

    const deleteBlog = async (id: string) => {
        const confirmed = confirm(
            "Delete this blog?"
        );

        if (!confirmed) return;

        await supabase
            .from("blogs")
            .delete()
            .eq("id", id);

        fetchBlogs();
    };

    const editBlog = (blog: any) => {
        setEditingId(blog.id);

        setTitle(blog.title);
        setImage(blog.image);
        setLink(blog.link);
        setPublished(blog.published);

        setShowModal(true);
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-black text-white">
                Loading...
            </main>
        );
    }

    if (!authorized) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-black px-6">
                <div className="w-full max-w-md space-y-6">
                    <div>
                        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-red-500">
                            Admin
                        </p>

                        <h1 className="text-5xl font-semibold tracking-[-0.05em] text-white">
                            Login
                        </h1>
                    </div>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter admin email"
                        className="w-full border border-white/10 bg-white/5 p-4 text-white outline-none"
                    />

                    {!otpSent ? (
                        <button
                            onClick={login}
                            className="w-full bg-red-500 p-4 font-medium text-white"
                        >
                            Send OTP
                        </button>
                    ) : (
                        <>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) =>
                                    setOtp(e.target.value)
                                }
                                placeholder="Enter OTP"
                                className="w-full border border-white/10 bg-white/5 p-4 text-white outline-none"
                            />

                            <button
                                onClick={verifyOtp}
                                className="w-full bg-red-500 p-4 font-medium text-white"
                            >
                                Verify OTP
                            </button>
                        </>
                    )}
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black px-6 py-20 text-white">
            <div className="mx-auto max-w-6xl">
                {/* HEADER */}
                <div className="mb-20 flex items-center justify-between">
                    <div>
                        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-red-500">
                            Admin Panel
                        </p>

                        <h1 className="text-6xl font-semibold tracking-[-0.06em]">
                            Blogs
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={logout}
                            className="border border-white/10 px-5 py-3 text-sm uppercase tracking-[0.2em] text-white/70"
                        >
                            Logout
                        </button>

                        <button
                            onClick={() => {
                                setEditingId(null);

                                setTitle("");
                                setImage("");
                                setLink("");

                                setPublished(
                                    new Date().toISOString().split("T")[0]
                                );

                                setShowModal(true);
                            }}
                            className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500"
                        >
                            <Plus size={24} />
                        </button>
                    </div>
                </div>

                {/* BLOGS */}
                <div className="space-y-20">
                    {blogs.map((blog, index) => (
                        <div
                            key={blog.id}
                            className={`grid items-center gap-12 lg:grid-cols-2 ${index % 2 === 1
                                ? "lg:[&>*:first-child]:order-2"
                                : ""
                                }`}
                        >
                            {/* IMAGE */}
                            {blog.image ? <div className="overflow-hidden rounded-3xl">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="h-[420px] w-full object-cover"
                                />
                            </div> : <div className="overflow-hidden rounded-3xl">
                                <div className="flex h-[420px] w-full items-center justify-center bg-white/5 text-sm text-white/50">
                                    No Image
                                </div>
                            </div>}

                            {/* CONTENT */}
                            <div>
                                <p className="mb-5 text-sm uppercase tracking-[0.3em] text-red-500">
                                    {blog.published}
                                </p>

                                <h2 className="text-5xl font-semibold leading-[1.05] tracking-[-0.05em]">
                                    {blog.title}
                                </h2>

                                <a
                                    href={blog.link}
                                    target="_blank"
                                    className="mt-8 block text-lg text-white/60"
                                >
                                    Open Post →
                                </a>

                                <div className="mt-10 flex items-center gap-4">
                                    <button
                                        onClick={() =>
                                            editBlog(blog)
                                        }
                                        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5"
                                    >
                                        <Pencil
                                            size={18}
                                        />
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteBlog(
                                                blog.id
                                            )
                                        }
                                        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5"
                                    >
                                        <Trash2
                                            size={18}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6 backdrop-blur-xl">
                    <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0b0b0b] p-10">
                        <div className="mb-10 flex items-center justify-between">
                            <div>
                                <p className="mb-2 text-sm uppercase tracking-[0.3em] text-red-500">
                                    Blog
                                </p>

                                <h2 className="text-4xl font-semibold tracking-[-0.05em]">
                                    {editingId
                                        ? "Edit Post"
                                        : "Create Post"}
                                </h2>
                            </div>

                            <button
                                onClick={() =>
                                    setShowModal(false)
                                }
                            >
                                <X size={28} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <input
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                                placeholder="Title"
                                className="w-full border border-white/10 bg-white/5 p-4 outline-none"
                            />

                            <input
                                value={image}
                                onChange={(e) =>
                                    setImage(
                                        e.target.value
                                    )
                                }
                                placeholder="Image URL"
                                className="w-full border border-white/10 bg-white/5 p-4 outline-none"
                            />

                            <input
                                value={link}
                                onChange={(e) =>
                                    setLink(
                                        e.target.value
                                    )
                                }
                                placeholder="Post Link"
                                className="w-full border border-white/10 bg-white/5 p-4 outline-none"
                            />

                            <input
                                type="date"
                                value={published}
                                onChange={(e) =>
                                    setPublished(e.target.value)
                                }
                                className="w-full border border-white/10 bg-white/5 p-4 outline-none"
                            />

                            {image && (
                                <img
                                    src={image}
                                    alt="Preview"
                                    className="h-64 w-full rounded-2xl object-cover"
                                />
                            )}

                            <button
                                onClick={
                                    createOrUpdateBlog
                                }
                                className="w-full bg-red-500 p-4 font-medium text-white"
                            >
                                {editingId
                                    ? "Update Post"
                                    : "Publish Post"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}