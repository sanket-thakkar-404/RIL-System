const TableRow = ({ item }) => {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      {item.map((col, index) => (
        <td key={index} className={`px-6 py-4 ${col.cellClassName || ""}`}>
          {col}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
