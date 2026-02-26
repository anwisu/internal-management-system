import React from 'react';
import { IconButton, Typography } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const next = () => {
        if (currentPage === totalPages) return;
        onPageChange(currentPage + 1);
    };

    const prev = () => {
        if (currentPage === 1) return;
        onPageChange(currentPage - 1);
    };

    return (
        <div className="flex items-center justify-center gap-6 py-6 w-full mt-4 border-t border-slate-100">
            <IconButton
                variant="outlined"
                size="sm"
                onClick={prev}
                disabled={currentPage === 1}
                className="rounded-full border-slate-200 hover:bg-slate-50 text-slate-500"
            >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
            </IconButton>
            <Typography color="gray" className="font-normal text-sm">
                Page <strong className="text-slate-900 mx-1">{currentPage}</strong> of{" "}
                <strong className="text-slate-900 mx-1">{totalPages}</strong>
            </Typography>
            <IconButton
                variant="outlined"
                size="sm"
                onClick={next}
                disabled={currentPage === totalPages}
                className="rounded-full border-slate-200 hover:bg-slate-50 text-slate-500"
            >
                <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
            </IconButton>
        </div>
    );
}

export default React.memo(Pagination);
