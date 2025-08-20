import React from 'react'
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Overview from './components/Overview.jsx'
import Transactions from './components/Transactions.jsx'
import Budgets from './components/Budgets.jsx'
import Pots from './components/Pots.jsx'
import RecurringBills from './components/Recurring-bills.jsx'
import NotFound from './components/404page.jsx'



function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path ='/' element={<Layout/>}>
            <Route index element={<Overview/>}/>
            <Route path="*" element={<NotFound/>} />
            <Route path = 'transactions' element={<Transactions/>}/>
            <Route path = 'budgets' element = {<Budgets/>}/>
            <Route path = 'pots' element = {<Pots/>}/>
            <Route path = 'recurring-bills' element = {<RecurringBills/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
