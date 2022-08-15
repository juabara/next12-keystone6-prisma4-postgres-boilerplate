import {
  integer,
  float,
  timestamp,
  relationship,
} from "@keystone-6/core/fields";
import { list } from "@keystone-6/core";

export const Halve = list({
  fields: {
    newTicketRangeBegin: integer({
      db: {
        map: "new_ticket_range_begin",
      },
    }),
    newTicketRangeEnd: integer({
      db: {
        map: "new_ticket_range_end",
      },
    }),
    ticketValue: float({
      db: {
        map: "ticket_value",
      },
    }),
    remainingTickets: integer({
      db: {
        map: "remaining_tickets",
      },
    }),
    halveDateTime: timestamp({
      db: {
        map: "halve_date_time",
      },
    }),
    prizePool: relationship({
      ref: "PrizePool.halves",
      db: {
        foreignKey: {
          map: "prize_pool",
        },
      },
    }),
  },
  ui: {
    itemView: {
      defaultFieldMode: "read",
    },
    listView: {
      initialSort: {
        field: "halveDateTime",
        direction: "DESC",
      },
      initialColumns: [
        "halveDateTime",
        "newTicketRangeBegin",
        "newTicketRangeEnd",
        "ticketValue",
        "remainingTickets",
      ],
    },
    hideCreate: true,
    isHidden: true,
  },
  db: {
    map: "halves",
  },
});
