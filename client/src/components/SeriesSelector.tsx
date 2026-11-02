import React from 'react';
import { StaffSeriesQueueDto } from '../types/index.js';

interface SeriesSelectorProps {
  seriesList: StaffSeriesQueueDto[];
  selectedSeriesId: string;
  onSelect: (seriesId: string) => void;
}

export function SeriesSelector({
  seriesList,
  selectedSeriesId,
  onSelect,
}: SeriesSelectorProps): React.JSX.Element {
  if (seriesList.length <= 1) {
    return (
      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
        ซีรีส์ประจำการ: {seriesList[0]?.name || 'N/A'} ({seriesList[0]?.code})
      </div>
    );
  }

  return (
    <div className="form-group" style={{ marginBottom: '12px' }}>
      <label htmlFor="series-select" className="form-label">
        เลือกซีรีส์ที่ประจำการ
      </label>
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
  );
}
