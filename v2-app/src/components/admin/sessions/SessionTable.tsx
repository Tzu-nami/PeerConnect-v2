import { useState } from 'react';
import SearchBar from '@/components/ui/SearchBar';
import SessionTableRow from './SessionTableRow';

// Icons
import { MdArrowUpward, MdArrowDownward, MdUnfoldMore, MdKeyboardArrowDown } from "react-icons/md";

import type { AdminSession } from '@/types/admin';

interface SessionTableProps {
  sessions: AdminSession[];
  totalCount: number;
  searchQuery: string;
  onSearch: (q: string) => void;
  statusFilters: string[];
  onStatusChange: (statuses: string[]) => void;
  availableStatuses: string[];
  sortCol: string;
  sortDir: 'asc' | 'desc';
  onSort: (col: string) => void;
  onView: (s: AdminSession) => void;
  onEdit: (s: AdminSession) => void;
  onCancel: (s: AdminSession) => void;
}

function SortIcon({ col, sortCol, sortDir }: { col: string, sortCol: string, sortDir: 'asc' | 'desc' }) {
  if (sortCol !== col) return <MdUnfoldMore className="text-text-brown-light" />;
  return sortDir === 'asc' ? <MdArrowUpward className="text-text-brown" /> : <MdArrowDownward className="text-text-brown" />;
}


export default function SessionTable({ 
  sessions, totalCount, searchQuery, onSearch, statusFilters, onStatusChange, availableStatuses, sortCol, sortDir, onSort, onView, onEdit, onCancel 
}: SessionTableProps) {
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Status filters
  const toggleStatus = (status: string) => {
    if (statusFilters.includes(status)) {
      onStatusChange(statusFilters.filter(s => s !== status));
    } else {
      onStatusChange([...statusFilters, status]);
    }
  };

  return (
    <div className="rounded-xl shadow-md border border-cream-border mt-5 bg-cream">
      {/* Header, search, filters */}
      <div className="flex flex-wrap gap-4 justify-between items-center p-5">
        <div>
          <h2 className="font-bold text-lg text-text-brown">Session List</h2>
          <p className="text-sm text-text-brown-light font-medium">{totalCount} Result{totalCount !==1 ? 's' : ''} found</p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          <SearchBar 
            value={searchQuery} 
            onChange={onSearch} 
            placeholder="Search sessions..." 
            className="w-56" 
          />
          <div className="relative">
            {/* Status filters */}
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4 py-2 text-xs font-medium text-text-brown border border-cream-border rounded-lg bg-white outline-none focus:ring-1 focus:border-text-brown-light focus:ring-text-brown-light/30 transition-shadow h-[36px] min-w-[160px] flex items-center justify-between gap-3 shadow-sm cursor-pointer"
            >
              <span>
                {statusFilters.length === 0 
                  ? 'All Statuses' 
                  : statusFilters.length === 1
                    ? (statusFilters[0] === 'no_show' ? 'No Show' : statusFilters[0].charAt(0).toUpperCase() + statusFilters[0].slice(1))
                    : `${statusFilters.length} Selected`}
              </span>
              <MdKeyboardArrowDown className={`text-xl text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)} 
                />
                
                <div className="absolute right-0 mt-2 w-48 bg-white border border-cream-border rounded-xl shadow-xl z-50 py-2 overflow-hidden">
                  {availableStatuses.map(status => (
                    <label 
                      key={status} 
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream cursor-pointer transition"
                    >
                      <input 
                        type="checkbox"
                        checked={statusFilters.includes(status)}
                        onChange={() => toggleStatus(status)}
                        className="w-4 h-4 text-up-maroon border-cream-border rounded focus:ring-up-maroon/30 cursor-pointer"
                      />
                      <span className="text-sm font-bold text-slate-700 capitalize">
                        {status === 'no_show' ? 'No Show' : status}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border-t border-cream-border overflow-x-auto">
        <table className="w-full text-left text-sm table-fixed min-w-[800px]">
          <thead className="border-b border-cream-border bg-cream-dark">
            <tr>
              <th className="px-5 py-3 w-[20%]">
                <button onClick={() => onSort('date')} className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-brown transition cursor-pointer ${sortCol === 'date' ? 'font-extrabold text-text-brown' : 'font-bold text-text-brown-light'}`}>
                  Date & Time <SortIcon col="date" sortCol={sortCol} sortDir={sortDir} />
                </button>
              </th>
              <th className="px-5 py-3 w-[18%]">
                <button onClick={() => onSort('student')} className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-brown transition cursor-pointer ${sortCol === 'student' ? 'font-extrabold text-text-brown' : 'font-bold text-text-brown-light'}`}>
                  Student <SortIcon col="student" sortCol={sortCol} sortDir={sortDir} />
                </button>
              </th>
              <th className="px-5 py-3 w-[15%]">
                <button onClick={() => onSort('mentor')} className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-brown transition cursor-pointer ${sortCol === 'mentor' ? 'font-extrabold text-text-brown' : 'font-bold text-text-brown-light'}`}>
                  Mentor <SortIcon col="mentor" sortCol={sortCol} sortDir={sortDir} />
                </button>
              </th>
              <th className="px-5 py-3 w-[15%]">
                <button onClick={() => onSort('subject')} className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-brown transition cursor-pointer ${sortCol === 'subject' ? 'font-extrabold text-text-brown' : 'font-bold text-text-brown-light'}`}>
                  Subject <SortIcon col="subject" sortCol={sortCol} sortDir={sortDir} />
                </button>
              </th>
              <th className="px-5 py-3 w-[12%] text-center">
                <button onClick={() => onSort('status')} className={`flex items-center gap-1 text-xs uppercase tracking-wider hover:text-text-brown transition cursor-pointer ${sortCol === 'status' ? 'font-extrabold text-text-brown' : 'font-bold text-text-brown-light'}`}>
                  Status <SortIcon col="status" sortCol={sortCol} sortDir={sortDir} />
                </button>
              </th>
              <th className="px-5 py-3 w-[10%] text-xs font-bold text-text-brown-light uppercase tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sessions.length > 0 ? sessions.map(s => (
              <SessionTableRow 
                key={s.id} 
                session={s} 
                onView={onView} 
                onEdit={onEdit} 
                onCancel={onCancel} 
              />
            )) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-sm text-text-brown-light italic">
                  <p className="text-sm font-semibold text-slate-500">No sessions match your filters.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}