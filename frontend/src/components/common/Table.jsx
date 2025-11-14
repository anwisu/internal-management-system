import {
  Table as MTTable,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from '@material-tailwind/react';

/**
 * Reusable Table component
 * Wrapper around Material Tailwind Table with consistent styling
 */
function Table({ headers, data, renderRow, emptyMessage = 'No data available' }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <MTTable className="min-w-full">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableHeaderCell key={index}>{header}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>{renderRow(item, index)}</TableRow>
          ))}
        </TableBody>
      </MTTable>
    </div>
  );
}

export default Table;

