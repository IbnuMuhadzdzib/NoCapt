export default function Keyword({ placeholder, value, onChange, required }) {
    return (
        <div>
              <textarea type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className='textarea validator boder border-1 p-2 rounded-lg' />
              <div className="validator-hint">Column Can't be Empty</div>
            </div>
    )
}