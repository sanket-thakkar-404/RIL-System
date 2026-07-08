const TableHeader = ({ columns, className }) => {
  return (
    <thead className="bg-slate-50/50 text-center text-slate-500 font-semibold text-xs tracking-wider uppercase">
      <tr>
        {columns.map((col, index) => (
          <th key={index} className={`px-6 py-3 text-start ${className}`}>
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
