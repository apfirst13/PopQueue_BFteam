-- BR-02 (v2 / D-08 / Issue #52, #53): Revise single active ticket to per-series
-- Zero-gap migration rule: CREATE new unique index first, then DROP the old one.
CREATE UNIQUE INDEX unique_active_ticket_user_series ON "QueueTicket"("userId", "seriesId")
WHERE status IN ('WAITING','CALLED','UNBOXING');

DROP INDEX IF EXISTS unique_active_ticket_user;
