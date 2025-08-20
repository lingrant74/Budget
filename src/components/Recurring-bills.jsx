import React from 'react'
import recurringBills from '../images/icon-recurring-bills.svg'
import { Link, useSearchParams } from 'react-router-dom'
import caretDown from '../images/icon-caret-down.svg'
import paidIcon from '../images/icon-bill-paid.svg'
import upcomingIcon from '../images/icon-bill-due.svg'

export default function RecurringBills() {
    const [searchParams, setSearchParams] = useSearchParams();
    const sortBy = searchParams.get('sorted');
    const [openSort, setOpenSort] = React.useState(false);
    const sortRef = React.useRef(null);
    const [selectedSortedName, setSelectedSortedName] = React.useState("Latest")
    const today = new Date();
    const dayOfMonth = today.getDate();


    console.log(today)
    //format with sign display
    const formatterSign = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
        signDisplay: 'never'
    });

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
    //handle making dropbox disappear
    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (sortRef.current && !sortRef.current.contains(e.target)) setOpenSort(false);
        }
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [])

    //data
    const [data, setData] = React.useState(null)
    React.useEffect(() => {
        fetch('/data.json')
            .then(res => res.json())
            .then(data => setData(data))
    }, [])
    //check if data is null
    if (!data) return <p>Loading…</p>

    const color = (dateString) => {
        const billDay = new Date(dateString).getDate();
        if (dayOfMonth - billDay > 0) {
            return (
                <div className='flex'>
                    <div className='text-sm text-[#277C78] w-10 mr-20 whitespace-nowrap'>
                        {`Monthly-${billDay}`}
                    </div>
                    <div className='w-5'>
                        <img src={paidIcon} alt="Paid Icon" className='w-4' />
                    </div>
                </div>
            )
        }

        if (dayOfMonth - billDay <= 0 && dayOfMonth - billDay > -5) {
            return (
                <div className='flex'>
                    <div className='text-sm text-red-400 w-10 mr-20 whitespace-nowrap'>
                        Monthly-{billDay}
                    </div>
                    <div className='w-5'>
                        <img src={upcomingIcon} alt="Upcoming Icon" className='w-4' />
                    </div>
                </div>
            )
        }
        if (dayOfMonth + 3 > 30 && billDay < 3) {
            return (
                <div className='flex'>
                    <div className='text-sm text-red-400 w-10 mr-20 whitespace-nowrap'>
                        Monthly-{billDay}
                    </div>
                    <div className='w-5'>
                        <img src={upcomingIcon} alt="Upcoming Icon" className='w-4' />
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className='text-sm w-10 mr-20 color-gray-100 whitespace-nowrap'>
                    Monthly-{billDay}
                </div>
            )
        }
    }
    //Recurring Data
    const recurringBillsData = data.transactions.filter(ele => ele.recurring === true)

    function bDay(dateStr) {
        return new Date(dateStr).getDate(); // returns 1–31
    }

    //Filter Sorted Data
    const sortedBills = sortBy ?
        () => {
            if (sortBy === "Latest") {
                return [...recurringBillsData].sort((a, b) =>
                    bDay(a.date) - bDay(b.date));
            }
            if (sortBy === "Oldest") {
                return [...recurringBillsData].sort((a, b) =>
                    bDay(b.date) - bDay(a.date));
            }
            if (sortBy === "A to Z") {
                return [...recurringBillsData].sort((a, b) =>
                    a.name.localeCompare(b.name));
            }
            if (sortBy === "Z to A") {
                return [...recurringBillsData].sort((a, b) =>
                    b.name.localeCompare(a.name));
            }
            if (sortBy === "Lowest") {
                return [...recurringBillsData].sort((a, b) =>
                    b.amount - a.amount
                )
            }
            if (sortBy === "Highest") {
                return [...recurringBillsData].sort((a, b) =>
                    a.amount - b.amount
                )
            }

            return [...recurringBillsData].sort((a, b) =>
                    bDay(a.date) - bDay(b.date));


        } : () =>  [...recurringBillsData].sort((a, b) =>
                    bDay(a.date) - bDay(b.date));

    //display graph element
    const recurrEle = sortedBills().map((ele) => {
        return (
            <>
                <hr className='border-gray-200 h-2 w-full mx-auto' />
                <div className='inline-flex items-center justify-between my-3 mx-2 relative w-full pr-5' >
                    {/** Left*/}
                    <div className='inline-flex items-center w-80 '>
                        <img src={ele.avatar} className='w-10 rounded-full' />
                        <span className='ml-5 text-base font-bold'>{ele.name}</span>
                    </div>
                    {/** Center*/}
                    <div className=' w-30 mr-20 flex'>
                        {color(ele.date)}
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

    //list of sorted items
    const sortedList = ["Oldest", "A to Z", "Z to A", "Highest", "Lowest"]

    //make the sorted dropdown
    const sortedDrop = <>
        <div ref={sortRef} className="relative">
            <div className=' relative border border-black rounded-lg w-28 min-h-11 flex items-center justify-between px-5 cursor-pointer' onClick={() => setOpenSort((prevOpen) => !prevOpen)} >
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
        </div>
    </>
    return (
        <main className='flex flex-col mx-10 mt-5 pb-10 w-full ml-10 min-h-screen'>
            <h1 className='text-3xl mt-5 mb-8 font-bold text-gray-900'>Recurring Bills</h1>
            <div className='flex gap-10'>
                {/** Left Column */}
                <div className='flex flex-col w-85 gap-y-6'>
                    {/** Left top box */}
                    <div className='h-48 w-85 bg-gray-900 color white rounded-lg shadow flex flex-col p-8'>
                        <div >
                            <img src={recurringBills}
                                alt="Recurring Bills Icon"
                                className='w-8' />
                        </div>
                        <div className='text-white text-sm mt-11'>
                            Total Bills
                        </div>
                        <div className='text-white text-3xl font-bold mt-3'>
                            $384.98
                        </div>
                    </div>
                    {/** Left bottom box */}
                    <div className='h-51 bg-white rounded-lg shadow flex flex-col p-5'>
                        <div className='font-bold mb-4'>Summary</div>
                        <div className='inline-flex items-center justify-between my-2.5'>
                            <h1 className='text-gray-500 text-sm'>Paid Bills</h1>
                            <h1 className='text-sm font-bold'>4($190.00)</h1>
                        </div>
                        <hr className='border-gray-300 mt-1 h-2' />
                        <div className='inline-flex items-center justify-between my-2.5'>
                            <h1 className='text-gray-500 text-sm'>Total Upcoming</h1>
                            <h1 className='text-sm font-bold'>4($194.98)</h1>
                        </div>
                        <hr className='border-gray-300 mt-1 h-2' />
                        <div className='inline-flex items-center justify-between my-2.5'>
                            <h1 className='text-[#C94736] text-sm'>Due Soon</h1>
                            <h1 className='text-sm font-bold text-[#C94736]'>2($59.98)</h1>
                        </div>
                    </div>

                </div>
                {/** Right Column */}
                <div className='flex flex-col bg-white rounded-lg shadow w-full p-10'>
                    {sortedDrop}
                    <div className='pt-5'>
                        {recurrEle}
                    </div>
                </div>
            </div>
        </main>
    )
}