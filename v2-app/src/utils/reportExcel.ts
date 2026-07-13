import ExcelJS from 'exceljs'

function styleHeader(sheet: ExcelJS.Worksheet) {
    sheet.getRow(1).font = { bold: true }
    sheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: sheet.columns.length }
    }
}

// Sheet 1: Statistical Summary
export function buildSummarySheet(workbook: ExcelJS.Workbook, summary: any) {
    const sheet = workbook.addWorksheet('Statistical Summary')

    sheet.columns = [
        { key: 'label', width: 30},
        { key: 'value', width: 30}
    ]

    const addSummaryRow = (label: string, value: string | number, decimals = false) => {
        const row = sheet.addRow({ label, value })
        row.getCell(1).font = { bold: true }
        if (decimals && typeof value === 'number') {
            row.getCell(2).numFmt = '0.00'
        }
    }

    const addSectionTitle = (title: string) => {
        const row = sheet.addRow({ label: title });
        sheet.mergeCells(`A${row.number}:B${row.number}`);
        const cell = row.getCell(1);
        cell.font = { bold: true, size: 12 };
        cell.alignment = { horizontal: 'left' };
    };

    const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Ongoing';

    // Semester label
    addSectionTitle('Semester Info');
    addSummaryRow('Semester', summary.semesterLabel);
    addSummaryRow('Date Range', `${formatDate(summary.semesterStart)} – ${formatDate(summary.semesterEnd)}`);

    sheet.addRow({});

    // Session details
    addSectionTitle('Session Overview');
    addSummaryRow('Total Sessions', summary.totalSessions);
    addSummaryRow('Completed', summary.completed);
    addSummaryRow('Cancelled', summary.cancelled);
    addSummaryRow('Rejected', summary.rejected);
    addSummaryRow('No Show', summary.noShow);

    sheet.addRow({});

    // Student + mentor details
    addSectionTitle('Engagement');
    addSummaryRow('Total Hours Rendered', summary.totalHours);
    addSummaryRow('Unique Students Served', summary.uniqueStudents);
    addSummaryRow('Total Active Mentors', summary.activeMentors);

    sheet.addRow({});

    // Ratings
    addSectionTitle('Feedback');
    addSummaryRow('Total Feedbacks Received', summary.feedbackCount);
    addSummaryRow('Overall Average Rating', summary.averageRating, true);
}

// Sheet 2: Session Details
export function buildSessionSheet(workbook: ExcelJS.Workbook, rows: any[] ) {
    const sheet = workbook.addWorksheet('Session Details')

    sheet.columns = [
        { header: 'Date',       key: 'date',                    width: 15,   style: { numFmt: 'mm/dd/yyyy' } },
        { header: 'Start',      key: 'schedule_start',          width: 15,   style: { numFmt: 'h:mm AM/PM' } },
        { header: 'End',        key: 'schedule_end',            width: 15,   style: { numFmt: 'h:mm AM/PM' } },
        { header: 'Student',    key: 'student_name',            width: 35 },
        { header: 'Mentor',     key: 'mentor_name',             width: 35 },
        { header: 'Subject',    key: 'subject_code',            width: 20 },
        { header: 'Topic',      key: 'topic',                   width: 35 },
        { header: 'Mode',       key: 'tutorial_mode',           width: 40 },
        { header: 'Status',     key: 'booking_status_label',    width: 15 },
    ]

    rows.forEach((row) => sheet.addRow({
        ...row,
        date: row.date ? new Date(row.date) : null,
        schedule_start: row.schedule_start ? new Date(row.schedule_start) : null,
        schedule_end: row.schedule_end ? new Date(row.schedule_end) : null,
    }))
    styleHeader(sheet)
    return sheet
}

// Sheet 3: Feedback Details
export function buildFeedbackList(workbook: ExcelJS.Workbook, rows: any[]) {
    const sheet = workbook.addWorksheet('Feedback Details')

    sheet.columns = [
        { header: 'Date Submitted',     key: 'date_submitted',      width: 25, style: { numFmt: 'mm/dd/yyyy h:mm AM/PM' } },
        { header: 'Session Date',       key: 'date',                width: 15, style: { numFmt: 'mm/dd/yyyy' } },
        { header: 'Student',            key: 'student_name',        width: 35 },
        { header: 'Mentor',             key: 'mentor_name',         width: 35 },
        { header: 'Subject',            key: 'subject_code',        width: 20 },
        { header: 'Topic',              key: 'topic',               width: 35 },
        { header: 'Average Rating',     key: 'average_rating',      width: 18 },
        { header: 'Feedback',           key: 'feedback',            width: 40 },
    ]

    rows.forEach((row) => sheet.addRow({
        ...row,
        date_submitted: row.date_submitted ? new Date(row.date_submitted) : null,
        date: row.date ? new Date(row.date) : null,
    }))
    styleHeader(sheet)
    return sheet
}

// Sheet 4: Mentor Performance
export function buildMentorList(workbook: ExcelJS.Workbook, rows: any[]) {
    const sheet = workbook.addWorksheet('Mentor Performance')

    sheet.columns = [
        { header: 'Mentor',                 key: 'mentor_name',             width: 35 },
        { header: 'Program',                key: 'program',                 width: 50 },
        { header: 'Year Level',             key: 'year_level',              width: 15 },
        { header: 'Sessions Completed',     key: 'sessions_completed',      width: 22 },
        { header: 'Hours Rendered',         key: 'hours_rendered',          width: 18 },
        { header: 'Average Rating',         key: 'average_rating',          width: 18,      style: { numFmt: '0.00' } },
    ]

    rows.forEach((row) => sheet.addRow(row))
    styleHeader(sheet)
    return sheet
}