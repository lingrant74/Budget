import React from "react"
import { Link } from "react-router-dom"

export default function NotFound() {
    return (
        <>
            <div className="min-h-screen gap-10 flex flex-col p-10">
                <h1 className="text-3xl font-black"
                >Sorry, the page you were looking for was not found.</h1>
                <button className="rounded-lg bg-gray-900 text-white h-20 text-2xl cursor-pointer ">
                    <Link to="/">Return to Home</Link>
                </button>
            </div>
        </>
    )
}
