import {useEffect, useState} from 'react'
import logo from './logo.svg'
import './App.css'

enum Direction {
    buy = "buy",
    sell = "sell"
}

interface Trade {
    trade_seq: number;
    trade_id: string;
    direction: Direction;
    amount: number;
    instrument_name: string;
    price: number;
}

interface Instrument {
    name: string;
    total: number;
}


const App = () => {
    const [trades, setTrades] = useState<Trade[]>([])
    const [instruments, setInstruments] = useState<Instrument>([])

    const aggregate = (trades: Trade[]): Map<string, number> => {
        const aggregated = trades.reduce((aggr, curr) => {
            let amount = aggr.get(curr.instrument_name) || 0
            let newTotal = curr.direction === Direction.buy
                ? amount + curr.amount
                : amount - curr.amount
            aggr.set(curr.instrument_name, newTotal)
            return aggr

        }, new Map<string, number>)

        return aggregated
    }

    useEffect(() => {
        const fetchTrades = async () => {
            const response = await fetch(`https://test.deribit.com/api/v2/public/get_last_trades_by_currency?count=500&currency=BTC`)

            if (response.ok) {
                const json = await response.json()
                const trades = json.result.trades
                setTrades(trades)
                console.log(aggregate(trades))
            }
        }

        fetchTrades().then(r => r)
    }, [])

    return (
        <ul>
            {!!trades && trades.map((trade, i) => (
                <li key={i}>{trade.trade_seq}</li>
            ))}
        </ul>
    )
}

export default App
