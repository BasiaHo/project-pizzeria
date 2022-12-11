import { select, settings, templates, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(bookingWidgetContainer) {
    console.log('Booking:', bookingWidgetContainer);

    const thisBooking = this;

    thisBooking.selectedTable = null;
    thisBooking.render(bookingWidgetContainer);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData() {
    const thisBooking = this;

    const startDateParam =
      settings.db.dateStartParamKey +
      '=' +
      utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam =
      settings.db.dateEndParamKey +
      '=' +
      utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      bookings: [startDateParam, endDateParam],

      eventsCurrent: [settings.db.notRepeatParam, startDateParam, endDateParam],

      eventsRepeat: [settings.db.repeatParam, endDateParam],
    };

    //console.log('getData params', params);

    const urls = {
      booking:
        settings.db.url +
        '/' +
        settings.db.bookings +
        '?' +
        params.bookings.join('&'),
      eventsCurrent:
        settings.db.url +
        '/' +
        settings.db.events +
        '?' +
        params.bookings.join('&'),
      eventsRepeat:
        settings.db.url +
        '/' +
        settings.db.events +
        '?' +
        params.bookings.join('&'),
    };

    //console.log('urls'.urls);
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function (allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        //console.log(bookings);
        //console.log(eventsCurrent);
        //console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (
          let loopDate = minDate;
          loopDate <= maxDate;
          loopDate = utils.addDays(loopDate, 1)
        ) {
          thisBooking.makeBooked(
            utils.dateToStr(loopDate),
            item.date,
            item.hour,
            item.duration,
            item.table
          );
        }
      }
    }

    //console.log('thisBooking.booked', thisBooking.booked);

    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (
      let hourBlock = startHour;
      hourBlock < startHour + duration;
      hourBlock += 0.5
    ) {
      //console.log('loop', hourBlock;

      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  selectTable(event) {
    const thisBooking = this;
    //console.log('this is an event:', event);
    if (event.target.classList.contains(classNames.booking.table)) {
      const table = event.target;
      console.log('this is an event:', event);
      if (!table.classList.contains(classNames.booking.tableBooked)) {
        const tableId = table.getAttribute(settings.booking.tableIdAttribute);
        const selectedTable = document.querySelector(
          select.booking.selectedTable
        );

        if (tableId == thisBooking.selectedTable) {
          thisBooking.selectedTable = null;
        } else {
          thisBooking.selectedTable = tableId;
          table.classList.add(classNames.booking.tableSelected);
        }

        selectedTable?.classList.remove(classNames.booking.tableSelected);
      } else {
        alert('This table is already booked. Please choose another one.')
      }
    }
  }

  cleanTableSelection() {
    const thisBooking = this;

    const selectedTable = document.querySelector(select.booking.selectedTable);
    selectedTable?.classList.remove(classNames.booking.tableSelected);
    thisBooking.selectedTable = -1;
  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined' ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] ==
        'undefined'
    ) {
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      thisBooking.table = tableId;
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (
        !allAvailable &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }

    thisBooking.cleanTableSelection();
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

    thisBooking.dom.tables = document.querySelectorAll(select.booking.tables);

    thisBooking.dom.floorPlanWrapper = document.querySelector(
      select.booking.floorPlanWrapper
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

    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();
    });

    thisBooking.dom.floorPlanWrapper.addEventListener(
      'click',
      function (event) {
        thisBooking.selectTable(event);
      }
    );
  }
}

export default Booking;
