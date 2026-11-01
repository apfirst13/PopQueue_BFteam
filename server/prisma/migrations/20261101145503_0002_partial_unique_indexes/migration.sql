-- BR-02: Partial Unique Index for collector active tickets
CREATE UNIQUE INDEX unique_active_ticket_user ON "QueueTicket"("userId")
WHERE status IN ('WAITING','CALLED','UNBOXING');

-- BR-06: Partial Unique Index for staff active ticket handling
CREATE UNIQUE INDEX unique_active_staff_ticket ON "QueueTicket"("handledByStaffId")
WHERE status IN ('CALLED','UNBOXING');