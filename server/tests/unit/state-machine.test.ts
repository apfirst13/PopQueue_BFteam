import { describe, it, expect } from 'vitest';
import { TicketStatus } from '@prisma/client';
import { canTransition, StaffTicketAction, TicketAction } from '../../src/utils/state-machine.js';

describe('State Machine Unit: canTransition (TEST-28U, AC-28, BR-03)', () => {
  const allStatuses: TicketStatus[] = [
    TicketStatus.WAITING,
    TicketStatus.CALLED,
    TicketStatus.UNBOXING,
    TicketStatus.COMPLETED,
    TicketStatus.CANCELLED,
    TicketStatus.NO_SHOW,
  ];

  const allActions: StaffTicketAction[] = ['CALL_NEXT', 'START_UNBOXING', 'COMPLETE'];

  const allowedTransitions: Array<{ from: TicketStatus; action: StaffTicketAction }> = [
    { from: TicketStatus.WAITING, action: 'CALL_NEXT' },
    { from: TicketStatus.CALLED, action: 'START_UNBOXING' },
    { from: TicketStatus.UNBOXING, action: 'COMPLETE' },
  ];

  it.each(allowedTransitions)(
    'returns true for allowed transition $from -> $action',
    ({ from, action }) => {
      expect(canTransition(from, action)).toBe(true);
    },
  );

  const disallowedTransitions: Array<{ from: TicketStatus; action: StaffTicketAction }> = [];
  for (const status of allStatuses) {
    for (const action of allActions) {
      const isAllowed = allowedTransitions.some(
        (t) => t.from === status && t.action === action,
      );
      if (!isAllowed) {
        disallowedTransitions.push({ from: status, action });
      }
    }
  }

  it.each(disallowedTransitions)(
    'returns false for disallowed transition $from -> $action',
    ({ from, action }) => {
      expect(canTransition(from, action)).toBe(false);
    },
  );

  describe('TEST-41E (AC-41.5, F-05): CANCEL transition validation', () => {
    it('allows CANCEL only from WAITING and rejects all other statuses', () => {
      const cancelAction: TicketAction = 'CANCEL';
      expect(canTransition(TicketStatus.WAITING, cancelAction)).toBe(true);

      const nonWaitingStatuses: TicketStatus[] = [
        TicketStatus.CALLED,
        TicketStatus.UNBOXING,
        TicketStatus.COMPLETED,
        TicketStatus.CANCELLED,
        TicketStatus.NO_SHOW,
      ];
      for (const status of nonWaitingStatuses) {
        expect(canTransition(status, cancelAction)).toBe(false);
      }
    });
  });
});
