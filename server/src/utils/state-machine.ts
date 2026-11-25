import { TicketStatus } from '@prisma/client';

export type StaffTicketAction = 'CALL_NEXT' | 'START_UNBOXING' | 'NO_SHOW' | 'COMPLETE';
export type TicketAction = StaffTicketAction | 'CANCEL';

/**
 * Pure state machine transition checker (F-03, F-05, F-06, BR-03, TEST-28U, TEST-41E, TEST-43U).
 * Determines whether a ticket in fromStatus may transition via action.
 * Allowed transitions:
 * - WAITING -> CALL_NEXT
 * - WAITING -> CANCEL
 * - CALLED -> START_UNBOXING
 * - CALLED -> NO_SHOW
 * - UNBOXING -> COMPLETE
 */
export function canTransition(fromStatus: TicketStatus, action: TicketAction): boolean {
  if (fromStatus === TicketStatus.WAITING && (action === 'CALL_NEXT' || action === 'CANCEL')) {
    return true;
  }
  if (
    fromStatus === TicketStatus.CALLED &&
    (action === 'START_UNBOXING' || action === 'NO_SHOW')
  ) {
    return true;
  }
  if (fromStatus === TicketStatus.UNBOXING && action === 'COMPLETE') {
    return true;
  }
  return false;
}
