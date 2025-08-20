import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'

import logo from '../images/logo-large.svg'
import overview from '../images/icon-nav-overview.svg'
import transactions from '../images/icon-nav-transactions.svg'
import budgets from '../images/icon-nav-budgets.svg'
import pots from '../images/icon-nav-pots.svg'
import recurringBills from '../images/icon-nav-recurring-bills.svg'

export default function Layout() {
    const buttonCus = 'flex h-13 w-9/10 rounded-r-lg items-center cursor-pointer'
    const buttonAct =
        'bg-white flex h-13 w-9/10 rounded-r-lg items-center cursor-pointer border-l-4 border-green-500 '
    const spanCus = 'ml-3 font-bold text-gray-400 text-4'
    const spanAct = 'ml-3 font-bold text-gray-900 text-4'
    return (
        <div className='flex'>
            <div
                className=" fixed text-left bg-gray-900 min-w-60 h-screen rounded-r-lg flex 
                flex-col">
                <img src={logo} alt="Fiannce logo" className='w-30 h-30 mx-auto ml-10' />
                <NavLink to='.' end className={({ isActive }) => isActive ? buttonAct : buttonCus}>
                    <img src={overview} alt='Overview Icon' class='my-auto ml-10' />
                    <span className={spanCus}>Overview</span>
                </NavLink>

                <NavLink to='transactions' className={({ isActive }) => isActive ? buttonAct : buttonCus}>
                    <img src={transactions} alt='Transactions Icon' class='my-auto ml-10' />
                    <span className={spanCus}>Transactions</span>
                </NavLink>
                
                <NavLink to='budgets' className={({ isActive }) => isActive ? buttonAct : buttonCus}>
                    <img src={budgets} alt='Budgets Icon' class='my-auto ml-10' />
                    <span className={spanCus}>Budgets</span>
                </NavLink>

                    
                <NavLink to='pots' className={({ isActive }) => isActive ? buttonAct : buttonCus}>
                    <img src={pots} alt='Pots Icon' class='my-auto ml-10' />
                    <span className={spanCus}>Pots</span>
                </NavLink>

                <NavLink to='recurring-bills' className={({ isActive }) => isActive ? buttonAct : buttonCus}>
                    <img src={recurringBills} alt='Recurring Bills Icon' class='my-auto ml-10' />
                    <span className={spanCus}>Recurring Bills</span>
                </NavLink>
                    
            </div>
            <div className='ml-60 w-full pr-20 overflow-auto'>
                <Outlet />
            </div>
        </div>
    )
}