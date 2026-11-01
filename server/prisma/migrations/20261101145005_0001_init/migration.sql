-- CreateEnum
CREATE TYPE "Role" AS ENUM ('COLLECTOR', 'BOX_MASTER');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('WAITING', 'CALLED', 'UNBOXING', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'COLLECTOR',
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffSeriesAssignment" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,

    CONSTRAINT "StaffSeriesAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueTicket" (
    "id" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "handledByStaffId" TEXT,
    "queueDate" DATE NOT NULL,
    "queueNumber" INTEGER NOT NULL,
    "displayNumber" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'WAITING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "forfeitedAt" TIMESTAMP(3),

    CONSTRAINT "QueueTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueCounter" (
    "id" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "queueDate" DATE NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "QueueCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Series_code_key" ON "Series"("code");

-- CreateIndex
CREATE UNIQUE INDEX "StaffSeriesAssignment_staffId_seriesId_key" ON "StaffSeriesAssignment"("staffId", "seriesId");

-- CreateIndex
CREATE INDEX "QueueTicket_seriesId_status_queueDate_queueNumber_idx" ON "QueueTicket"("seriesId", "status", "queueDate", "queueNumber");

-- CreateIndex
CREATE INDEX "QueueTicket_userId_idx" ON "QueueTicket"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "QueueTicket_seriesId_queueDate_queueNumber_key" ON "QueueTicket"("seriesId", "queueDate", "queueNumber");

-- CreateIndex
CREATE UNIQUE INDEX "QueueCounter_seriesId_queueDate_key" ON "QueueCounter"("seriesId", "queueDate");

-- AddForeignKey
ALTER TABLE "StaffSeriesAssignment" ADD CONSTRAINT "StaffSeriesAssignment_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffSeriesAssignment" ADD CONSTRAINT "StaffSeriesAssignment_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueTicket" ADD CONSTRAINT "QueueTicket_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueTicket" ADD CONSTRAINT "QueueTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueTicket" ADD CONSTRAINT "QueueTicket_handledByStaffId_fkey" FOREIGN KEY ("handledByStaffId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueCounter" ADD CONSTRAINT "QueueCounter_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
