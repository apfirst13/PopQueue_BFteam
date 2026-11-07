import React from 'react';
import { StaffSeriesQueueDto } from '../types/index.js';

interface SeriesSelectorProps {
  seriesList: StaffSeriesQueueDto[];
  selectedSeriesId: string;
  onSelect: (seriesId: string) => void;
}

function getSeriesChipClass(code: string) {
  switch (code.toUpperCase()) {
    case 'CRY':
      return 'series-chip-cry';
    case 'LAB':
      return 'series-chip-lab';
    case 'SKP':
      return 'series-chip-skp';
    default:
      return '';
  }
}

export function SeriesSelector({
  seriesList,
  selectedSeriesId,
  onSelect,
}: SeriesSelectorProps): React.JSX.Element {
  if (seriesList.length <= 1) {
    const single = seriesList[0];
    return (
      <div
        className="card"
        style={{
          marginBottom: '16px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span className={`series-chip ${getSeriesChipClass(single?.code || '')}`}>
          {single?.code || 'SERIES'}
        </span>
        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
          ซีรีส์ประจำการ: {single?.name || 'N/A'} ({single?.code})
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: '16px', padding: '16px' }}>
      <div style={{ marginBottom: '12px' }}>
        <label htmlFor="series-select" className="form-label">
          เลือกซีรีส์ที่ประจำการ
        </label>
        {/* Interactive Pill Tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          {seriesList.map((s) => {
            const isSelected = s.seriesId === selectedSeriesId;
            const chipClass = getSeriesChipClass(s.code);
            return (
              <button
                key={s.seriesId}
                type="button"
                onClick={() => onSelect(s.seriesId)}
                className="btn btn-outline"
                style={{
                  minHeight: '42px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  border: isSelected
                    ? '2px solid var(--color-primary)'
                    : '1.5px solid var(--color-border)',
                  backgroundColor: isSelected ? 'var(--color-primary-soft)' : '#FFFFFF',
                  color: isSelected ? 'var(--color-primary)' : 'var(--color-text)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span className={`series-chip ${chipClass}`}>{s.code}</span>
                <span>{s.waitingQueue.length} คิว</span>
              </button>
            );
          })}
        </div>

        {/* Semantic Accessible Select Box for Form & Test Compatibility */}
        <select
          id="series-select"
          className="form-input"
          value={selectedSeriesId}
          onChange={(e) => onSelect(e.target.value)}
          aria-label="เลือกซีรีส์"
        >
          {seriesList.map((s) => (
            <option key={s.seriesId} value={s.seriesId}>
              {s.code} - {s.name} ({s.waitingQueue.length} คิวรอ)
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SeriesSelector;
