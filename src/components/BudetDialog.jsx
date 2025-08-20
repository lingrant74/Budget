import React from 'react'


export function BudgetDialog({ ref, load }) {
    const [data, setData] = React.useState(null)

    React.useEffect(() => {
        fetch(`http://localhost:8000/data/budgets`)
            .then(res => res.json())
            .then(data => {
                console.log("Fetched pots:", data);
                setData(data)
            })
            .catch(err => console.error(err));
    }, [])


    const [category, setCategory] = React.useState('')
    const [maxAmount, setMaxAmount] = React.useState(0)
    const [theme, setTheme] = React.useState('')

    if (!data) return <p>Loading…</p>
    //adding budgets line
    async function addBudget({ category, maxAmount, theme }) {
        const Pdata = {
            category: String(category).trim(),
            maximum: Number(maxAmount),
            theme: `#${String(theme)}`
        }
        try {
            await fetch('http://localhost:8000/data/budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    Pdata
                )
            })
            window.dispatchEvent(new Event('budgets:changed'));
            load()
        }
        catch (err) {
            throw new Error(`POST /data/pots failed: Error: ${err}`)
        }
    }

    return (
        <dialog
            ref={ref}
        >
            <div
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                                w-[560px] rounded-lg bg-white p-8 shadow-lg flex flex-col gap-5 h-150">
                <h1 className='font-bold text-3xl text-gray-900'>
                    Add New Budget
                </h1>
                <div>
                </div>
                <form className='flex flex-col w-125 relative gap-5'>
                    {/* Name */}
                    <label htmlFor='category'>
                        Budget Category
                    </label>
                    <input
                        id='category'
                        value={category}
                        type="text"
                        step="1"
                        required
                        onChange={(e) => {
                            setCategory(e.target.value)
                        }}
                        className='h-11 border border-[#98908B] p-6 shadow-lg rounded-lg pl-5'
                    />
                    {/* max spend */}
                    <label htmlFor='amount'>
                        Maximum Spend
                    </label>
                    <div className='absolute mt-42.25 text-xl ml-3 text-gray-500'>
                        $
                    </div>
                    <input
                        id='amount'
                        value={maxAmount}
                        type="number"
                        step="1"
                        required
                        onChange={(e) => {
                            setMaxAmount(e.target.valueAsNumber)
                        }}
                        className='h-11 border border-[#98908B] p-6 shadow-lg rounded-lg pl-9'
                    />
                    {/* Theme */}
                    <label htmlFor='theme'>
                        Theme
                    </label>
                    <input
                        id='theme'
                        value={theme}
                        type="text"
                        step="1"
                        required
                        onChange={(e) => {
                            setTheme(e.target.value)
                        }}
                        className='h-11 border border-[#98908B] p-6 shadow-lg rounded-lg pl-5'
                    />
                </form>
                <button
                    type="button"
                    className='bg-gray-900 text-white flex items-center justify-center rounded-lg w-125 h-17 cursor-pointer mt-10'
                    onClick={() => {
                        ref.current?.close()
                        addBudget({
                            category: category,
                            maxAmount: maxAmount,
                            theme : theme,
                        })
                        setMaxAmount(0);
                        setCategory('');
                        setTheme('');
                    }}>
                    Add Budget
                </button>
            </div>
        </dialog>
    )
}