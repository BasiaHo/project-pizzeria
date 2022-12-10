import { select, settings } from '../settings.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget {
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;

    console.log(thisWidget);
    thisWidget.getElements(element);
    // thisWidget.setValue(
    //   thisWidget.dom.input.value || settings.amountWidget.defaultValue
    // );
    thisWidget.initActions();

    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments:', element, settings.amountWidget.defaultValue )
  }

  getElements() {
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(
      select.widgets.amount.input
    );
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(
      select.widgets.amount.linkDecrease
    );
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(
      select.widgets.amount.linkIncrease
    );
  }

  parseValue(value) {
    return parseInt(value);
  }

  isValid(value) {
    const min = settings.amountWidget.defaultMin;
    const max = settings.amountWidget.defaultMax;

    return !isNaN(value) && value >= min && value <= max;
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }

  initActions() {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function (event) {
      thisWidget.setValue(event.target.value);
    });

    thisWidget.dom.linkDecrease.addEventListener('click', () => {
      const newValue = thisWidget.value - 1;
      thisWidget.setValue(newValue);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', () => {
      const newValue = thisWidget.value + 1;
      thisWidget.setValue(newValue);
    });
  }

  announce() {
    const thisWidget = this;
    const event = new CustomEvent('updated', { bubbles: true });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}
export default AmountWidget;
