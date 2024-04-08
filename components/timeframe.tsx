import { timeframes } from "@/config/timeframes"

function Button({label, value, selected, setSelected}: ({label: string, value: string, selected: any, setSelected: (value: string) => void})) {
    return (
        <button
            type="button"
            className={`relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 transition-all ${selected ? 'bg-slate-200' : ''}`}
            onClick={() => setSelected(value)}
        >
            {label}
        </button>
    )
}

export default function TimeframeSelection({selected, setSelected}: ({selected: string, setSelected: (value: string) => void})) {
    return (
        <span className="isolate inline-flex flex-wrap rounded-md shadow-sm gap-2">
            {timeframes.map(timeframe => (
                <Button
                    key={timeframe.value}
                    label={timeframe.label}
                    value={timeframe.value}
                    selected={selected === timeframe.value}
                    setSelected={setSelected}
                />
            ))}
        </span>
    )
}