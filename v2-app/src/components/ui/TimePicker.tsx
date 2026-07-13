import { useState, useEffect, useRef } from 'react';
import { FaClock, FaChevronUp, FaChevronDown } from 'react-icons/fa6';

interface TimePickerProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

// Allowed hours
const getValidHours = (p: 'AM' | 'PM') => p === 'AM' ? [8, 9, 10, 11] : [12, 1, 2, 3, 4, 5, 6];

export default function TimePicker({ value, onChange, placeholder = "Select time" }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const parseValue = (v: string) => {
    if (!v) return { h: 8, m: 0, p: 'AM' as const };
    const [parsedH, parsedM] = v.split(':').map(Number);
    if (isNaN(parsedH) || isNaN(parsedM)) return { h: 8, m: 0, p: 'AM' as const };
    
    const p = parsedH >= 12 ? 'PM' : 'AM';
    const h = parsedH % 12 || 12;

    return { h, m: parsedM, p: p as 'AM' | 'PM' };
  };

  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [hourInput, setHourInput] = useState('08');
  const [minInput, setMinInput] = useState('00');

  useEffect(() => {
    if (value) {
      const { h, m, p } = parseValue(value);
      setHour(h);
      setMinute(m);
      setPeriod(p);
      setHourInput(String(h).padStart(2, '0'));
      setMinInput(String(m).padStart(2, '0'));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const commit = (h: number, m: number, p: 'AM' | 'PM') => {
    let valH = h;
    if (p === 'AM' && h === 12) valH = 0;
    if (p === 'PM' && h < 12) valH = h + 12;
    const formatted = `${String(valH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    onChange(formatted);
  };

  const handleToggle = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && !value) commit(8, 0, 'AM');
  };

  // Hours
  const changeHour = (direction: 'up' | 'down') => {
    const valid = getValidHours(period);
    const idx = valid.indexOf(hour);
    let nextIdx = direction === 'up' ? (idx + 1) % valid.length : (idx - 1 + valid.length) % valid.length;
    if (idx === -1) nextIdx = 0;
    
    const nextHour = valid[nextIdx];
    setHour(nextHour);
    setHourInput(String(nextHour).padStart(2, '0'));
    commit(nextHour, minute, period);
  };

  // Bounded within 8-6
  const handleHourBlur = () => {
    let h = parseInt(hourInput, 10);
    if (isNaN(h)) h = hour;
    
    if (period === 'AM') {
      if (h < 8 || h === 12) h = 8;
      else if (h > 11) h = 11;
    } else {
      if (h > 6 && h < 12) h = 6;
      else if (h === 0) h = 12;
    }

    setHour(h);
    setHourInput(String(h).padStart(2, '0'));
    commit(h, minute, period);
  };

  // Minutes in 15 minute intervals
  const changeMinute = (direction: 'up' | 'down') => {
    let m = minute;
    if (direction === 'up') {
      m = (Math.floor(m / 15) * 15 + 15) % 60;
    } else {
      m = Math.ceil(m / 15) * 15 - 15;
      if (m < 0) m = 45;
    }
    setMinute(m);
    setMinInput(String(m).padStart(2, '0'));
    commit(hour, m, period);
  };

  const handleMinBlur = () => {
    let m = parseInt(minInput, 10);
    if (isNaN(m)) m = minute;
    m = Math.max(0, Math.min(59, m));
    
    setMinute(m);
    setMinInput(String(m).padStart(2, '0'));
    commit(hour, m, period);
  };

  // AM or PM
  const changePeriod = (p: 'AM' | 'PM') => {
    if (period === p) return;
    const valid = getValidHours(p);
    let nextHour = hour;
    if (!valid.includes(hour)) nextHour = valid[0]; 
    
    setPeriod(p);
    setHour(nextHour);
    setHourInput(String(nextHour).padStart(2, '0'));
    commit(nextHour, minute, p);
  };

  const displayTime = value ? (() => {
    const { h, m, p } = parseValue(value);
    return `${h}:${String(m).padStart(2, '0')} ${p}`;
  })() : '';

  return (
    <div ref={ref} className="relative w-full">
      
      {/* Time input */}
      <div
        onClick={handleToggle}
        className={`w-full border rounded-lg px-3 py-2 text-xs h-10 font-medium bg-white cursor-pointer flex items-center gap-2 transition select-none ${
          open ? 'border border-2 border-white-border focus:outline-none focus:ring-2 focus:ring-up-maroon/30 focus:border-up-maroon' : 'border-white-border border'
        }`}
      >
        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] shrink-0 transition ${open ? 'bg-red-50 text-up-maroon' : 'bg-gray-100 text-gray-500'}`}>
          <FaClock />
        </div>
        <span className={`${displayTime} text-slate-700 text-sm`}>
          {displayTime || placeholder}
        </span>
      </div>

      {/* Time picker pop up */}
      {open && (
        <div className="absolute bottom-[calc(100%+8px)] left-0 bg-white border border-white-border rounded-xl shadow-xl z-[9999] p-4 w-56 animate-fade-down origin-bottom">
          
          <div className="flex gap-2 mb-4">
            {(['AM', 'PM'] as const).map((p) => (
              <button
                key={p} type="button" onClick={() => changePeriod(p)}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-bold text-center transition-all ${
                  period === p ? 'bg-btn-gray border-slate-800 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-white-hover cursor-pointer'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4">
            
            {/* Hour Column */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold text-text-primary uppercase">Hour</span>
              <button type="button" onClick={() => changeHour('up')} className="w-8 h-6 rounded border border-gray-200 flex items-center justify-center text-text-primary hover:bg-white-hover transition cursor-pointer">
                <FaChevronUp className="text-[10px]" />
              </button>
              
              <input 
                type="text" 
                value={hourInput} 
                onChange={(e) => setHourInput(e.target.value.replace(/\D/g, '').slice(-2))}
                onBlur={handleHourBlur}
                className="w-12 h-10 rounded-lg bg-white text-center text-sm font-bold text-text-primary border border-2 border-white-border focus:outline-none focus:ring-2 focus:ring-up-maroon/30" 
              />
              
              <button type="button" onClick={() => changeHour('down')} className="w-8 h-6 rounded border border-gray-200 flex items-center justify-center text-text-primary hover:bg-white-hover transition cursor-pointer">
                <FaChevronDown className="text-[10px]" />
              </button>
            </div>

            <span className="text-xl font-bold text-gray-300 mt-4">:</span>

            {/* Minute Column */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold text-text-primary uppercase">Min</span>
              <button type="button" onClick={() => changeMinute('up')} className="w-8 h-6 rounded border border-gray-200 flex items-center justify-center text-text-primary hover:bg-white-hover transition cursor-pointer">
                <FaChevronUp className="text-[10px]" />
              </button>
              
              <input 
                type="text" 
                value={minInput} 
                onChange={(e) => setMinInput(e.target.value.replace(/\D/g, '').slice(-2))}
                onBlur={handleMinBlur}
                className="w-12 h-10 rounded-lg bg-white text-center text-sm font-bold text-text-primary border border-2 border-white-border focus:outline-none focus:ring-2 focus:ring-up-maroon/30" 
              />
              
              <button type="button" onClick={() => changeMinute('down')} className="w-8 h-6 rounded border border-gray-200 flex items-center justify-center text-text-primary hover:bg-white-hover transition cursor-pointer">
                <FaChevronDown className="text-[10px]" />
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}