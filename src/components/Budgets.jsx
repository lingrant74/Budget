import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BudgetGrid } from './BudgetGrid.jsx'
import { BudgetDialog } from './BudetDialog.jsx'

export default function Budgets() {
    const addBudget = React.useRef(null)
    //data from JSON
    const [transactions, setTransactions] = React.useState([])
    React.useEffect(() => {
        fetch('/data.json')
            .then(res => res.json())
            .then(data => setTransactions(data.transactions ?? []))
    }, [])
    //Define load()
    const [budgets, setBudgets] = React.useState(null);
    const load = React.useCallback(async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/data/budgets`, { cache: 'no-store' });
            const json = await res.json();
            setBudgets(Array.isArray(json) ? json : []);
        } catch (e) {
            console.error('Failed to load budgets', e);
        }
    }, []);
    //Run it once on mount
    React.useEffect(() => { load(); }, [load]);


    const norm = (s) => String(s ?? '').trim().toLowerCase();
    const spentByCategory = React.useMemo(() => {
        const map = new Map();
        for (const t of transactions) {
            const key = norm(t.category);
            const n = Math.abs(Number(t.amount) || 0);
            map.set(key, (map.get(key) || 0) + n);
        }
        return map;
    }, [transactions]);
    const spentForCategory = (category) => spentByCategory.get(norm(category)) ?? 0;

    // loading state
    if (budgets === null || transactions === null) return <p>Loading…</p>
    //pie chart data
    const pieData = budgets.map(ele => ({
        name: ele.category,
        value: ele.maximum,
        color: ele.theme
    }))
    //format without zeros
    const formatterNo = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    });

    //removing budget line
    async function removeBudget(id) {
        const prev = budgets;
        setBudgets(prev.filter(p => p.id !== id))
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/data/budgets/${id}`, {
                method: 'DELETE'
            })
            window.dispatchEvent(new Event('budgets:changed'));
        }
        catch (err) {
            setBudgets(prev);
            alert("Failed to delete budget.");
            console.log(err)
        }
    }

    //editting budget line
    async function editBudget (id, maximum, theme) {
        if (maximum!= null) {
            maximum =  Number(maximum)
            if (!Number.isFinite(maximum)) return;
        }
        if(theme!= null){
            theme = `%23${String(theme)}`
        }
        if(theme== null && maximum==null ){
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/data/budgets/${id}?maximum=${maximum}&theme=${theme}`, {
                method: 'PATCH',
            })
            if (!res.ok) throw new Error(`Server responded ${res.status}`);
            window.dispatchEvent(new Event('budgets:changed'));
            await load()
        }
        catch (err) {
            alert("Failed to save change.");
        }
    }

    const currency0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

    return (
        <>
            <BudgetDialog ref={addBudget} load={load} />
            <main className='flex flex-col mx-10 my-10 w-full ml-10'>
                <div className='flex justify-between'>
                    <h1 className='text-3xl font-bold text-gray-900'>Budgets</h1>
                    <button
                        className='bg-black text-white cursor-pointer transition-colors duration-300 hover:bg-gray-800 p-5 rounded-lg mr-5'
                        onClick={() => addBudget.current?.showModal()}
                    >
                        + Add New Budget
                    </button>
                </div>
                {/**Body */}
                <div className='flex gap-x-5 mt-10'>
                    {/**Left Side */}
                    <div className='w-5/12 bg-white rounded-xl p-8 flex flex-col items-center self-start '>
                        <div className='-mt-12 w-full flex align-start '>
                            <PieChart width={550} height={400} >
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
                        <div className='font-bold text-2xl'>
                            Spending Summary
                        </div>
                        <div className='w-full flex flex-col mt-7'>
                            {(budgets ?? []).map((b, i) => (
                                <React.Fragment key={b.id ?? i}>
                                    <div className="flex h-12 items-center p-3 justify-between">
                                        <div className="flex items-center min-w-0">
                                            <span
                                                className="inline-block w-1 h-6 rounded mr-2 shrink-0"
                                                style={{ backgroundColor: b.theme }}
                                            />
                                            <span className="truncate text-gray-500">{b.category}</span>
                                        </div>
                                        <div className="text-lg font-bold flex items-center">
                                            {currency0.format(spentForCategory(b.category))}
                                            <span className="text-sm ml-2 font-normal">
                                                of {currency0.format(Number(b.maximum ?? 0))}
                                            </span>
                                        </div>
                                    </div>

                                    {/* hr between items only */}
                                    {i < budgets.length - 1 && (
                                        <hr className="my-2 w-11/12 mx-auto border-gray-300" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    {/**Right Side */}
                    <div className='w-7/12 flex flex-col gap-y-8 pb-10'>
                        <BudgetGrid
                            data={budgets}
                            transactions={transactions}
                            spentByCategory={spentByCategory}
                            onDelete={removeBudget}
                            onEdit={editBudget}
                        />
                    </div>

                </div>
            </main>
        </>
    )
}