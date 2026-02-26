import React from 'react';
import { Chip, Avatar } from '@material-tailwind/react';
import { BsMegaphone } from "react-icons/bs";
import { FiClock, FiUser } from 'react-icons/fi';
import { formatDateTime } from '../../../utils/formatters';
import DOMPurify from 'dompurify';

/**
 * Announcement View component
 * Read-only display of announcement details for the Modal
 */
function AnnouncementView({ announcement }) {
    if (!announcement) return null;

    const priorityColorMap = {
        high: 'red',
        medium: 'amber',
        low: 'blue',
    };

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-primary-50/50 border border-primary-100 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-primary-600">
                        <BsMegaphone className="w-8 h-8" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-2xl sm:text-3xl font-bold text-blue-gray-900 leading-tight">
                            {announcement.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-blue-gray-500 pt-1">
                            {announcement.author && (
                                <div className="flex items-center gap-1.5">
                                    <FiUser className="w-4 h-4" />
                                    <span>By {announcement.author}</span>
                                </div>
                            )}
                            {announcement.createdAt && (
                                <div className="flex items-center gap-1.5">
                                    <FiClock className="w-4 h-4" />
                                    <span>{formatDateTime(announcement.createdAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 items-end">
                    <Chip
                        value={announcement.priority}
                        color={priorityColorMap[announcement.priority] || "gray"}
                        className="rounded-full font-bold shadow-sm"
                    />
                    {announcement.isActive && (
                        <Chip
                            value="Active"
                            color="green"
                            variant="ghost"
                            className="rounded-full"
                        />
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="px-2">
                <div className="prose prose-slate prose-lg max-w-none">
                    <div
                        className="bg-white p-6 sm:p-8 rounded-2xl border border-blue-gray-100 shadow-soft-sm leading-relaxed text-blue-gray-700 font-medium quill-content"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(announcement.content) }}
                    />
                </div>
            </div>
        </div>
    );
}

export default React.memo(AnnouncementView);
