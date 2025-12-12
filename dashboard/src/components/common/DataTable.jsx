import { useState, useMemo } from "react";
import { MdSearch, MdArrowUpward, MdArrowDownward } from "react-icons/md";
import Button from "../UI/Button";

export default function DataTable({
  columns,
  data,
  actions = [],
  searchable = true,
  tableTitle,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedData = useMemo(() => {
    let sortableData = [...data];

    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableData;
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;

    return sortedData.filter((row) =>
      columns.some((column) =>
        String(row[column.key]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm, columns]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <div className="bg-card overflow-hidden">
      {/* Table Header */}
      <div className="flex justify-between items-center w-full bg-[var(--light)] py-4 gap-4 text-[var(--text-main)]">
        <div className="flex sm:items-center sm:justify-between sm:flex-row flex-col gap-4 w-full">
          <h2 className="text-lg md:text-xl font-medium">{tableTitle}</h2>
          {searchable && (
            <div className="flex items-center gap-2 bg-[var(--bg-form)] border border-[var(--border-color)] px-3 py-2 rounded">
              <MdSearch size={20} />
              <input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="outline-none text-sm w-full bg-[var(--bg-form)]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {paginatedData.length > 0 ? (
          <table className="w-full min-w-[768px]">
            <thead className="bg-[var(--bg-form)] border border-[var(--border-color)] text-[var(--text-main)]">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider "
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1 w-fit cursor-pointer">
                      {column.label}
                      {column.sortable &&
                        sortConfig.key === column.key &&
                        (sortConfig.direction === "asc" ? (
                          <MdArrowUpward size={14} />
                        ) : (
                          <MdArrowDownward size={14} />
                        ))}
                    </div>
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="border-l border-r border-[var(--border-color)] text-[var(--text-main)]">
              {paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-[var(--sidebar)] border-b border-[var(--border-color)]"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-2 py-1.5 text-sm">
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]}
                    </td>
                  ))}

                  {actions.length > 0 && (
                    <td className="p-1.5">
                      <div className="flex gap-2">
                        {actions.map((action, i) => (
                          <Button
                            key={i}
                            action={() => action.onClick(item)}
                            text={
                              typeof action.label === "function"
                                ? action.label(item)
                                : action.icon
                            }
                            bg={
                              typeof action.bg === "function"
                                ? action.bg(item)
                                : action.bg
                            }
                            hover={
                              typeof action.hoverBg === "function"
                                ? action.hoverBg(item)
                                : action.hoverBg
                            }
                            className="px-2"
                          />
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-xl font-medium p-4 opacity-60">
            Data not found!
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="py-4 flex items-center justify-between">
          <p className="text-sm">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-[var(--sidebar)] border border-[var(--border-color)] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Prev
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-[var(--sidebar)] border border-[var(--border-color)] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
