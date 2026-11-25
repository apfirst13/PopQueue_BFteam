import React, { useState, useEffect, useCallback } from 'react';
import * as publicApi from '../api/public.api.js';
import { PublicSeriesBoard } from '../types/index.js';
import { usePolling } from '../hooks/usePolling.js';
import { LoadingSkeleton } from '../components/LoadingSkeleton.js';
import { AlertCircleIcon, BellIcon, ClockIcon, ToyBoxIcon } from '../components/icons.js';

function getBoardSeriesTheme(code: string) {
  switch (code.toUpperCase()) {
    case 'CRY':
      return { accent: '#BE123C', softBg: '#FFE4EC', chipClass: 'series-chip-cry' };
    case 'LAB':
      return { accent: '#C2410C', softBg: '#FFEDD5', chipClass: 'series-chip-lab' };
    case 'SKP':
      return { accent: '#6D28D9', softBg: '#EDE9FE', chipClass: 'series-chip-skp' };
    default:
      return { accent: 'var(--color-primary)', softBg: 'var(--color-primary-soft)', chipClass: '' };
  }
}

export function BoardPage(): React.JSX.Element {
  const [boards, setBoards] = useState<PublicSeriesBoard[]>([]);
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDegraded, setIsDegraded] = useState(false);

  const loadBoard = useCallback(async () => {
    try {
      const res = await publicApi.getPublicQueueBoard();
      setBoards(res.data.boards);
      setLastTimestamp(res.data.timestamp);
      setIsDegraded(false);
    } catch {
      setIsDegraded(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  usePolling(loadBoard, 3000, true);

  const formattedUpdatedAt = lastTimestamp
    ? new Date(lastTimestamp).toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null;

  return (
    <div className="board-kiosk-page" data-testid="public-board-page">
      {/* Kiosk Header Strip */}
      <div className="board-header-bar">
        <div className="board-title-group">
          <div className="board-live-pill">
            <span className="board-live-dot" aria-hidden="true" />
            <span>LIVE QUEUE BOARD</span>
          </div>
          <h2 className="board-main-title">สถานะคิวแกะกล่องหน้าร้าน (Public Queue Board)</h2>
        </div>

        <div className="board-meta-group">
          {formattedUpdatedAt && (
            <span className="board-updated-time tabular-nums" data-testid="board-timestamp">
              <ClockIcon size={16} />
              <span>อัปเดตล่าสุด: {formattedUpdatedAt}</span>
            </span>
          )}
        </div>
      </div>

      {/* Degraded Connection Banner (AC-44.8) */}
      {isDegraded && (
        <div
          className="alert alert-warning board-degraded-banner"
          role="alert"
          data-testid="board-degraded-banner"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
            <AlertCircleIcon size={20} />
            <span>กำลังเชื่อมต่อเซิร์ฟเวอร์ใหม่...</span>
          </div>
          <span style={{ fontSize: '0.875rem' }}>
            ไม่สามารถดึงข้อมูลล่าสุดได้ ระบบจะพยายามเชื่อมต่ออัตโนมัติทุก 3 วินาที
          </span>
        </div>
      )}

      {isLoading && boards.length === 0 && !isDegraded ? (
        <LoadingSkeleton text="กำลังโหลดบอร์ดแสดงคิว..." />
      ) : boards.length === 0 ? (
        <div className="card board-empty-card">
          <div className="board-empty-icon" aria-hidden="true">
            <ToyBoxIcon size={36} />
          </div>
          <p className="board-empty-text">ไม่มีคิวรอในขณะนี้</p>
        </div>
      ) : (
        <div className="board-grid">
          {boards.map((board) => {
            const theme = getBoardSeriesTheme(board.seriesCode);
            return (
              <section
                key={board.seriesCode}
                className={`card board-series-card ${!board.isActive ? 'board-series-closed' : ''}`}
                data-series={board.seriesCode}
                aria-label={`${board.seriesName} queue board`}
              >
                {/* Top Color Stripe */}
                <div
                  className="series-card-top-stripe"
                  style={{ backgroundColor: board.isActive ? theme.accent : '#EA580C' }}
                  aria-hidden="true"
                />

                <div className="board-card-body">
                  {/* Series Card Title + Status Badge */}
                  <div className="board-card-header">
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className={`series-chip ${theme.chipClass}`}>{board.seriesCode}</span>
                        {!board.isActive && (
                          <span className="badge badge-closed-queue" data-testid={`closed-badge-${board.seriesCode}`}>
                            ปิดรับคิวใหม่
                          </span>
                        )}
                      </div>
                      <h3 className="board-series-name">{board.seriesName}</h3>
                    </div>

                    <div className="board-waiting-pill tabular-nums">
                      <span className="board-waiting-label">รอคิว</span>
                      <span className="board-waiting-value">{board.waitingCount}</span>
                    </div>
                  </div>

                  {/* Now Serving Section */}
                  <div className="board-section board-now-serving">
                    <div className="board-section-label">
                      <BellIcon size={16} />
                      <span>กำลังให้บริการ (NOW SERVING)</span>
                    </div>

                    {board.nowServing.length === 0 ? (
                      <div className="board-now-empty" data-testid={`now-serving-empty-${board.seriesCode}`}>
                        -
                      </div>
                    ) : (
                      <div className="board-serving-list">
                        {board.nowServing.map((item) => {
                          const isUnboxing = item.status === 'UNBOXING';
                          return (
                            <div
                              key={item.displayNumber}
                              className={`board-serving-ticket ${isUnboxing ? 'is-unboxing' : 'is-called'}`}
                            >
                              <span className="board-serving-number tabular-nums">
                                {item.displayNumber}
                              </span>
                              <span className={`badge ${isUnboxing ? 'badge-unboxing' : 'badge-called'}`}>
                                {isUnboxing ? 'UNBOXING' : 'CALLED'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Up Next Section (Max 5) */}
                  <div className="board-section board-up-next">
                    <div className="board-section-header">
                      <span className="board-section-label-text">คิวถัดไป (UP NEXT)</span>
                      <span className="board-section-sub tabular-nums">
                        แสดงสูงสุด 5 จาก {board.waitingCount} คิว
                      </span>
                    </div>

                    {board.upNext.length === 0 ? (
                      <div className="board-upnext-empty">ไม่มีคิวรอในขณะนี้</div>
                    ) : (
                      <ul className="board-upnext-list" aria-label={`Up next for ${board.seriesCode}`}>
                        {board.upNext.map((item, idx) => (
                          <li key={`${board.seriesCode}-${item.queueNumber}-${item.displayNumber}`} className="board-upnext-item">
                            <span className="board-upnext-rank tabular-nums">#{idx + 1}</span>
                            <span className="board-upnext-number tabular-nums">{item.displayNumber}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
