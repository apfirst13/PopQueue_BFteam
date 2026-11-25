import React from 'react';
import { StaffSeriesQueueDto } from '../types/index.js';

interface SeriesSelectorProps {
  seriesList: StaffSeriesQueueDto[];
  selectedSeriesId: string;
  onSelect: (seriesId: string) => void;
  onToggleStatus?: (seriesId: string, nextIsActive: boolean) => void;
  togglingSeriesId?: string | null;
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

interface SeriesAvailabilityControlProps {
  series: StaffSeriesQueueDto;
  onToggleStatus?: (seriesId: string, nextIsActive: boolean) => void;
  isToggling: boolean;
}

function SeriesAvailabilityControl({
  series,
  onToggleStatus,
  isToggling,
}: SeriesAvailabilityControlProps): React.JSX.Element {
  const isSeriesOpen = series.isActive ?? true;

  return (
    <div className="series-toggle-wrapper">
      <span
        className={`badge ${isSeriesOpen ? 'badge-series-open' : 'badge-series-closed'}`}
      >
        {isSeriesOpen ? 'เปิดรับคิว' : 'ปิดรับคิว'}
      </span>

      {isToggling && (
        <span className="series-toggle-loading" role="status" aria-live="polite">
          <span className="series-toggle-spinner" aria-hidden="true" />
          <span>กำลังอัปเดต...</span>
        </span>
      )}

      <label className="series-toggle-label">
        <input
          type="checkbox"
          role="switch"
          className="series-toggle-input"
          checked={isSeriesOpen}
          disabled={isToggling || !onToggleStatus}
          onChange={() => onToggleStatus?.(series.seriesId, !isSeriesOpen)}
          aria-label={`เปิด-ปิดรับคิวซีรีส์ ${series.code}`}
        />
        <span
          className={`series-toggle-track ${isSeriesOpen ? 'is-active' : ''} ${
            isToggling || !onToggleStatus ? 'is-disabled' : ''
          }`}
          aria-hidden="true"
        >
          <span className="series-toggle-thumb" />
        </span>
      </label>
    </div>
  );
}

export function SeriesSelector({
  seriesList,
  selectedSeriesId,
  onSelect,
  onToggleStatus,
  togglingSeriesId,
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
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className={`series-chip ${getSeriesChipClass(single?.code || '')}`}>
            {single?.code || 'SERIES'}
          </span>
          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
            ซีรีส์ประจำการ: {single?.name || 'N/A'} ({single?.code})
          </div>
        </div>
        {single && (
          <SeriesAvailabilityControl
            series={single}
            onToggleStatus={onToggleStatus}
            isToggling={togglingSeriesId === single.seriesId}
          />
        )}
      </div>
    );
  }

  const activeSeries = seriesList.find((s) => s.seriesId === selectedSeriesId) || seriesList[0];

  return (
    <div className="card" style={{ marginBottom: '16px', padding: '16px' }}>
      <div style={{ marginBottom: '12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '10px',
          }}
        >
          <label htmlFor="series-select" className="form-label" style={{ marginBottom: 0 }}>
            เลือกซีรีส์ที่ประจำการ
          </label>
          {activeSeries && (
            <SeriesAvailabilityControl
              series={activeSeries}
              onToggleStatus={onToggleStatus}
              isToggling={togglingSeriesId === activeSeries.seriesId}
            />
          )}
        </div>
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
