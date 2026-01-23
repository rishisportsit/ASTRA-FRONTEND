import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Column<T> {
    key: keyof T;
    header: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchKeys?: (keyof T)[];
    perPage?: number;
    className?: string;
}

export function DataTable<T extends { id?: string | number } & Record<string, any>>({
    data,
    columns,
    searchKeys = [],
    perPage = 10,
    className = ""
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

    // Filter Data
    const filteredData = useMemo(() => {
        let result = [...data];

        // Search
        if (searchQuery && searchKeys.length > 0) {
            result = result.filter(item =>
                searchKeys.some(key => {
                    const val = item[key];
                    return val ? String(val).toLowerCase().includes(searchQuery.toLowerCase()) : false;
                })
            );
        }

        // Sort
        if (sortConfig) {
            result.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];

                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, searchQuery, searchKeys, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / perPage);
    const paginatedData = filteredData.slice((currentPage - 1) * perPage, currentPage * perPage);

    const handleSort = (key: keyof T) => {
        setSortConfig(current => {
            if (current?.key === key) {
                return current.direction === 'asc'
                    ? { key, direction: 'desc' }
                    : null;
            }
            return { key, direction: 'asc' };
        });
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header / Search */}
            <div className="flex items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-sm group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-white/30 group-focus-within:text-white/70 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset to page 1 on search
                        }}
                        placeholder="Search..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
                    />
                </div>

                {/* Results Count */}
                <div className="text-xs text-white/40">
                    {filteredData.length} entries
                </div>
            </div>

            {/* Table Container */}
            <div className="w-full overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5 text-white/60">
                                {columns.map((col) => (
                                    <th
                                        key={String(col.key)}
                                        className={`px-6 py-4 font-medium transition-colors ${col.sortable ? 'cursor-pointer hover:text-white hover:bg-white/5' : ''}`}
                                        onClick={() => col.sortable && handleSort(col.key)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {col.header}
                                            {col.sortable && (
                                                <span className="opacity-50">
                                                    {sortConfig?.key === col.key ? (
                                                        sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                                                    ) : (
                                                        <ArrowUpDown size={12} />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {paginatedData.map((item, index) => (
                                    <motion.tr
                                        key={item.id || index}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: index * 0.03, duration: 0.2 }}
                                        className="group hover:bg-white/5 transition-colors"
                                    >
                                        {columns.map((col) => (
                                            <td key={String(col.key)} className="px-6 py-4 text-white/80 group-hover:text-white transition-colors">
                                                {col.render ? col.render(item) : item[col.key]}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>

                            {paginatedData.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-white/30">
                                        No results found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/5">
                        <p className="text-xs text-white/40">
                            Page <span className="text-white/70">{currentPage}</span> of {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-white"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-white"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
