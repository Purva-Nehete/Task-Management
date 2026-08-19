# Part 2: AbleSpace Take Data Workflow

This document records the product understanding portion of the assessment. The workflow below is based on the supplied AbleSpace Caseload reference screenshot and should be verified against the live product before submission.

## Workflow In My Own Words

1. Open the AbleSpace workspace and select **Caseload** from the left navigation.
2. The page opens on the student list, with tabs for students, groups, and unassigned records.
3. Use the search field to find a student by name. The table exposes identifying information and operational fields such as IEP due date, evaluation due date, collaborators, service time, and school.
4. Review the row for the intended student and select **Take Data** in the Actions column.
5. The Take Data action starts the data-entry workflow for that student. The user should record the relevant observation or service data, submit it, and return to the caseload context.
6. Use the row action menu for additional student-specific actions where available.

## Key Product Concepts

- The Caseload table is the starting point for locating a student.
- Search reduces the cost of finding a specific student in a large caseload.
- The table combines planning dates, collaboration context, service time, and school information so staff can make a decision without opening every record.
- **Take Data** is the primary action because it moves from caseload review into the student data-capture workflow.

## UX/UI Improvement Suggestions

- Preserve the student name and a compact breadcrumb in the Take Data screen so users always know whose record they are editing.
- Show a clear success state after saving, including when the data was saved and whether the user can add another entry.
- Add row-level loading and disabled states to prevent duplicate submissions.
- Make the Actions column sticky or keep the Take Data action visible on narrow screens.
- Add explicit filters for school, service type, due-date range, and collaborator, with visible active-filter chips.
- Provide keyboard navigation and a descriptive focus state for the table, search field, and Take Data action.
- Confirm unsaved changes before leaving a partially completed data-entry form.
- Support empty, loading, error, and permission-denied states with actionable messages.

## Evidence To Add Before Submission

The assessment requires either screenshots with explanations or a video walkthrough. Add one of the following before submitting:

- Screenshots of Caseload, the selected student's Take Data screen, the saved state, and the return path, with captions tied to the steps above.
- A short screen recording showing the same workflow from Caseload search through data submission.

Store screenshots in `docs/part-2/` and link them here, or add the video URL here. Do not include real student-identifying information in captured evidence.
