import { select, templates } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

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
    thisBooking.dom.peopleAmount = document.querySelector(
      select.booking.peopleAmount
    );
    /*add new property dom.hoursAmount*/
    thisBooking.dom.hoursAmount = document.querySelector(
      select.booking.hoursAmount
    );

    thisBooking.dom.datePicker = document.querySelector(
      select.widgets.datePicker.wrapper
    );
    thisBooking.dom.hourPicker = document.querySelector(
      select.widgets.hourPicker.wrapper
    );
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);

    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);

    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
  }
}

export default Booking;
