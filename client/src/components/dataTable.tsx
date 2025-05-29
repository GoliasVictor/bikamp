// DataTable.tsx
import React from 'react';

export interface Column<T> {
  /** Texto que aparecerá no <th> */
  header: string;
  /** Nome da propriedade em T a ser mostrada naquela coluna */
  accessor: keyof T;
  /** opcional: alinhamento (padrão: 'right') */
  align?: 'left' | 'center' | 'right';
  /** opcional: largura mínima ou máxima (ex: "150px", "20%") */
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  /** opcional: estilo extra para a <table> */
  tableStyle?: React.CSSProperties;
  /** opcional: classe CSS para a <table> */
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  tableStyle,
  className,
}: DataTableProps<T>) {
  return (
    <table
      className={className}
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'right',
        marginTop: '1rem',
        ...tableStyle,
      }}
    >
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={String(col.accessor)}
              style={{
                borderBottom: '2px solid #8d8d8d',
                padding: '0.5rem',
                textAlign: col.align ?? 'right',
                width: col.width,
              }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col) => {
              const cell = row[col.accessor];
              return (
                <td
                  key={String(col.accessor)}
                  style={{
                    padding: '0.5rem',
                    borderBottom: '1px solid #6d6d6d',
                    textAlign: col.align ?? 'right',
                  }}
                >
                  {/** Se quiser tratar formatação especial, por exemplo datas, números etc, aqui é o lugar. Por enquanto, renderizamos direto. */}
                  {cell}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
