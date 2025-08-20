import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import caretDown from '../images/icon-caret-down.svg'


export default function Transactions() {
    //gather query params
    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sorted');
    const [open, setOpen] = React.useState(false);
    const [openSort, setOpenSort] = React.useState(false);
    const categoryRef = React.useRef(null)
    const sortRef = React.useRef(null);
    const [selectedCategoryName, setSelectedCategoryName] = React.useState("All Transactions")
    const [selectedSortedName, setSelectedSortedName] = React.useState("Latest")

    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (open == true && !categoryRef.current.contains(e.target)) {
                setOpen(false)
            }
            if (sortRef.current && !sortRef.current.contains(e.target)) setOpenSort(false);
        }
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [open])

    //handle filter change
    function handleFilterChange(key, value) {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (value === null) {
                next.delete(key)
            }
            else {
                next.set(key, value)
            }
            return next;
        })
    }
    //data
    const [data, setData] = React.useState(null)
    React.useEffect(() => {
        fetch('/data.json')
            .then(res => res.json())
            .then(data => setData(data))
    }, [])
    //check if data is null
    if (!data) return <p>Loading…</p>

    //format with sign display
    const formatterSign = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
        signDisplay: 'always'
    });

    //transactions data
    const transactions = data.transactions

    //filtered Transactions
    const filteredTrans = category ? transactions.filter(ele => ele.category.toLowerCase() === category.toLowerCase()) : transactions

    //sorted Transactions
    const sortedTrans = sortBy ?
        () => {
            if (sortBy === "") {
                return [...filteredTrans].sort((a, b) =>
                    new Date(b.date) - new Date(a.date));
            }
            if (sortBy === "Oldest") {
                return [...filteredTrans].sort((a, b) =>
                    new Date(a.date) - new Date(b.date));
            }
            if (sortBy === "A to Z") {
                return [...filteredTrans].sort((a, b) =>
                    a.name.localeCompare(b.name));
            }
            if (sortBy === "Z to A") {
                return [...filteredTrans].sort((a, b) =>
                    b.name.localeCompare(a.name));
            }
            if (sortBy === "Highest") {
                return [...filteredTrans].sort((a, b) =>
                    b.amount - a.amount
                )
            }
            if (sortBy === "Lowest") {
                return [...filteredTrans].sort((a, b) =>
                    a.amount - b.amount
                )
            }

        } : () => [...filteredTrans].sort((a, b) =>
                    new Date(b.date) - new Date(a.date));

    //display graph element
    const transEle = sortedTrans().map((ele) => {
        return (
            <>
                <hr className='border-gray-200 h-2 w-full mx-auto' />
                <div className='inline-flex items-center justify-between my-3 mx-2 relative' >
                    {/** Left*/}
                    <div className='inline-flex items-center '>
                        <img src={ele.avatar} className='w-10 rounded-full' />
                        <span className='ml-5 text-base font-bold'>{ele.name}</span>
                    </div>
                    {/** Center*/}
                    <div className='absolute justify-center items-center flex left-[38%] gap-10'>
                        <div className='text-xs font-light text-gray-500 w-31'>
                            {ele.category}
                        </div>
                        <div className='text-xs font-light text-gray-500 '>{new Date(ele.date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}</div>
                    </div>
                    {/** Right*/}
                    <div className='flex flex-col items-end'>
                        <h1
                            className={ele.amount >= 0 ? "text-base text-[#277C78]" : "text-base"}
                        >{formatterSign.format(ele.amount)}</h1>
                    </div>
                </div>
            </>
        )
    })

    // list of categories
    const categoryList = ["Entertainment", "Bills", "Groceries", "Dining Out", "Transportation", "Personal Care", "Education", "Lifestyle", "Shopping", "General"]

    //make the categories dropdown
    const categoryDrop =
        <>
            <div ref={categoryRef} className=' relative border border-black rounded-lg w-44 min-h-11 flex items-center justify-between px-5 cursor-pointer' onClick={() => setOpen((prevOpen) => !prevOpen)} >
                <span className='text-sm'
                >{selectedCategoryName}</span>
                <img src={caretDown}
                    alt='Caret Down Icon'
                    className='mt-1.5 ml-4 w-3 h-3 inline-block mb-1' />
            </div>
            {open &&
                <div className='absolute flex flex-col mt-3 bg-white rounded-lg shadow-lg w-44 z-100 max-h-75 overflow-y-auto'>
                    <button className='flex text-base w-44 min-h-11 flex items-center justify-start cursor-pointer color-gray-700 text-start ml-5 text-sm font-bold'
                        onClick={() => {
                            handleFilterChange("category", "");
                            setOpen(o => !o);
                            setSelectedCategoryName("All Transactions")
                        }}>All Transactions</button>
                    <hr className='border-gray-100 h-2 w-4/5 mx-auto' />
                    {
                        categoryList.map(ele => {
                            const line = ele !== "General" ? true : false;
                            return (
                                <>
                                    <button className='flex text-base w-44 min-h-11 flex items-center justify-start cursor-pointer color-gray-700 text-start ml-5 text-sm'
                                        onClick={() => {
                                            handleFilterChange("category", `${ele}`);
                                            setOpen(o => !o);
                                            setSelectedCategoryName(`${ele}`)
                                        }}
                                    >{ele}</button>
                                    {line && <hr className='border-gray-100 h-2 w-4/5 mx-auto' />}
                                </>
                            )
                        })
                    }
                </div>}
        </>
    //list of sorted items
    const sortedList = ["Oldest", "A to Z", "Z to A", "Highest", "Lowest"]

    //make the sorted dropdown
    const sortedDrop = <>
            <div ref={sortRef} className=' relative border border-black rounded-lg w-28 min-h-11 flex items-center justify-between px-5 cursor-pointer' onClick={() => setOpenSort((prevOpen) => !prevOpen)} >
                <span className='text-sm'
                >{selectedSortedName}</span>
                <img src={caretDown}
                    alt='Caret Down Icon'
                    className='mt-1.5 ml-4 w-3 h-3 inline-block mb-1' />
            </div>
            {openSort &&
                <div className='absolute flex flex-col mt-3 bg-white rounded-lg shadow-lg max-w-28 z-100 max-h-75 overflow-y-auto text-right'>
                    <button className='flex text-base w-44 min-h-11 flex items-center justify-start cursor-pointer color-gray-700 text-start ml-5 text-sm font-bold'
                        onClick={() => {
                            handleFilterChange("sorted", "");
                            setOpenSort(o => !o);
                            setSelectedSortedName("Latest")
                        }}>Latest</button>
                    <hr className='border-gray-100 h-2 w-4/5 mx-auto' />
                    {
                        sortedList.map(ele => {
                            const line = ele !== "Lowest" ? true : false;
                            return (
                                <>
                                    <button className='flex text-base w-44 min-h-11 flex items-center justify-start cursor-pointer color-gray-700 text-start ml-5 text-sm'
                                        onClick={() => {
                                            handleFilterChange("sorted", `${ele}`);
                                            setOpenSort(o => !o);
                                            setSelectedSortedName(`${ele}`)
                                        }}
                                    >{ele}</button>
                                    {line && <hr className='border-gray-100 h-2 w-4/5 mx-auto' />}
                                </>
                            )
                        })
                    }
                </div>}
        </>
    return (
        <>
            <main className='flex flex-col mx-10 mt-5 pb-10 w-full ml-10 min-h-screen'>
                <h1 className='text-3xl mt-5 font-bold text-gray-900'>Transactions</h1>
                <div className='bg-white shadow p-10 rounded-lg mt-10'>
                    {/**Dropdown*/}
                    <div className='flex justify-end gap-2 items-center'>
                        <div className='text-sm text-gray-500'>
                            Sort By
                        </div>
                        <div>
                            {sortedDrop}
                        </div>
                        <div className='text-sm text-gray-500 ml-5'>
                            Category
                        </div>
                        <div>
                            {categoryDrop}
                        </div>
                    </div>
                    {/**graph title */}
                    <div className='flex text-xs text-gray-500 justify-between mt-8 mb-3 mx-2'>
                        <div>
                            <span>Recipient / Sender</span>
                        </div>
                        <div>
                            <span className='mr-13'>Category</span>
                            <span className='ml-13'>Transaction Date</span>
                        </div>
                        <div>
                            <span className='text-left'>Amount</span>
                        </div>
                    </div>
                    {/**graph*/}
                    <div className='flex flex-col'>
                        {transEle}
                    </div>
                </div>
            </main>
        </>
    )
}