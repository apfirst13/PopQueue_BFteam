import { TicketStatus } from '@prisma/client';

export type StaffTicketAction = 'CALL_NEXT' | 'START_UNBOXING' | 'COMPLETE';

/**
 * Pure state machine transition checker (F-03, BR-03, TEST-28U).
 * Determines whether a ticket in fromStatus may transition via action.
 * Allowed transitions:
 * - WAITING -> CALL_NEXT
 * - CALLED -> START_UNBOXING
 * - UNBOXING -> COMPLETE
 */
export function canTransition(fromStatus: TicketStatus, action: StaffTicketAction): boolean {
  if (fromStatus === TicketStatus.WAITING && action === 'CALL_NEXT') {
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
