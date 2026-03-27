import { useState, useEffect } from 'react';
import { Eye, Download, Search, Filter, X, ChevronDown, ChevronUp, BarChart2, FileDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { assessmentService } from '../../services/assessmentService';
import type { AssessmentResult } from '../../types/assessment';

const SCORE_LEVEL = (pct: number) => {
  if (pct >= 80) return { label: 'Excellent', color: 'bg-green-100 text-green-700' };
  if (pct >= 60) return { label: 'Good', color: 'bg-blue-100 text-blue-700' };
  if (pct >= 40) return { label: 'Making Progress', color: 'bg-yellow-100 text-yellow-700' };
  return { label: 'Needs Support', color: 'bg-red-100 text-red-700' };
};

const AssessmentResultsAdmin = () => {
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [motherTongueFilter, setMotherTongueFilter] = useState('');
  const [selectedResult, setSelectedResult] = useState<AssessmentResult | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [showStats, setShowStats] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    loadResults();
  }, [search, motherTongueFilter, currentPage]);

  useEffect(() => {
    assessmentService.admin.getStatistics()
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, []);

  const loadResults = async () => {
    setIsLoading(true);
    try {
      const response = await assessmentService.admin.getResults({
        q: search || undefined,
        mother_tongue: motherTongueFilter || undefined,
        page: currentPage,
        per_page: 20,
      });
      if (response.success) {
        setResults(response.data);
        setMeta(response.meta);
      }
    } catch {
      toast.error('Failed to load assessment results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (result: AssessmentResult) => {
    try {
      const response = await assessmentService.admin.getResult(result.id);
      setSelectedResult(response.data);
    } catch {
      toast.error('Failed to load result details');
    }
  };

  const handleDownloadPdf = async (result: AssessmentResult) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${baseUrl}/assessment_results/${result.id}/download_pdf`, {
      headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
    });
    if (!response.ok) return;
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment_${result.child_name}_${result.id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const ageDisplay = (months: number) => {
    const y = Math.floor(months / 12);
    const m = months % 12;
    return m > 0 ? `${y}y ${m}m` : `${y}y`;
  };

  const clearFilters = () => {
    setSearch('');
    setMotherTongueFilter('');
    setCurrentPage(1);
  };

  const handleExportCsv = () => {
    if (results.length === 0) {
      toast.error('No results to export');
      return;
    }
    const headers = ['Child Name', 'Age (months)', 'Mother Tongue', 'Assessment', 'Score %', 'Level', 'PDF Downloads', 'User Name', 'User Email', 'Completed At'];
    const rows = results.map(r => [
      r.child_name,
      r.child_age_months,
      r.mother_tongue || '',
      r.assessment?.title || '',
      Math.round(r.percentage_score),
      SCORE_LEVEL(r.percentage_score).label,
      r.pdf_download_count ?? 0,
      r.user_name || '',
      r.user_email || '',
      r.completed_at ? new Date(r.completed_at).toLocaleString('en-IN') : '',
    ]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment_results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-warmgray-800">Assessment Results</h1>
          <p className="text-warmgray-600 mt-1">All child assessment submissions and scores</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 border-2 border-teal text-teal font-semibold rounded-xl"
          >
            <FileDown className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-gradient text-white font-semibold rounded-xl shadow-soft"
          >
            <BarChart2 className="h-4 w-4" />
            {showStats ? 'Hide Stats' : 'View Stats'}
          </button>
        </div>
      </div>

      {/* Stats Panel */}
      {showStats && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-talkie p-4 text-center">
            <p className="text-3xl font-bold text-teal">{stats.total}</p>
            <p className="text-sm text-warmgray-600 mt-1">Total Assessments</p>
          </div>
          <div className="card-talkie p-4 text-center">
            <p className="text-3xl font-bold text-teal">{stats.average_score}</p>
            <p className="text-sm text-warmgray-600 mt-1">Avg Score</p>
          </div>
          <div className="card-talkie p-4 text-center">
            <p className="text-3xl font-bold text-teal">{stats.total_pdf_downloads}</p>
            <p className="text-sm text-warmgray-600 mt-1">PDF Downloads</p>
          </div>
          <div className="card-talkie p-4 text-center">
            <p className="text-3xl font-bold text-teal">
              {Object.keys(stats.by_assessment || {}).length}
            </p>
            <p className="text-sm text-warmgray-600 mt-1">Assessment Types</p>
          </div>

          {/* By Assessment breakdown */}
          {Object.keys(stats.by_assessment || {}).length > 0 && (
            <div className="card-talkie p-4 col-span-2">
              <p className="text-sm font-bold text-warmgray-700 mb-2">By Assessment</p>
              {Object.entries(stats.by_assessment).map(([title, count]: any) => (
                <div key={title} className="flex justify-between text-sm py-1 border-b border-warmgray-100 last:border-0">
                  <span className="text-warmgray-700 truncate mr-2">{title}</span>
                  <span className="font-semibold text-teal">{count}</span>
                </div>
              ))}
            </div>
          )}

          {/* By Mother Tongue */}
          {Object.keys(stats.by_mother_tongue || {}).length > 0 && (
            <div className="card-talkie p-4 col-span-2">
              <p className="text-sm font-bold text-warmgray-700 mb-2">By Mother Tongue</p>
              {Object.entries(stats.by_mother_tongue).map(([lang, count]: any) => (
                <div key={lang} className="flex justify-between text-sm py-1 border-b border-warmgray-100 last:border-0">
                  <span className="text-warmgray-700">{lang}</span>
                  <span className="font-semibold text-teal">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="card-talkie p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warmgray-400" />
          <input
            type="text"
            placeholder="Search by child name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 border-2 border-warmgray-200 rounded-lg text-sm focus:border-teal focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-warmgray-500" />
          <select
            value={motherTongueFilter}
            onChange={(e) => { setMotherTongueFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 border-2 border-warmgray-200 rounded-lg text-sm focus:border-teal focus:outline-none"
          >
            <option value="">All Mother Tongues</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Marathi">Marathi</option>
            <option value="Odia">Odia</option>
            <option value="Konkani">Konkani</option>
            <option value="Gujarati">Gujarati</option>
          </select>
        </div>

        {(search || motherTongueFilter) && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-coral hover:text-coral-dark">
            <X className="h-4 w-4" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
          <p className="mt-4 text-warmgray-600">Loading...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="card-talkie p-12 text-center text-warmgray-500">No assessment results found.</div>
      ) : (
        <div className="card-talkie overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-warmgray-50 border-b-2 border-warmgray-200">
                  <th className="text-left px-4 py-3 font-semibold text-warmgray-700">Child</th>
                  <th className="text-left px-4 py-3 font-semibold text-warmgray-700">Age</th>
                  <th className="text-left px-4 py-3 font-semibold text-warmgray-700">Mother Tongue</th>
                  <th className="text-left px-4 py-3 font-semibold text-warmgray-700">Assessment</th>
                  <th className="text-left px-4 py-3 font-semibold text-warmgray-700">Score</th>
                  <th className="text-left px-4 py-3 font-semibold text-warmgray-700">Level</th>
                  <th className="text-left px-4 py-3 font-semibold text-warmgray-700">PDF DLs</th>
                  <th className="text-left px-4 py-3 font-semibold text-warmgray-700">User</th>
                  <th className="text-left px-4 py-3 font-semibold text-warmgray-700">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmgray-100">
                {results.map((result) => {
                  const level = SCORE_LEVEL(result.percentage_score);
                  return (
                    <tr key={result.id} className="hover:bg-warmgray-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-warmgray-800">{result.child_name}</td>
                      <td className="px-4 py-3 text-warmgray-600">{ageDisplay(result.child_age_months)}</td>
                      <td className="px-4 py-3 text-warmgray-600">{result.mother_tongue || '—'}</td>
                      <td className="px-4 py-3 text-warmgray-600 max-w-[150px] truncate">
                        {result.assessment?.title || '—'}
                      </td>
                      <td className="px-4 py-3 font-bold text-teal">
                        {Math.round(result.percentage_score)}%
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${level.color}`}>
                          {level.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-warmgray-600">
                        {result.pdf_download_count ?? 0}
                      </td>
                      <td className="px-4 py-3 text-warmgray-500 text-xs">
                        <div>{result.user_name || '—'}</div>
                        <div className="text-warmgray-400">{result.user_email || ''}</div>
                      </td>
                      <td className="px-4 py-3 text-warmgray-500 text-xs whitespace-nowrap">
                        {result.completed_at
                          ? new Date(result.completed_at).toLocaleDateString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewDetails(result)}
                            className="p-1.5 hover:bg-teal-light/30 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4 text-teal" />
                          </button>
                          <button
                            onClick={() => handleDownloadPdf(result)}
                            className="p-1.5 hover:bg-warmgray-100 rounded-lg transition-colors"
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4 text-warmgray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.total_pages > 1 && (
            <div className="px-4 py-3 border-t border-warmgray-100 flex items-center justify-between">
              <p className="text-sm text-warmgray-500">
                Page {meta.current_page} of {meta.total_pages} ({meta.total_count} total)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-warmgray-200 rounded-lg disabled:opacity-40 hover:bg-warmgray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(meta.total_pages, p + 1))}
                  disabled={currentPage === meta.total_pages}
                  className="px-3 py-1 text-sm border border-warmgray-200 rounded-lg disabled:opacity-40 hover:bg-warmgray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-soft-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-warmgray-200">
              <div>
                <h2 className="font-bold text-xl text-warmgray-900">{selectedResult.child_name}'s Result</h2>
                <p className="text-sm text-warmgray-500 mt-0.5">{selectedResult.assessment?.title}</p>
              </div>
              <button
                onClick={() => setSelectedResult(null)}
                className="p-2 hover:bg-warmgray-100 rounded-lg text-warmgray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Child Info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Child Name', selectedResult.child_name],
                  ['Age', ageDisplay(selectedResult.child_age_months)],
                  ['Mother Tongue', selectedResult.mother_tongue || '—'],
                  ['User', selectedResult.user_name || '—'],
                  ['Email', selectedResult.user_email || '—'],
                  ['Completed', selectedResult.completed_at
                    ? new Date(selectedResult.completed_at).toLocaleString('en-IN')
                    : '—'],
                  ['PDF Downloads', String(selectedResult.pdf_download_count ?? 0)],
                  ['Overall Score', `${Math.round(selectedResult.percentage_score)}% — ${SCORE_LEVEL(selectedResult.percentage_score).label}`],
                ].map(([label, value]) => (
                  <div key={label} className="bg-warmgray-50 p-3 rounded-lg">
                    <p className="text-xs text-warmgray-500 font-medium">{label}</p>
                    <p className="text-sm font-semibold text-warmgray-800 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Skill Breakdown */}
              {selectedResult.scores && Object.keys(selectedResult.scores).length > 0 && (
                <div>
                  <h3 className="font-bold text-warmgray-800 mb-3">Skill Area Breakdown</h3>
                  <div className="space-y-2">
                    {Object.entries(selectedResult.scores).map(([category, score]) => {
                      const max = selectedResult.category_max_scores?.[category] || 10;
                      const pct = Math.round((score / max) * 100);
                      return (
                        <div key={category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-warmgray-700 capitalize">{category.replace(/_/g, ' ')}</span>
                            <span className="font-semibold text-teal">{score}/{max}</span>
                          </div>
                          <div className="h-2 bg-warmgray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-teal-gradient rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {selectedResult.recommendations && (
                <div>
                  <h3 className="font-bold text-warmgray-800 mb-2">Recommendations</h3>
                  {(selectedResult.recommendations as any).message && (
                    <p className="text-sm text-warmgray-700 mb-3">{(selectedResult.recommendations as any).message}</p>
                  )}
                  {(selectedResult.recommendations as any).tips?.length > 0 && (
                    <ul className="space-y-1">
                      {(selectedResult.recommendations as any).tips.map((tip: string, i: number) => (
                        <li key={i} className="text-sm text-warmgray-700 flex gap-2">
                          <span className="text-teal font-bold">{i + 1}.</span> {tip}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Download PDF */}
              <button
                onClick={() => handleDownloadPdf(selectedResult)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-gradient text-white font-semibold rounded-xl"
              >
                <Download className="h-4 w-4" />
                Download PDF Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentResultsAdmin;
