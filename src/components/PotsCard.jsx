import React from 'react'
import ellipsis from '../images/icon-ellipsis.svg'

export function PotsCard({ id, name, target, total, theme, updatePot, removePot }) {
    const dialogRef = React.useRef(null)
    const dialogReff = React.useRef(null)
    const [amount, setAmount] = React.useState(NaN)
    const [state, setState] = React.useState(false)

    const safeTotal = Math.max(0, total);
    const progressPercentage = target > 0 ? Math.min((safeTotal / target) * 100, 100) : 0;

    const amountId = `amount-${id}`;
    const withdrawId = `withdraw-${id}`;

    function toggle() {
        setState((prev) => !prev)
    }

    return (
        <>
            <dialog
                ref={dialogRef}
            >
                <div
                    className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                                w-[560px] rounded-lg bg-white p-8 shadow-lg flex flex-col gap-5">
                    <h1 className='font-bold text-3xl text-gray-900'>
                        {`Add to ${name}`}
                    </h1>
                    <div>
                    </div>
                    <form className='flex flex-col w-125 h-18 relative'>
                        <label htmlFor={amountId}>
                            Amount to add
                        </label>
                        <div className='absolute mt-8.75 text-xl ml-3 text-gray-500'>
                            $
                        </div>
                        <input
                            id={amountId}
                            name="amount"
                            type="number"
                            step="1"
                            required
                            value={Number.isFinite(amount) ? amount : ""}
                            className='h-11 border border-[#98908B] p-6 shadow-lg rounded-lg pl-9'
                            onChange={(e) => setAmount(e.target.valueAsNumber)} />
                    </form>
                    <button
                        type="button"
                        className='bg-gray-900 text-white flex items-center justify-center rounded-lg w-125 h-17 cursor-pointer'
                        onClick={() => {
                            dialogRef.current?.close()
                            updatePot(id, amount)
                            setAmount(NaN);;
                        }}>
                        Confirm Addition
                    </button>
                </div>
            </dialog>

            <dialog
                ref={dialogReff}
            >
                <div
                    className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                                w-[560px] rounded-lg bg-white p-8 shadow-lg flex flex-col gap-5">
                    <h1 className='font-bold text-3xl text-gray-900'>
                        {`Add to Savings`}
                    </h1>
                    <div>
                    </div>
                    <form className='flex flex-col w-125 h-18 relative'>
                        <label htmlFor={withdrawId}>
                            Amount to Withdraw
                        </label>
                        <div className='absolute mt-8.75 text-xl ml-3 text-gray-500'>
                            $
                        </div>
                        <input id={withdrawId}
                            name="amount"
                            type="number"
                            step="1"
                            required
                            value={Number.isFinite(amount) ? amount : ""}
                            className='h-11 border border-[#98908B] p-6 shadow-lg rounded-lg pl-9'
                            onChange={(e) => setAmount(e.target.valueAsNumber)} />
                    </form>
                    <button
                        type="button"
                        className='bg-gray-900 text-white flex items-center justify-center rounded-lg w-125 h-17 cursor-pointer'
                        onClick={() => {
                            dialogReff.current?.close()
                            updatePot(id, -Math.abs(amount))
                            setAmount(NaN);;
                        }}>
                        Confirm Withdraw
                    </button>
                </div>
            </dialog>

            <div className="w-130 h-75 bg-white rounded-3xl shadow p-7 flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3  mb-8">
                    <div 
                        className="w-3 h-3 rounded-full mt-0.75"
                        style={{ backgroundColor: theme }}
                    ></div>
                    <h2 className="text-xl font-bold ">{name}</h2>
                    <div
                        className="ml-auto w-5 h-3 cursor-pointer flex items-center relative"
                        onClick={() => { toggle() }}>
                        {state &&
                            <div
                                className='bg-white rounded-lg shadow absolute w-29 text-center mt-16 p-3 -ml-22'
                                onClick={() => removePot(id)}>
                                Delete Pot
                            </div>}
                        <img className='w-5 h-5' src={ellipsis} alt='ellipsis image' />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                    {/* top */}
                    <div className="flex justify-between mb-5 ">
                        <div className="">
                            <p className="text-base mb-4 text-gray-500">Total Saved</p>
                        </div>
                        <div className="text-3xl font-bold text-[2rem]">
                            ${Number(total).toFixed(2)}
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mb-3">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden bg-[#F8F4F0] w-full">
                            <div
                                className="h-full rounded-full"
                                style={{ width: `${Math.min(progressPercentage, 100)}%` ,backgroundColor: theme}}
                            ></div>
                        </div>
                    </div>
                    {/* bottom */}
                    <div className="flex justify-between">
                        <p className="text-sm font-bold text-gray-500">
                            {progressPercentage.toFixed(2)}%
                        </p>
                        <div className="text-right ">
                            <p className="text-sm text-gray-500">
                                {`Target of ${target}`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer buttons */}
                <div className="flex gap-4 mt-auto gap-x-4">
                    <button
                        className="flex-1 bg-[#F8F4F0] rounded-lg cursor-pointer"
                        onClick={() => dialogRef.current?.showModal()} >
                        + Add Money
                    </button>
                    <button
                        className="flex-1 bg-[#F8F4F0] w-56 h-14 rounded-lg cursor-pointer"
                        onClick={() => dialogReff.current?.showModal()}
                    >
                        Withdraw
                    </button>
                </div>
            </div>

        </>
    )
}