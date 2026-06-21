interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // if (totalPages <= 1) return null;

    const getPages = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Start page
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            }

            // End page
            else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            }

            // Middle page
            else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    const pages = getPages();

    return (
        <div className="mt-4 flex justify-center items-center gap-2">
            {/* Previous */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-slate-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">
                    <i className="fa-solid fa-chevron-left text-[10px]"></i>
            </button>

            {/* Pages */}
            {pages.map((page, index) => {
                if (page === '...') {
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className="w-7 h-7 flex items-center justify-center text-[11px] font-bold text-gray-400 tracking-widest shrink-0"
                            >
                            ...
                        </span>
                    );
                }

                return (
                    <button
                        key={`page-${page}`}
                        onClick={() => onPageChange(page as number)}
                        className={`w-8 h-8 text-xs font-bold rounded-lg transition ${
                            currentPage === page ? 'bg-sidebar-green text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-slate-500 hover:bg-gray-100'
                        }`}
                        >
                            {page}
                    </button>
                );
            })}

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-slate-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">
                    <i className="fa-solid fa-chevron-right text-[10px]"></i>
            </button>
        </div>
    );
}