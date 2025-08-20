import React from 'react'
import { PotsCard } from './PotsCard.jsx'

export default function Pots() {

    //data
    const [data, setData] = React.useState(null)
    const addPot = React.useRef(null)

    const [maxAmount, setMaxAmount] = React.useState(0)
    const [target, setTarget] = React.useState('')
    const [theme, setTheme] = React.useState('')

    const load = React.useCallback(async () => {
        const res = await fetch('http://localhost:8000/data/pots', { cache: 'no-store' });
        const json = await res.json();
        setData(Array.isArray(json) ? json : []);
    }, []);

    React.useEffect(() => { load(); }, [load]);
    React.useEffect(() => {
        fetch(`http://localhost:8000/data/pots`)
            .then(res => res.json())
            .then(data => {
                console.log("Fetched pots:", data);
                setData(data)
            })
            .catch(err => console.error(err));
    }, [])

    //for updating
    async function updatePot(id, delta) {
        const totalNum = Number(delta);
        let prevTotal = null;

        if (!Number.isFinite(totalNum)) return;

        setData(prevData => {
            if (!Array.isArray(prevData)) return prevData;
            return prevData.map(ele => {
                if (ele.id === id) {
                    prevTotal = ele.total;
                    return { ...ele, total: Number(ele.total) + totalNum }
                }
                return ele;
            })
        })
        try {
            const res = await fetch(`http://localhost:8000/data/pots/${id}/${delta}`, {
                method: 'PATCH',
            })
            if (!res.ok) throw new Error(`Server responded ${res.status}`);
            window.dispatchEvent(new Event('pots:changed'));
            load();
        }
        catch (err) {
            setData(prev =>
                Array.isArray(prev)
                    ? prev.map(p => (p.id === id ? { ...p, total: prevTotal } : p))
                    : prev);
            alert("Failed to save change.");
        }
    }
    //check if data is null
    if (!data) return <p>Loading…</p>



    async function removePot(id) {
        const prev = data;

        setData(prev => (Array.isArray(prev) ? prev.filter(p => p.id !== id) : prev));

        try {
            const res = await fetch(`http://localhost:8000/data/pots/${id}`, {
                method: 'DELETE'
            })
            window.dispatchEvent(new Event('pots:changed'));
            load();
        }
        catch (err) {
            setData(prev);
            alert("Failed to delete pot.");
            console.log(err)
        }
    }
    //adding pots line
    async function addPots({ name, target, total, theme }) {
        const Pdata = {
            name: String(name).trim(),
            target: Number(target),
            total: Number(total),
            theme: `#${String(theme)}`
        }
        try {
            await fetch('http://localhost:8000/data/pots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    Pdata
                )
            })
            window.dispatchEvent(new Event('pots:changed'));
            load();
        }
        catch (err) {
            throw new Error(`POST /data/pots failed: Error: ${err}`)
        }
    }

    return (
        <>
            <div className='ml-10 my-10 -mr-15'>
                <div className='flex justify-between'>
                    <div className='text-3xl font-bold text-gray-900 ml-2'>
                        Pots
                    </div>
                    <button
                        className='bg-black text-white cursor-pointer transition-colors duration-300 hover:bg-gray-800 p-5 rounded-lg mr-5'
                        onClick={() => addPot.current?.showModal()}
                    >
                        + Add New Pot
                    </button>
                    <dialog
                        ref={addPot}
                    >
                        <div
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                                w-[560px] rounded-lg bg-white p-8 shadow-lg flex flex-col gap-5 h-150">
                            <h1 className='font-bold text-3xl text-gray-900'>
                                Add New Pot
                            </h1>
                            <div>
                            </div>
                            <form className='flex flex-col w-125 relative gap-5'>
                                {/* Name */}
                                <label htmlFor='category'>
                                    Pot Name
                                </label>
                                <input
                                    id='category'
                                    value={target}
                                    type="text"
                                    step="1"
                                    required
                                    onChange={(e) => {
                                        setTarget(e.target.value)
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
                                    addPot.current?.close()
                                    addPots({
                                        name: target,
                                        target: maxAmount,
                                        total: 0,
                                        theme,
                                    })
                                    setMaxAmount(0);
                                    setTarget('');
                                    setTheme('');
                                }}>
                                Add Pot
                            </button>
                        </div>
                    </dialog>
                </div>
                <div className='mt-8 w-full flex flex-wrap gap-10  '>
                    {data.map(pot => {
                        return (
                            <PotsCard
                                key={pot.id}
                                id={pot.id}
                                name={pot.name}
                                target={pot.target}
                                total={pot.total}
                                theme={pot.theme}
                                updatePot={updatePot}
                                removePot={removePot}
                            />
                        )
                    })}
                </div>
            </div>
        </>
    )
}