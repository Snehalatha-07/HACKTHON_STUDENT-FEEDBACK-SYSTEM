import React, { useState, useMemo } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { csvEscape } from '../../utils/data';

const AdminResponses = () => {
  const { feedbackResponses, feedbackForms, courses } = useFeedback();

  // Filters and UI state
  const [filterCourse, setFilterCourse] = useState('');
  const [filterForm, setFilterForm] = useState('');
  const location = window.location;
  const updateUrlParams = (course, form) => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (course) params.set('course', course); else params.delete('course');
      if (form) params.set('form', form); else params.delete('form');
      const qs = params.toString();
      const newUrl = window.location.pathname + (qs ? `?${qs}` : '');
      window.history.replaceState({}, '', newUrl);
    } catch (e) {
      // ignore
    }
  };

  // Apply URL query filter if present on initial load (e.g. /admin/responses?course=123)
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const course = params.get('course');
      const form = params.get('form');
      if (course) setFilterCourse(course);
      if (form) setFilterForm(form);
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [includeStudentId, setIncludeStudentId] = useState(false);
  const [sortKey, setSortKey] = useState('submittedAt');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);

  // Enrich responses with resolved names for easier filtering/sorting
  const enriched = useMemo(() => {
    return feedbackResponses.map(r => {
      const form = feedbackForms.find(f => f.id === r.formId) || null;
      const course = courses.find(c => c.id === r.courseId) || null;
      return {
        ...r,
        formTitle: form ? form.title : r.formId,
        courseName: course ? course.name : r.courseId
      };
    });
  }, [feedbackResponses, feedbackForms, courses]);

  // Apply filters, search, and sorting
  const processed = useMemo(() => {
    let list = enriched.slice();

    if (filterCourse) list = list.filter(r => r.courseId === filterCourse);
    if (filterForm) list = list.filter(r => r.formId === filterForm);

    if (searchTerm && searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(r => {
        return (
          (r.comment || '').toLowerCase().includes(q) ||
          (r.studentId || '').toLowerCase().includes(q) ||
          (r.courseName || '').toLowerCase().includes(q) ||
          (r.formTitle || '').toLowerCase().includes(q)
        );
      });
    }

    // Sorting
    list.sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      if (sortKey === 'submittedAt') {
        const av = aVal ? new Date(aVal).getTime() : 0;
        const bv = bVal ? new Date(bVal).getTime() : 0;
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      if (sortKey === 'rating') {
        const av = Number(aVal || 0);
        const bv = Number(bVal || 0);
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      const av = String(aVal).toLowerCase();
      const bv = String(bVal).toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [enriched, filterCourse, filterForm, searchTerm, sortKey, sortDir]);

  const total = processed.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const paged = processed.slice((page - 1) * perPage, page * perPage);

  const exportCsv = () => {
    // Headers: add human-friendly names
    const headers = ['Response ID', 'Form Title', 'Course Name', 'Student ID', 'Anonymous', 'Rating', 'Comment', 'Submitted At'];

    const rows = processed.map(r => {
      // Respect anonymity: only include studentId when includeStudentId is true and response is not anonymous
      const studentField = includeStudentId && !r.anonymous ? r.studentId : '';
      return [
        csvEscape(r.id),
        csvEscape(r.formTitle || ''),
        csvEscape(r.courseName || ''),
        csvEscape(studentField || ''),
        csvEscape(Boolean(r.anonymous)),
        csvEscape(r.rating ?? ''),
        csvEscape(r.comment || ''),
        csvEscape(r.submittedAt || '')
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feedback_responses.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setFilterCourse('');
    setFilterForm('');
    setSearchTerm('');
    setPage(1);
  };

  return (
    <div className="admin-responses">
      <div className="dashboard-header">
        <h2>Feedback Responses</h2>
        <p>View, filter and export collected feedback responses</p>
      </div>

      <div className="filters-row">
        <label>
          Course:
          <select value={filterCourse} onChange={e => { setFilterCourse(e.target.value); setPage(1); updateUrlParams(e.target.value, filterForm); }}>
            <option value="">All courses</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>

        <label>
          Form:
          <select value={filterForm} onChange={e => { setFilterForm(e.target.value); setPage(1); updateUrlParams(filterCourse, e.target.value); }}>
            <option value="">All forms</option>
            {feedbackForms.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
          </select>
        </label>

        <label style={{ flex: 1 }}>
          Search:
          <input type="search" value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(1); }} placeholder="Search comments, student, course, form" />
        </label>

        <label title="Include student ID column in CSV (anonymous responses remain blank)">
          <input type="checkbox" checked={includeStudentId} onChange={e => setIncludeStudentId(e.target.checked)} /> Include student IDs
        </label>

        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
          <button className="btn btn-outline" onClick={() => { clearFilters(); updateUrlParams('', ''); }}>Reset Filters</button>
          <button className="btn btn-outline" onClick={clearFilters}>Clear</button>
          <button className="btn btn-primary" onClick={exportCsv} disabled={processed.length === 0}>Export CSV</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <div>
          <label>Sort:</label>
          <select value={sortKey} onChange={e => setSortKey(e.target.value)}>
            <option value="submittedAt">Submitted At</option>
            <option value="rating">Rating</option>
            <option value="courseName">Course</option>
            <option value="formTitle">Form</option>
          </select>
          <button className="btn btn-small" onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}>{sortDir === 'asc' ? '↑' : '↓'}</button>
        </div>

        <div>
          <label>Per page:</label>
          <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <small>{total} responses</small>
        </div>
      </div>

      <div className="responses-table">
        {paged.length === 0 ? (
          <div className="empty-state"><p>No responses match the selected filters.</p></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Form</th>
                <th>Course</th>
                <th>Student</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(r => (
                <tr key={r.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{r.id}</td>
                  <td>{r.formTitle}</td>
                  <td>{r.courseName}</td>
                  <td>{r.anonymous ? 'Anonymous' : (r.studentId || '-')}</td>
                  <td>{r.rating ?? '-'}</td>
                  <td style={{ maxWidth: 300, whiteSpace: 'normal' }}>{r.comment || '-'}</td>
                  <td>{r.submittedAt ? new Date(r.submittedAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12, alignItems: 'center' }}>
        <button className="btn btn-small" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button className="btn btn-small" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default AdminResponses;
