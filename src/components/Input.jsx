export default function Input({ placeholder, value, onChange, required }) {
    return (
        <input 
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className='boder border-1 p-2 rounded-lg' />
    )
}