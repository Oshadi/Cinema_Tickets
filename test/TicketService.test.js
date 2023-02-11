import TicketService from '../src/pairtest/TicketService.js';
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";

let ticketService = new TicketService();
describe("Check all the business rules, constraints", () => {
    test("Should return ticket price and seats amount", () => {
        const accountId = 505;
        const ticketTypeReq = [new TicketTypeRequest("ADULT", 5),new TicketTypeRequest("CHILD", 5),new TicketTypeRequest("INFANT", 1)];
        const { seatCount, ticketPrice } = ticketService.purchaseTickets(accountId,ticketTypeReq);
        expect(seatCount).toBe(10);
        expect(ticketPrice).toBe(150);
    });
    test("Should return a maximum ticket count ", () => {
        const accountId = 505;
        const ticketTypeReq = [new TicketTypeRequest("ADULT", 10),new TicketTypeRequest("CHILD", 11),new TicketTypeRequest("INFANT", 1)];
        expect(() => {
            ticketService.purchaseTickets(accountId, ticketTypeReq);
        }).toThrow(InvalidPurchaseException);
    });
    test("Should return an account Id integer error", () => {
        const accountId = "505";
        const ticketTypeReq = [new TicketTypeRequest("ADULT", 5),new TicketTypeRequest("CHILD", 10),new TicketTypeRequest("INFANT", 1)];
        expect(() => {
            ticketService.purchaseTickets(accountId, ticketTypeReq);
        }).toThrow(InvalidPurchaseException);
    });
    test("Should return an account Id greater than one error", () => {
        const accountId = 0.5;
        const ticketTypeReq = [new TicketTypeRequest("ADULT", 5),new TicketTypeRequest("CHILD", 10),new TicketTypeRequest("INFANT", 1)];
        expect(() => {
            ticketService.purchaseTickets(accountId, ticketTypeReq);
        }).toThrow(InvalidPurchaseException);
    });
    test("Should return no tickets requested error", () => {
        const accountId = 505;
        const ticketTypeReq = [new TicketTypeRequest("ADULT", 0),new TicketTypeRequest("CHILD", 0),new TicketTypeRequest("INFANT", 0)];
        expect(() => {
            ticketService.purchaseTickets(accountId, ticketTypeReq);
        }).toThrow(InvalidPurchaseException);
    });
    test("Should return at least one adult ticket must be requested error ", () => {
        const accountId = 505;
        const ticketTypeReq = [new TicketTypeRequest("ADULT", 0),new TicketTypeRequest("CHILD", 10),new TicketTypeRequest("INFANT", 10)];
        expect(() => {
            ticketService.purchaseTickets(accountId, ticketTypeReq);
        }).toThrow(InvalidPurchaseException);
    });
    test("Should return number of adults and infants equal error ", () => {
        const accountId = 505;
        const ticketTypeReq = [new TicketTypeRequest("ADULT", 10),new TicketTypeRequest("CHILD", 10),new TicketTypeRequest("INFANT", 15)];
        expect(() => {
            ticketService.purchaseTickets(accountId, ticketTypeReq);
        }).toThrow(InvalidPurchaseException);
    });
});




