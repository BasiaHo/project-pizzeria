import { select, settings } from '../settings.js';

class AmountWidget {
  constructor(element) {
    const thisWidget = this;

    console.log(thisWidget);
    thisWidget.getElements(element);
    thisWidget.setValue(
      thisWidget.input.value || settings.amountWidget.defaultValue
    );
    thisWidget.initActions();
  }

  getElements(element) {
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(
      select.widgets.amount.input
    );
    thisWidget.linkDecrease = thisWidget.element.querySelector(
      select.widgets.amount.linkDecrease
    );
    thisWidget.linkIncrease = thisWidget.element.querySelector(
      select.widgets.amount.linkIncrease
    );
  }

  setValue(value) {
    const thisWidget = this;

    const newValue = parseInt(value);
    const min = settings.amountWidget.defaultMin;
    const max = settings.amountWidget.defaultMax;

    /* Add validation*/
    if (newValue !== thisWidget.value && !isNaN(newValue)) {
      if (newValue >= min && newValue <= max) {
        thisWidget.value = newValue;

        thisWidget.announce();
      }
    }

    thisWidget.input.value = thisWidget.value;
  }

  initActions() {
    const thisWidget = this;

    thisWidget.input.addEventListener('change', function (event) {
      thisWidget.setValue(event.target.value);
    });

    thisWidget.linkDecrease.addEventListener('click', () => {
      const newValue = thisWidget.value - 1;
      thisWidget.setValue(newValue);
    });

    thisWidget.linkIncrease.addEventListener('click', () => {
      const newValue = thisWidget.value + 1;
      thisWidget.setValue(newValue);
    });
  }

  announce() {
    const thisWidget = this;
    const event = new CustomEvent('updated', { bubbles: true });
    thisWidget.element.dispatchEvent(event);
  }
}
export default AmountWidget;
