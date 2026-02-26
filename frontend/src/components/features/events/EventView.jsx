import React from 'react';
import { Chip, Avatar } from '@material-tailwind/react';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiDollarSign } from 'react-icons/fi';
import { formatDateTime } from '../../../utils/formatters';

/**
 * Event View component
 * Read-only display of event details for the Modal
 */
function EventView({ event }) {
    if (!event) return null;

    const statusColorMap = {
        upcoming: 'blue',
        ongoing: 'green',
        completed: 'gray',
        cancelled: 'red',
    };

    return (
        <div className="space-y-6">
            {/* Header Image Area */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                {(event.imageUrl?.url || event.imageUrl) ? (
                    <img
                        src={event.imageUrl?.url || event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-white flex items-center justify-center text-primary-500">
                        <FiCalendar className="w-16 h-16 opacity-50" aria-hidden="true" />
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <Chip
                        value={event.status}
                        color={statusColorMap[event.status] || 'gray'}
                        className="bg-white/90 text-slate-700 shadow backdrop-blur-sm"
                    />
                </div>
            </div>

            {/* Main Info */}
            <div className="space-y-5 px-2">
                <div>
                    <h3 className="text-3xl font-bold text-slate-900">{event.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3 text-slate-600 font-medium">
                        {event.startDate && (
                            <div className="flex items-center gap-2">
                                <FiClock className="w-5 h-5 text-primary-500" />
                                <span>{formatDateTime(event.startDate)}</span>
                            </div>
                        )}
                        {event.venue && (
                            <div className="flex items-center gap-2">
                                <FiMapPin className="w-5 h-5 text-primary-500" />
                                <span>{event.venue}</span>
                            </div>
                        )}
                    </div>
                </div>

                {event.description && (
                    <div className="prose prose-slate max-w-none">
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Details</h4>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100">{event.description}</p>
                    </div>
                )}

                {/* Additional Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-100">
                    <div className="space-y-1">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Capacity</p>
                        <div className="flex items-center gap-2 text-slate-800 font-medium">
                            <FiUsers className="w-4 h-4 text-slate-400" />
                            <span>{event.capacity ? event.capacity.toLocaleString() : 'N/A'}</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Ticket Price</p>
                        <div className="flex items-center gap-2 text-slate-800 font-medium">
                            <FiDollarSign className="w-4 h-4 text-slate-400" />
                            <span>{event.ticketPrice ? `$${event.ticketPrice.toFixed(2)}` : 'Free'}</span>
                        </div>
                    </div>
                </div>

                {/* Artists Lineup */}
                {event.artists && event.artists.length > 0 && (
                    <div className="space-y-3 pt-2">
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Lineup</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {event.artists.map((artist) => (
                                <div key={artist._id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <Avatar
                                        src={artist.imageUrl?.url || artist.imageUrl}
                                        alt={artist.name}
                                        size="md"
                                        variant="circular"
                                        className="ring-2 ring-primary-50"
                                    />
                                    <div>
                                        <p className="font-semibold text-slate-800">{artist.name}</p>
                                        {artist.genre && (
                                            <p className="text-xs text-slate-500 line-clamp-1">{artist.genre}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default React.memo(EventView);
