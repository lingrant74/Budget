import React from 'react'
import ellipsis from '../images/icon-ellipsis.svg'
import { BudgetGridDialog } from './BudgetGridDialog'

export function BudgetGrid({ data, onDelete, onEdit }) {
    const [state, setState] = React.useState(null)
    const ref = React.useRef(null)

    const [editingId, setEditingId] = React.useState(null);

    const openEdit = (id) => {
        setEditingId(id);
        ref.current?.showModal();
    };
    //data
    const [data1, setData] = React.useState(null)
    React.useEffect(() => {
        fetch('/data.json')
            .then(res => res.json())
            .then(data => setData(data))
    }, [])
    //check if data is null
    if (!data1) return <p>Loading…</p>


    // calculate spent total for a category
    function spentForCategory(category) {
        if (!data1?.transactions) return 0;

        return data1.transactions
            .filter(t => String(t.category) === String(category))
            .reduce((sum, t) => sum + (t.amount < 0 ? Math.abs(t.amount) : t.amount), 0);
    }

    //format with sign display
    const formatterSign = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
        signDisplay: 'always'
    });

    //find the first three transactions of that specific category
    function findCategory3(category) {
        const list = data1.transactions.filter(ele => String(ele.category) === String(category))
        return list.slice(0, 3);
    }


    function grid(category) {
        const newList = findCategory3(category)
        const date = new Date(category);
        return (
            <>
                {newList.map((item, i) => (
                    <React.Fragment key={i}>
                        <div className="inline-flex items-center justify-between my-3">
                            <div className="inline-flex items-center">
                                <img src={item.avatar} className="w-10 rounded-full" />
                                <span className="ml-5 text-base font-bold">{item.name}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <h1
                                    className={
                                        item.amount >= 0
                                            ? "text-base text-[#277C78]"
                                            : "text-base"
                                    }
                                >
                                    {formatterSign.format(item.amount)}
                                </h1>
                                <h1 className="text-xs font-light text-gray-500">
                                    {new Date(item.date).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </h1>
                            </div>
                        </div>

                        {/* Divider between items, except after the last */}
                        {i < newList.length - 1 && (
                            <hr className="border-gray-300 mt-3 h-2" />
                        )}
                    </React.Fragment>
                ))}
            </>
        );
    }
    return (
        <>
        <BudgetGridDialog 
                    ref={ref} 
                    onEdit={({ maxAmount, theme }) => onEdit?.(editingId, maxAmount, theme)}/>
        {data.map((budget, i) => {
        const spent = spentForCategory(budget.category);
        const id = budget.id ?? i;
        const isOpen = state === id;
        return (
            <>
                <div
                    key={i}
                    className="flex flex-col bg-white shadow p-8 rounded-lg gap-5"
                >
                    {/* Header */}
                    <div className="flex gap-3 justify-between relative">
                        <div className='flex gap-3'>
                            <div
                                className="w-3 h-3 rounded-full mt-2.5"
                                style={{ backgroundColor: budget.theme }}
                            />
                            <h2 className="text-2xl font-bold">{budget.category}</h2>
                        </div>
                        <div
                            className='cursor-pointer flex w-10 justify-center'
                            onClick={() => setState((isOpen ? null : id))}>
                            <img
                                className='w-5  '
                                src={ellipsis}
                                alt='ellipsis image' />
                        </div>
                        {isOpen &&
                            <div
                                className='absolute rounded-lg w-34 h-23 right-0 mt-7 mr-2 shadow-lg flex flex-col p-1 z-[100] bg-white'
                            >
                                <div
                                    className='flex items-center justify-center cursor-pointer h-15 text-gray-900'
                                    onClick={() => {return(
                                        openEdit(id),
                                        ref.current?.showModal()
                                    )}}>
                                    Edit Budget
                                </div>
                                <hr className='h-2 w-4/5 flex m-auto text-gray-300' />
                                <div
                                    className='flex items-center justify-center cursor-pointer h-15 text-red-500'
                                    onClick={() => onDelete(id)}
                                >
                                    Delete Budget
                                </div>
                            </div>}
                    </div>

                    {/* Max */}
                    <div className="text-base text-gray-500">
                        Maximum of ${budget.maximum.toFixed(2)}
                    </div>

                    {/* Progress bar */}
                    <div className="bg-[#F8F4F0] p-2 w-full h-10 rounded">
                        <div
                            className="h-full rounded"
                            style={{
                                backgroundColor: budget.theme,
                                width: `${Math.min((spent / budget.maximum) * 100, 100)}%`,
                            }}
                        />
                    </div>

                    {/* Stats */}
                    <div className="flex h-11 justify-between">
                        <div className="flex gap-5 flex-1">
                            <div
                                className="w-1 rounded h-full"
                                style={{ backgroundColor: budget.theme }}
                            />
                            <div className="flex flex-col">
                                <h1>Spent</h1>
                                <h1>${spent.toFixed(2)}</h1>
                            </div>
                        </div>

                        <div className="flex gap-5 flex-1">
                            <div
                                className="w-1 rounded h-full"
                                style={{ backgroundColor: budget.theme }}
                            />
                            <div className="flex flex-col">
                                <h1>Remaining</h1>
                                <h1>${(budget.maximum - spent).toFixed(2)}</h1>
                            </div>
                        </div>
                    </div>

                    {/* Latest Spending */}
                    <div className="flex flex-col rounded-lg shadow bg-[#F8F4F0] w-full p-5">
                        <div className="font-bold text-gray-900 text-lg">
                            Latest Spending
                        </div>
                        <div className="flex flex-col mt-7">
                            {grid(budget.category)}
                        </div>
                    </div>
                </div>
            </>
        )
    })}
    </>
    )
}