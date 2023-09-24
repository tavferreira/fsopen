const Filter = ({search,setSearch}) => (
    <>
        find countries <input value={search} onChange={(e) => setSearch(e.target.value)} />
    </>
)

export default Filter
