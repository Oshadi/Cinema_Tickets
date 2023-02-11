import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
#checkNoTickets(ticketTypeRequests){
    const maxTicketsCnt=20;
    let ticketCount=0;
    ticketTypeRequests.forEach(function (arrayItem) {
        arrayItem.forEach(function(arraym) {
                ticketCount=ticketCount + arraym.getNoOfTickets();
        });
    });
    if(ticketCount>maxTicketsCnt){
        return false;
    }else if(ticketCount===0){
        return 0;
    }else{
        return true;
    }
}
#checkAdultTktAvilable(ticketTypeRequests){
    let isAdultAvalable=0;
    ticketTypeRequests.forEach(function (arrayItem) {
            arrayItem.forEach(function(arraym) {
                if(arraym.getTicketType() ==='ADULT' && arraym.getNoOfTickets()>=1){
                    isAdultAvalable=1;
                }
            });
        });
    if(isAdultAvalable===1){
        return true;
    }
    else{
        return false;
    }
}

#checkInfantsForAdults(ticketTypeRequests){
    let adultNoTicket=0;
    let infantNoTicket=0;
    ticketTypeRequests.forEach(function (arrayItem) {
        arrayItem.forEach(function(arraym) {
            if(arraym.getTicketType()==='ADULT'){
                adultNoTicket=arraym.getNoOfTickets();
            }
            if(arraym.getTicketType()==='INFANT'){
                infantNoTicket=arraym.getNoOfTickets();
            }
        });
    });
    if(infantNoTicket === 0 || infantNoTicket === adultNoTicket || infantNoTicket < adultNoTicket){
        return true;
    }else{
        return false;
    }
}
#calculatePrice(ticketTypeRequests){
    let totalAmount=0;
    let adultPrice=0;
    let childPrice=0;
    ticketTypeRequests.forEach(function (arrayItem) {
        arrayItem.forEach(function(arraym) {
            if(arraym.getTicketType()==='ADULT'){
                adultPrice = arraym.getNoOfTickets();
            }
            if(arraym.getTicketType()==='CHILD'){
                childPrice = arraym.getNoOfTickets();
            }
        });
    });

    totalAmount=(adultPrice*20)+(childPrice*10);
    return totalAmount;
}
#calculateSeats(ticketTypeRequests){
    let totalSeats=0
    ticketTypeRequests.forEach(function (arrayItem) {
        arrayItem.forEach(function(arraym) {
            if(arraym.getTicketType()==='ADULT'||arraym.getTicketType()==='CHILD'){
                totalSeats += arraym.getNoOfTickets();
            }

        });
    });
    return totalSeats;
}
  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
      if ((!Number.isInteger(accountId))){
          throw new InvalidPurchaseException("Not a valid Account Id!");
      }
      if (!(accountId > 1)){
          throw new InvalidPurchaseException("Account Id must be greater than 1 or equal to 1!");
      }
      if(this.#checkNoTickets(ticketTypeRequests) === 0){
          throw new InvalidPurchaseException("Zero tickets has been requested");
      }
      if(!(this.#checkNoTickets(ticketTypeRequests))){
          throw new InvalidPurchaseException("Maximum number of tickets amount exceeded!");
      }
      if(!(this.#checkAdultTktAvilable(ticketTypeRequests))){
          throw new InvalidPurchaseException("At least one adult ticket must available!");
      }
      if(!(this.#checkInfantsForAdults(ticketTypeRequests))){
          throw new InvalidPurchaseException("Infants are not permitted unless accompanied by an adult!");
      }

      const totalTicketsPrice= this.#calculatePrice(ticketTypeRequests);
      const totalNoSeats= this.#calculateSeats(ticketTypeRequests);
      const paymentService = new TicketPaymentService();
      paymentService.makePayment(accountId,totalTicketsPrice);
      const seatAllocateService= new SeatReservationService();
      seatAllocateService.reserveSeat(accountId,totalNoSeats);

      return { seatCount: totalNoSeats, ticketPrice: totalTicketsPrice };


    }


}
