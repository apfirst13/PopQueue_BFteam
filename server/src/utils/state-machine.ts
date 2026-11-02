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
export function canTransition(_fromStatus: TicketStatus, _action: StaffTicketAction): boolean {
  // RED phase stub: unconditionally returns false so valid transitions fail test
  return false;
}
