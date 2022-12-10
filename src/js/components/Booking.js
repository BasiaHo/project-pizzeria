import { select, templates, settings } from '../settings.js';
import AmountWidget from './AmountWidget.js';

class Booking {
  constructor(bookingWidgetContainer) {
    console.log('Booking:', bookingWidgetContainer);

    const thisBooking = this;

    thisBooking.render(bookingWidgetContainer);
    thisBooking.initWidgets();
  }

  render(bookingWidgetContainer) {
    const thisBooking = this;

    /*generate HTML based on template*/
    const generatedHTML = templates.bookingWidget();
    /*create empty object thisBooking.dom*/
    thisBooking.dom = {};
    /*add to the empty object wrapper and make reference to the container*/
    thisBooking.dom.wrapper = bookingWidgetContainer;
    /*change wrapper proprty(innerHTML) for generatedHTML above from theb template*/
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    /*add new property dom.peopleAmount*/
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    /*add new property dom.hoursAmount*/
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);

    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    //thisBooking.dom.peopleAmount.addEventListener('', () => {});

    //thisBooking.dom.peopleAmount.addEventListener('', () => {});
  }
}

export default Booking;
