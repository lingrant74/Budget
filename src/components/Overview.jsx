import React from 'react'
import potIcon from '../images/icon-pot.svg'
import caretRight from '../images/icon-caret-right.svg'
import { Link } from 'react-router-dom'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Overview() {
    //data
    const [data, setData] = React.useState(null)
    React.useEffect(() => {
        fetch('/data.json')
            .then(res => res.json())
            .then(data => setData(data))
    }, [])
    //server-backed lists 
    const [budgets, setBudgets] = React.useState([]);
    const [pots, setPots] = React.useState([]);


    const loadBudgets = React.useCallback(async () => {
        const res = await fetch('http://localhost:8000/data/budgets', { cache: 'no-store' });
        const json = await res.json();
        setBudgets(Array.isArray(json) ? json : []);
    }, []);

    const loadPots = React.useCallback(async () => {
        const res = await fetch('http://localhost:8000/data/pots', { cache: 'no-store' });
        const json = await res.json();
        setPots(Array.isArray(json) ? json : []);
    }, []);

    React.useEffect(() => {
        loadBudgets();
        loadPots();
    }, [loadBudgets, loadPots]);

    // refresh after updating pots and budgets
    React.useEffect(() => {
        const onBudgets = () => loadBudgets();
        const onPots = () => loadPots();

        window.addEventListener('budgets:changed', onBudgets);
        window.addEventListener('pots:changed', onPots);

        return () => {
            window.removeEventListener('budgets:changed', onBudgets);
            window.removeEventListener('pots:changed', onPots);
        };
    }, [loadBudgets, loadPots]);


    //check if data is null
    if (!data) return <p>Loading…</p>

    //pie chart data
    const pieData = budgets.map(ele => ({
        name: ele.category,
        value: ele.maximum,
        color: ele.theme
    }))

    //pie elements
    const pieEle = pieData.map((ele, index) => {
        return (
            <Pie
                key={index}
                data={[ele]}
                dataKey={"value"}
                nameKey={"name"}
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
                fill={ele.color}
            />
        )
    })

    //format with zeros
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });

    //format without zeros
    const formatterNo = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    });

    //format with sign display
    const formatterSign = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
        signDisplay: 'always'
    });

    //finds the elements of pots
    const plotList = pots;

    //list of all transactions
    const transList = data.transactions.map((ele, index) => {
        return ({
            avatar: ele.avatar,
            name: ele.name,
            category: ele.category,
            date: ele.date,
            amount: ele.amount,
            recurring: ele.recurring
        })
    })

    //turn string dates to date format
    const transDateList = data.transactions.map((ele) => {
        ele = ele.date.slice(0, 10);
        const dt = new Date(ele)
        return (
            dt.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        )
    })

    const balance = JSON.stringify(data.balance.current)
    const income = JSON.stringify(data.balance.income)
    const expenses = JSON.stringify(data.balance.expenses)
    return (
        <>
            <main className='flex flex-col mx-10 my-10 w-full ml-10'>
                <h1 className='text-3xl font-bold text-gray-900'>Overview</h1>
                <div>
                    {/* First Row */}
                    <div className='flex mt-7 w-full gap-10 h-30'>
                        <div className='bg-gray-900 rounded-lg flex-1 shadow p-5'>
                            <h1 className='text-white'>Current Balance</h1>
                            <div className='text-white mt-3 font-bold text-4xl flex items-center'>
                                {formatter.format(balance)}
                            </div>
                        </div>
                        <div className='bg-white rounded-lg flex-1 shadow p-5'>
                            <h1 className='text-gray-500'>Income</h1>
                            <div className='mt-3 font-bold text-4xl flex items-center'>
                                {formatter.format(income)}
                            </div>
                        </div>
                        <div className='bg-white rounded-lg flex-1 shadow p-5'>
                            <h1 className='text-gray-500'>Expenses</h1>
                            <div className='mt-3 font-bold text-4xl flex items-center'>
                                {formatter.format(expenses)}
                            </div>
                        </div>
                    </div>
                    {/* End of First Row */}


                    <div className='flex mt-10 w-full gap-x-5'>
                        {/* Left Column */}
                        <div className='w-3/5 min-w-[430px]'>
                            {/* Pots box */}
                            <div className='flex flex-col w-full bg-white rounded-lg h-58 font-semibold text-2xl p-8 min-w-[430px] overflow-y-hidden shadow'>
                                <div className='flex justify-between'>
                                    <span>Pots</span>
                                    <Link to='pots'>
                                        <span className='text-gray-400 text-sm '>See Details
                                            <img src={caretRight} alt='Caret Right Icon' className='ml-1 w-3 h-3 inline-block mb-1' />
                                        </span>
                                    </Link>
                                </div>
                                <div className='flex gap-5 mt-2'>
                                    <div className='flex items-center bg-[#F8F4F0] h-31 rounded-lg w-1/2 mt-3 p-5'>
                                        <img src={potIcon} alt='Pot Icon' />
                                        <div className='ml-5'>
                                            <h1 className='text-base text-gray-700'>Total Saved</h1>
                                            <h1 className='text-4xl mt-2'>$850</h1>
                                        </div>
                                    </div>

                                    {/* Start of grid within pots*/}
                                    <div className='grid grid-cols-2 gap-y-5 w-1/2 text-sm font-light mt-3 ml-5 gap-3
                                    '>
                                        {(plotList ?? []).slice(0, 4).map((p, i) => (
                                            <div className='flex' key={p.id ?? i}>
                                                <div className="h-full w-1 rounded-xl mr-2" style={{ backgroundColor: p.theme }} />
                                                <div className='flex flex-col justify-between ml-3 truncate'>
                                                    {p.name}
                                                    <br />
                                                    <div className='text-xl font-bold'>
                                                        {formatterNo.format(Number(p.total ?? 0))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* End of Post Grid*/}
                                </div>
                            </div>
                            {/* End of Pots box */}

                            {/* Start of Tranactions box */}
                            <div className='mt-6 bg-white shadow h-130 font-semibold text-2xl p-8 rounded-lg'>
                                <div className='flex justify-between'>
                                    <span>Transactions</span>
                                    <Link to='transactions'>
                                        <span className='text-gray-400 text-sm '>View All
                                            <img src={caretRight} alt='Caret Right Icon' className='ml-1 w-3 h-3 inline-block mb-1' />
                                        </span>
                                    </Link>
                                </div>
                                {/* Start of Grid in Tranactions box */}
                                <div className='flex flex-col mt-7 '>
                                    <div className='inline-flex items-center justify-between my-3'>
                                        <div className='inline-flex items-center '>
                                            <img src={transList[0].avatar} className='w-10 rounded-full' />
                                            <span className='ml-5 text-base font-bold'>{transList[0].name}</span>
                                        </div>
                                        <div className='flex flex-col items-end'>
                                            <h1
                                                className={transList[0].amount >= 0 ? "text-base text-[#277C78]" : "text-base"}
                                            >{formatterSign.format(transList[0].amount)}</h1>
                                            <h1 className='text-xs font-light text-gray-500'>{transDateList[0]}</h1>
                                        </div>
                                    </div>
                                    <hr className='border-gray-100 mt-3 h-2' />
                                    <div className='inline-flex items-center justify-between my-3'>
                                        <div className='inline-flex items-center '>
                                            <img src={transList[1].avatar} className='w-10 rounded-full' />
                                            <span className='ml-5 text-base font-bold'>{transList[1].name}</span>
                                        </div>
                                        <div className='flex flex-col items-end'>
                                            <h1
                                                className={transList[1].amount >= 0 ? "text-base text-[#277C78]" : "text-base"}
                                            >{formatterSign.format(transList[1].amount)}</h1>
                                            <h1 className='text-xs font-light text-gray-500'>{transDateList[1]}</h1>
                                        </div>
                                    </div>
                                    <hr className='border-gray-100 mt-3 h-2' />
                                    <div className='inline-flex items-center justify-between my-3'>
                                        <div className='inline-flex items-center '>
                                            <img src={transList[2].avatar} className='w-10 rounded-full' />
                                            <span className='ml-5 text-base font-bold'>{transList[2].name}</span>
                                        </div>
                                        <div className='flex flex-col items-end'>
                                            <h1
                                                className={transList[2].amount >= 0 ? "text-base text-[#277C78]" : "text-base"}
                                            >{formatterSign.format(transList[2].amount)}</h1>
                                            <h1 className='text-xs font-light text-gray-500'>{transDateList[2]}</h1>
                                        </div>
                                    </div>
                                    <hr className='border-gray-100 mt-3 h-2' />
                                    <div className='inline-flex items-center justify-between my-3'>
                                        <div className='inline-flex items-center '>
                                            <img src={transList[3].avatar} className='w-10 rounded-full' />
                                            <span className='ml-5 text-base font-bold'>{transList[3].name}</span>
                                        </div>
                                        <div className='flex flex-col items-end'>
                                            <h1
                                                className={transList[3].amount >= 0 ? "text-base text-[#277C78]" : "text-base"}
                                            >{formatterSign.format(transList[3].amount)}</h1>
                                            <h1 className='text-xs font-light text-gray-500'>{transDateList[3]}</h1>
                                        </div>
                                    </div>
                                    <hr className='border-gray-100 mt-3 h-2' />
                                    <div className='inline-flex items-center justify-between my-3'>
                                        <div className='inline-flex items-center '>
                                            <img src={transList[4].avatar} className='w-10 rounded-full' />
                                            <span className='ml-5 text-base font-bold'>{transList[4].name}</span>
                                        </div>
                                        <div className='flex flex-col items-end'>
                                            <h1
                                                className={transList[4].amount >= 0 ? "text-base text-[#277C78]" : "text-base"}
                                            >{formatterSign.format(transList[4].amount)}</h1>
                                            <h1 className='text-xs font-light text-gray-500'>{transDateList[4]}</h1>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                        {/* Start of Right Column */}
                        <div className='w-2/5 '>
                            {/* Start of Budgets box */}
                            <div className='w-full bg-white h-102.5 flex flex-col rounded-lg font-semibold text-2xl p-8 min-w-[280px] overflow-x-auto overflow-y-hidden shadow align-between'>
                                <div className='flex justify-between'>
                                    <span>Budgets</span>
                                    <Link to='budgets'>
                                        <span className='text-gray-400 text-sm '>See Details
                                            <img src={caretRight} alt='Caret Right Icon' className='ml-1 w-3 h-3 inline-block mb-1' />
                                        </span>
                                    </Link>
                                </div>
                                {/* Start of Budgets non-title*/}
                                <div className=' flex justify-between mt-5 w-full max-w-full overflow-x-auto overflow-y-hidden'>
                                    <div className="flex justify-between w-full" >
                                        {/* Start of Pie Chart */}
                                        <div className='w-70 flex justify-center'>
                                            <PieChart width={400} height={300} >
                                                <Pie
                                                    data={pieData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={130}
                                                    outerRadius={180}
                                                    label={false}>
                                                    {pieData.map((entry, i) => (
                                                        <Cell key={i} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </div>

                                        {/* Start of Left Grid */}
                                        <div className=' grid grid-cols-1 w-1/3 text-sm mt-2 font-light ml-5 gap-3 flex-shrink-0 '>
                                            {(pieData ?? []).slice(0, 4).map((b, i) => (
                                                <div className='flex h-15' key={b.name ?? i}>
                                                    <div className="min-w-1 rounded-xl mr-2" style={{ backgroundColor: b.color }} />
                                                    <div className='flex flex-col justify-between ml-3 truncate'>
                                                        {b.name}
                                                        <br />
                                                        <div className='text-xl font-bold'>
                                                            {formatterNo.format(Number(b.value ?? 0))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* End of Left Grid */}
                                    </div>
                                </div>
                            </div>
                            {/* End of Budgets*/}
                            {/* Start of Recurring*/}
                            <div className='w-full h-86 shadow bg-white mt-5 rounded-lg flex flex-col rounded-lg font-semibold text-2xl p-8 min-w-[300px]'>
                                <div className='flex justify-between mb-7'>
                                    <span>Recurring Bills</span>
                                    <Link to='recurring-bills'>
                                        <span className='text-gray-400 text-sm '>Paid Bills
                                            <img src={caretRight} alt='Caret Right Icon' className='ml-1 w-3 h-3 inline-block mb-1' />
                                        </span>
                                    </Link>
                                </div>
                                <div className='bg-[#277C78] rounded-xl mb-5'>
                                    <div className='bg-[#F8F4F0] w-full h-15 ml-1 rounded-xl flex justify-between items-center px-4'>
                                        <span className='text-base text-gray-500 font-light'>Paid Bills</span>
                                        <span className='text-base font-bold'>$194.98</span>
                                    </div>
                                </div>
                                <div className='bg-[#F2CDAC] rounded-xl mb-5'>
                                    <div className='bg-[#F8F4F0] w-full h-15 ml-1 rounded-xl flex justify-between items-center px-4'>
                                        <span className='text-base text-gray-500 font-light'>Total Upcomings</span>
                                        <span className='text-base font-bold'>$189.78</span>
                                    </div>
                                </div>
                                <div className='bg-[#82C9D7] rounded-xl'>
                                    <div className='bg-[#F8F4F0] w-full h-15 ml-1 rounded-xl flex justify-between items-center px-4'>
                                        <span className='text-base text-gray-500 font-light'>Due Soon</span>
                                        <span className='text-base font-bold'>$59.98</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}