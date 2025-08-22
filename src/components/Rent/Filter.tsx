export default function Filter() {
  return (
    <div>
      <h3>Filter</h3>
      <div className="flex flex-row w-full gap-12 align-items-start justify-content-start">
        <input
          type="text"
          className="border border-solid px-2 py-1"
          placeholder="Search"
        />
        <input
          type="text"
          className=" border border-solid py-1 px-2"
          placeholder="Sort by Type"
        />
        <input
          type="text"
          className="border border-solid py-1 px-2"
          placeholder="Sort by Price"
        />
        <input
          type="text"
          className="border border-solid py-1 px-2"
          placeholder="Days ago listed"
        />
      </div>
    </div>
  );
}
