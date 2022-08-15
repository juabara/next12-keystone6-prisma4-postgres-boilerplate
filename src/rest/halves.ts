import { Context } from ".keystone/types";
import { Request, Response } from "express";

function halvePool(context: Context, prizePool: any) {
  const rangeMid = (prizePool.ticketRangeBegin + prizePool.ticketRangeEnd) / 2;
  const rangeMid1 = Math.floor(rangeMid);
  const rangeMid2 = Math.ceil(rangeMid);
  let ticketRangeEnd = prizePool.ticketRangeEnd;
  let ticketRangeBegin = prizePool.ticketRangeBegin;
  let remainingTickets = prizePool.remainingTickets;
  let ticketValue = prizePool.initialTicketValue;
  let status = prizePool.status;
  const halveDateTime = new Date();
  const nextHalveTime = new Date(halveDateTime);
  nextHalveTime.setDate(nextHalveTime.getDate() + 1);
  nextHalveTime.setHours(0, 0, 0, 0);

  if (prizePool.secretNumber <= rangeMid) {
    ticketRangeEnd = rangeMid1;
  } else {
    ticketRangeBegin = rangeMid2;
  }

  remainingTickets = ticketRangeEnd - ticketRangeBegin + 1;
  if (remainingTickets == 1) {
    status = "completed";
  }

  ticketValue = (ticketValue * prizePool.numOfTickets) / remainingTickets;

  context.query.Halve.createOne({
    data: {
      newTicketRangeBegin: ticketRangeBegin,
      newTicketRangeEnd: ticketRangeEnd,
      halveDateTime: halveDateTime,
      ticketValue: ticketValue,
      remainingTickets: remainingTickets,
      prizePool: { connect: { id: prizePool.id } },
    },
  });

  context.query.PrizePool.updateOne({
    where: {
      id: prizePool.id,
    },
    data: {
      status: status,
      currentTicketValue: ticketValue,
      ticketRangeBegin: ticketRangeBegin,
      ticketRangeEnd: ticketRangeEnd,
      remainingTickets: remainingTickets,
      nextHalveTime: nextHalveTime,
    },
  });
}

export async function makeHalves(request: Request, response: Response) {
  const { context } = request as typeof request & { context: Context };

  try {
    const date = new Date();
    const prizePools = await context.query.PrizePool.findMany({
      where: {
        status: { equals: "inprogress" },
      },
      query: `
          id,
          prizePoolNumber,
          currentTicketValue,
          ticketRangeBegin,
          ticketRangeEnd,
          numOfTickets,
          remainingTickets,
          initialTicketValue,
          secretNumber,
          nextHalveTime
        `,
    });
    prizePools.forEach((prizePool) => {
      if (prizePool.remainingTickets === 1) {
        context.query.PrizePool.updateOne({
          where: {
            id: prizePool.id,
          },
          data: {
            status: "completed",
          },
        });
      } else {
        const nextHalveTime = new Date(prizePool.nextHalveTime);

        if (nextHalveTime <= date) {
          halvePool(context, prizePool);
        }
      }
    });

    response.json("");
  } catch (error) {
    response.json(error);
  }
}
