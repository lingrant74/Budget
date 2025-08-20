import React from 'react'

export const BudgetGridDialog = React.forwardRef(function BudgetGridDialog(
  { onEdit },
  ref
) {

    const [maxAmount, setMaxAmount] = React.useState(NaN)
    const [theme, setTheme] = React.useState('')

    return (
        <dialog ref={ref}>
            <div
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                                w-[560px] rounded-lg bg-white p-8 shadow-lg flex flex-col gap-5">
                <h1 className='font-bold text-3xl text-gray-900'>
                    Edit Budget
                </h1>
                <form className='flex flex-col w-125 relative gap-5'>
                    {/* max spend */}
                    <label htmlFor='amount'>
                        Maximum Spend
                    </label>
                    <div className='absolute mt-13.75 text-xl ml-3 text-gray-500'>
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
                        onEdit({
                            maxAmount: maxAmount,
                            theme: theme,
                        })
                        setMaxAmount(0);
                        setTheme('');
                    }}>
                    Save Changes
                </button>
            </div>
        </dialog>
    )
})