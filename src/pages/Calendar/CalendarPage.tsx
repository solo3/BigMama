import React, { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { he } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';
import { Event as FamilyEvent } from '../../types/models';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { useEvents } from '../../hooks/useData';
import { createEvent, deleteEvent } from '../../services/events';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import './Calendar.css';

const locales = {
    'he': he,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

export const CalendarPage: React.FC = () => {
    const { events, loading } = useEvents();
    const { familyId, user } = useAuth();
    const { addToast } = useToast();
    const [view, setView] = useState<View>(Views.MONTH);
    const [date, setDate] = useState(new Date());

    const mappedEvents = useMemo(() => {
        return events.map(event => ({
            id: event.id,
            title: event.title,
            start: event.startDate.toDate(),
            end: event.endDate.toDate(),
            allDay: event.isAllDay,
            resource: event,
        }));
    }, [events]);

    const handleSelectSlot = async ({ start, end }: { start: Date; end: Date }) => {
        const title = window.prompt('שם האירוע:');
        if (title && familyId && user) {
            try {
                await createEvent(familyId, {
                    title,
                    startDate: Timestamp.fromDate(start),
                    endDate: Timestamp.fromDate(end),
                    isAllDay: view === Views.MONTH,
                    assignees: [],
                    createdBy: user.uid,
                });
                addToast('אירוע נוצר בהצלחה', 'success');
            } catch (error) {
                console.error("Error creating event:", error);
                addToast("אירעה שגיאה ביצירת האירוע", 'error');
            }
        }
    };

    interface CalendarEvent {
        id: string;
        title: string;
        start: Date;
        end: Date;
        allDay: boolean;
        resource: FamilyEvent;
    }

    const handleSelectEvent = async (event: CalendarEvent) => {
        const action = window.prompt(`אירוע: ${event.title}\n[1] ערוך (לא מיושם)\n[2] מחק`);
        if (action === '2' && familyId) {
            if (window.confirm('למחוק את האירוע?')) {
                try {
                    await deleteEvent(familyId, event.id);
                    addToast('אירוע נמחק בהצלחה', 'success');
                } catch (error) {
                    console.error("Error deleting event:", error);
                    addToast("אירעה שגיאה במחיקת האירוע", 'error');
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="calendar-container">
                <h1 className="text-2xl font-bold mb-4 text-primary">לוח שנה משפחתי</h1>
                <LoadingSkeleton width="100%" height="calc(100vh - 200px)" borderRadius={8} />
            </div>
        );
    }

    return (
        <div className="calendar-container">
            <h1 className="text-2xl font-bold mb-4 text-primary">לוח שנה משפחתי</h1>
            <Calendar
                localizer={localizer}
                events={mappedEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc(100vh - 200px)' }}
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                culture="he"
                rtl={true}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable
                messages={{
                    date: 'תאריך',
                    time: 'זמן',
                    event: 'אירוע',
                    allDay: 'כל היום',
                    week: 'שבוע',
                    work_week: 'שבוע עבודה',
                    day: 'יום',
                    month: 'חודש',
                    previous: 'הקודם',
                    next: 'הבא',
                    today: 'היום',
                    agenda: 'סדר יום',
                    showMore: (total) => `+ עוד ${total}`
                }}
            />
        </div>
    );
};
