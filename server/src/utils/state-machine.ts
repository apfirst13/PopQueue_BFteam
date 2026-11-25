import { TicketStatus } from '@prisma/client';

export type StaffTicketAction = 'CALL_NEXT' | 'START_UNBOXING' | 'COMPLETE';
export type TicketAction = StaffTicketAction | 'CANCEL';

/**
 * Pure state machine transition checker (F-03, F-05, BR-03, TEST-28U, TEST-41E).
 * Determines whether a ticket in fromStatus may transition via action.
 * Allowed transitions:
 * - WAITING -> CALL_NEXT
 * - WAITING -> CANCEL
 * - CALLED -> START_UNBOXING
 * - UNBOXING -> COMPLETE
 */
export function canTransition(fromStatus: TicketStatus, action: TicketAction): boolean {
  if (fromStatus === TicketStatus.WAITING && (action === 'CALL_NEXT' || action === 'CANCEL')) {
    return true;
  }
  if (fromStatus === TicketStatus.CALLED && action === 'START_UNBOXING') {
    return true;
  }
  if (fromStatus === TicketStatus.UNBOXING && action === 'COMPLETE') {
    return true;
  }
  return false;
}
