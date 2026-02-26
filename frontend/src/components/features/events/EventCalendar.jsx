import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card } from '@material-tailwind/react';
import './EventCalendar.css';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

function EventCalendar({ events, onEventClick }) {
    // Map backend events to react-big-calendar format
    const calendarEvents = events.map(event => {
        // Determine end date. If not provided or same as start but shorter, just use start.
        let end = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
        // If end date is magically set before start date, fallback to start date
        if (end < new Date(event.startDate)) {
            end = new Date(event.startDate);
        }

        return {
            id: event._id,
            title: event.title,
            start: new Date(event.startDate),
            end: end,
            allDay: false,
            resource: event,
        }
    });

    const handleSelectEvent = (calEvent) => {
        if (onEventClick) {
            onEventClick(calEvent.resource);
        }
    };

    const eventStyleGetter = (event) => {
        let backgroundColor = '#3b82f6'; // blue (upcoming)
        if (event.resource.status === 'ongoing') backgroundColor = '#22c55e'; // green
        if (event.resource.status === 'completed') backgroundColor = '#64748b'; // gray
        if (event.resource.status === 'cancelled') backgroundColor = '#ef4444'; // red

        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    return (
        <Card className="p-4 rounded-2xl border border-white/70 bg-white/90 shadow-glass overflow-hidden h-[600px] rbc-card-override">
            <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%', fontFamily: 'inherit' }}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day', 'agenda']}
            />
        </Card>
    );
}

export default React.memo(EventCalendar);
