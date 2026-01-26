module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/api/generate-study-timetable/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
// Study focus areas by subject for diverse learning topics
const focusAreas = {
    'Mathematics': [
        'Algebra fundamentals',
        'Geometry concepts',
        'Calculus practice',
        'Problem-solving drills',
        'Review formulas'
    ],
    'Physics': [
        'Mechanics principles',
        'Thermodynamics',
        'Electromagnetism',
        'Wave motion',
        'Quantum basics'
    ],
    'Chemistry': [
        'Atomic structure',
        'Bonding theory',
        'Stoichiometry',
        'Reactions',
        'Organic synthesis'
    ],
    'Biology': [
        'Cell biology',
        'Genetics',
        'Evolution',
        'Ecology',
        'Human anatomy'
    ],
    'English': [
        'Literature analysis',
        'Grammar rules',
        'Essay writing',
        'Vocabulary building',
        'Reading comprehension'
    ],
    'History': [
        'Timeline events',
        'Historical analysis',
        'Key figures',
        'Cause and effect',
        'Primary sources'
    ],
    'Science': [
        'Experimental methods',
        'Data analysis',
        'Lab techniques',
        'Scientific reasoning',
        'Review concepts'
    ],
    'Computer Science': [
        'Programming concepts',
        'Data structures',
        'Algorithms',
        'System design',
        'Debug exercises'
    ],
    'Economics': [
        'Microeconomics',
        'Macroeconomics',
        'Market analysis',
        'Policy implications',
        'Case studies'
    ],
    'Literature': [
        'Text analysis',
        'Themes exploration',
        'Character development',
        'Writing style',
        'Comparative study'
    ]
};
// Get rotating focus area for a subject
function getSubjectFocus(subject, dayNumber) {
    const areas = focusAreas[subject] || focusAreas['Science'];
    return areas[(dayNumber - 1) % areas.length];
}
// Generate intelligent study timetable without requiring AI
function generateSmartTimetable(subjects, examDate, daysUntilExam) {
    const today = new Date(examDate);
    today.setDate(today.getDate() - daysUntilExam);
    const timetable = [];
    const daysToSchedule = Math.min(daysUntilExam, 30);
    // Calculate hours per day based on number of subjects and days
    const totalStudyHours = subjects.length * daysToSchedule * 2 // 2 hours per subject per cycle
    ;
    const baseHoursPerDay = Math.max(3, Math.min(8, Math.ceil(totalStudyHours / daysToSchedule)));
    // Spaced repetition schedule - increase intensity as exam approaches
    const getIntensityFactor = (dayIndex)=>{
        const percentThroughStudy = dayIndex / daysToSchedule;
        if (percentThroughStudy < 0.3) return 0.8 // Light phase
        ;
        if (percentThroughStudy < 0.7) return 1.0 // Normal phase
        ;
        return 1.3 // Intense phase (closer to exam)
        ;
    };
    // Time slots for better cognitive load management
    const timeSlots = [
        {
            start: '9:00 AM',
            end: '11:00 AM',
            period: 'morning'
        },
        {
            start: '2:00 PM',
            end: '4:00 PM',
            period: 'afternoon'
        },
        {
            start: '6:00 PM',
            end: '8:00 PM',
            period: 'evening'
        }
    ];
    for(let day = 0; day < daysToSchedule; day++){
        const currentDate = new Date(today);
        currentDate.setDate(currentDate.getDate() + day);
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayEntry = {
            day: day + 1,
            date: dateStr,
            sessions: [],
            totalHours: 0
        };
        // Include rest day every 5-6 days
        const isRestDay = (day + 1) % 6 === 0 && day < daysToSchedule - 2;
        if (isRestDay) {
            // Light review session only
            dayEntry.sessions.push({
                subject: subjects[day % subjects.length],
                duration: 1.5,
                focus: `Light review and consolidation of ${subjects[day % subjects.length]} concepts`,
                timeSlot: '10:00 AM - 11:30 AM'
            });
            dayEntry.totalHours = 1.5;
        } else {
            // Regular study day with multiple sessions
            const intensityFactor = getIntensityFactor(day);
            const dayHours = Math.round(baseHoursPerDay * intensityFactor * 10) / 10;
            // Distribute subjects across available slots
            const subjectOrder = subjects.map((_, index)=>(index + Math.floor(day / subjects.length)) % subjects.length);
            const sessionsCount = Math.min(Math.ceil(dayHours / 1.5), 3);
            for(let sessionIndex = 0; sessionIndex < sessionsCount; sessionIndex++){
                const subjectIndex = subjectOrder[sessionIndex % subjects.length];
                const subject = subjects[subjectIndex];
                const slot = timeSlots[sessionIndex % timeSlots.length];
                // Duration based on session position and study intensity
                const sessionDuration = Math.round(dayHours / sessionsCount * 10) / 10;
                dayEntry.sessions.push({
                    subject,
                    duration: sessionDuration,
                    focus: getSubjectFocus(subject, day + 1),
                    timeSlot: `${slot.start} - ${new Date(`2000-01-01 ${slot.start}`).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }).replace(/:\d{2}\s/, ':')}00 ${slot.start.includes('AM') ? 'AM' : 'PM'}`
                });
                dayEntry.totalHours += sessionDuration;
            }
        }
        timetable.push(dayEntry);
    }
    return timetable;
}
async function POST(req) {
    try {
        const { subjects, examDate, daysUntilExam } = await req.json();
        if (!subjects || !Array.isArray(subjects) || subjects.length === 0 || !examDate) {
            return Response.json({
                error: 'Missing required fields: subjects (array) and examDate'
            }, {
                status: 400
            });
        }
        if (daysUntilExam <= 0) {
            return Response.json({
                error: 'Exam date must be in the future'
            }, {
                status: 400
            });
        }
        // Generate smart timetable using intelligent algorithm
        const timetable = generateSmartTimetable(subjects, examDate, daysUntilExam);
        return Response.json({
            timetable
        });
    } catch (error) {
        console.error('Error generating timetable:', error);
        return Response.json({
            error: 'Failed to generate study timetable'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6232a5c3._.js.map