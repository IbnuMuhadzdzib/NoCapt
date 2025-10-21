export default function Input({ placeholder, value, onChange, required }) {
    return (
        <div>
            <input 
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className='input validator boder border-1 p-2 rounded-lg' />
            <div className="validator-hint">Input can't empty</div>
        </div>
    )
}