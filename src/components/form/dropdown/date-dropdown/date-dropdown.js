import {DateRangePicker,Datepicker} from "vanillajs-datepicker";
const dateDropdowns = document.querySelectorAll('.date-dropdown');
console.log(dateDropdowns);
dateDropdowns.forEach((dropdown) => {
  let dateRangePicker = new DateRangePicker(dropdown);
  dateRangePicker.setOptions({language:'ru'})
  console.log(dateRangePicker)
  let inputs = dropdown.querySelectorAll('input');
  let texts = dropdown.querySelectorAll('summary')
  inputs.forEach( (el,index) => {
    inputs[index].addEventListener('changeDate', () => {
      let dates =dateRangePicker.getDates();
      texts[index].innerHTML = dates[index];
    })
  });
})
const masked = document.querySelector('.masked>.text-field');
let lol = new Datepicker(masked, {format:'d.M.y'})  // TODO(Avircut): Change format type and locale