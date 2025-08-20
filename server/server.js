import express from 'express'
import path from 'node:path'
import cors from 'cors'
import dbProm from './open.js'
import { alterPots } from './alterPots.js'
import { deletePot } from './deletePot.js'
import { deleteBudget } from './deleteBudget.js'
import { addPot } from './addPots.js'
import { alterBudgets } from './alterBudgets.js'
import { addBudget } from './addBudget.js'

const app = express();
const PORT = 8000
app.use(cors())


//app getting budgets
app.get('/data/budgets', async (req, res) => {
    try {
        const db = await dbProm()
        let query = 'SELECT * FROM budget'
        const products = await db.all(query)
        res.json(products)

    }
    catch (err) {
        res.status(400).json({ error: 'Failed to fetch budgets', details: err.message })
    }
})


//app getting pots
app.get('/data/pots', async (req, res) => {
    try {
        const db = await dbProm()
        let query = 'SELECT * FROM pots'
        const products = await db.all(query)
        res.json(products)

    }
    catch (err) {
        res.status(400).json({ error: 'Failed to fetch pots', details: err.message })
    }
})


//app editting pots
app.use(express.json())
app.patch('/data/pots/:id/:delta', async (req, res) => {
    const id = parseInt(req.params.id)
    const delta = parseFloat(req.params.delta)
    if (isNaN(id)) return res.sendStatus(400);
    if (isNaN(delta)) return res.sendStatus(400);
    try {
        await alterPots(id, delta);
        return res.sendStatus(204);
    }
    catch (err) {
        return res.status(err.status || 500).json({ error: err.message || 'Server error' });
    }

})

//app editting budgets
app.patch('/data/budgets/:id', async (req, res) => {
    const id = parseInt(req.params.id)

    const { maximum, theme } = req.query;
    let maximum1 = maximum !== undefined ? Number(maximum) : null
    let theme1 = theme !== undefined  ? String(theme) : null
    if(Number(maximum) === 0){
        maximum1 = null;
    }
    if(String(theme) === '#'){
        theme1 = null;
    }
    console.log("Raw query params:", req.query);
    console.log("maximum =", maximum1, "theme =", theme1);

    try {
        await alterBudgets(id, { maximum: maximum1, theme: theme1 })
        return res.sendStatus(204);
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to update budget' });
    }

})


app.delete('/data/pots/:id', async (req, res) => {
    console.log(`DELETE request received for /data/pots/${req.params.id}`);
    const id = parseInt(req.params.id)
    if (!Number.isInteger(id)) {
        console.log('Invalid ID:', req.params.id);
        return res.sendStatus(400);
    }
    try {
        await deletePot(id);
        console.log(`Successfully deleted pot with ID: ${id}`);
        return res.sendStatus(204);
    }
    catch (err) {
        console.log('Error in deletePot:', err.message);
        return res.status(err?.status ?? 500).json({ error: err?.message ?? "Server error" });
    }
})

app.delete('/data/budgets/:id', async (req, res) => {
    console.log(`DELETE request received for /data/budgets/${req.params.id}`);
    const id = parseInt(req.params.id)
    if (!Number.isInteger(id)) {
        console.log('Invalid ID:', req.params.id);
        return res.sendStatus(400);
    } 
    try {
        await deleteBudget(id);
        console.log(`Successfully deleted budget with ID: ${id}`);
        return res.sendStatus(204);
    }
    catch (err) {
        console.log('Error in deleteBudget:', err.message);
        return res.status(err?.status ?? 500).json({ error: err?.message ?? "Server error" });
    }
})


app.post('/data/pots', async (req, res) => {
    try {
        const { name, target, total, theme } = req.body || {}
        const row = await addPot(name, target, total, theme)
        return res
            .status(201)
            .location(`/data/pots/${row.id}`)
            .json(row);
    }
    catch (err) {
        return res
            .status(err?.status ?? 500)
            .json({ error: err?.message ?? 'Server error' });
    }
})

app.post('/data/budgets', async(req,res)=>{
    try{
        const { category, maximum, theme } = req.body || {}
        const row = await addBudget(category, maximum,  theme) 
        return res
            .status(201)
            .location(`/data/pots/${row.id}`)
            .json(row);
    }
    catch(err){
        return res
            .status(err?.status ?? 500)
            .json({ error: err?.message ?? 'Server error' });
    }
})


app.listen(PORT, () => console.log('finished backend'))