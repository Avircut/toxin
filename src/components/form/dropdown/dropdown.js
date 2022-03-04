import './date-dropdown/date-dropdown';
class Dropdown{
  constructor(el) {
    this.el = el;
    this.summary = el.querySelector('summary');
    this.defaultplaceholder = el.querySelector('summary').innerHTML;
    this.content = el.querySelector('.item-container');
    this.plusBtns = el.querySelectorAll('.plus-btn');
    this.minusBtns = el.querySelectorAll('.minus-btn');

    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.summary.addEventListener('click', (e) =>
      this.onClick(e));
    this.summary.addEventListener('linkedDropdownClick', (e) =>
      this.onLinkedDropdownClick(e));
    document.addEventListener('click', (e) => {
      if (!e.target.closest('details')) this.shrink(); 
    });
    this.plusBtns.forEach((el) => {
      el.addEventListener('click', (e) => 
        this.onItemPlusClick(e));
    })
    this.minusBtns.forEach((el) => {
      el.addEventListener('click', (e) => 
        this.onItemMinusClick(e));
    })
  }
  onClick(e) {
    e.preventDefault();
    const datepickers = this.el.parentNode.parentNode.querySelectorAll('.datepicker');
    if (this.el.querySelectorAll('.item-container>*').length < 1){ // Отключение раскрытия элемента, если у него нет потомков.
      let clickevent = new Event('linkedDropdownClick');
      datepickers[0].classList.remove('active');
      datepickers[1].classList.add('active');
      const firstDropdown = this.el.parentNode.parentNode.querySelector('.dropdown>summary');
      firstDropdown.dispatchEvent(clickevent);
      return;
    }
    datepickers[0].classList.add('active');
    datepickers[1].classList.remove('active');
    if (this.isClosing || !this.el.open){
      this.open();
    }
  }
  onLinkedDropdownClick(e){
    if (this.isClosing || !this.el.open){
      this.open();
    }
  }
  onItemPlusClick(e){
    let classes = e.target.className;
    if (classes.indexOf('btn_disabled')>0) return;
    const item = e.target.parentNode;
    const itemText = item.querySelector('.item-content').innerHTML;
    let itemAmount = item.querySelector('.amount').innerHTML;
    const minusBtn = item.querySelector('.minus-btn');
    const plusBtn = item.querySelector('.plus-btn');
    item.querySelector('.amount').innerHTML = `${++itemAmount}`;
    if (itemAmount === 1) minusBtn.classList.toggle('btn_disabled'); 
    if (itemAmount === 4) plusBtn.classList.toggle('btn_disabled');
    this.placeholderUpdate();
  }
  onItemMinusClick(e){
    let classes = e.target.className;
    if (classes.indexOf('btn_disabled')>0) return;
    const item = e.target.parentNode;
    const itemText = item.querySelector('.item-content').innerHTML;
    let itemAmount = item.querySelector('.amount').innerHTML;
    const minusBtn = item.querySelector('.minus-btn');
    const plusBtn = item.querySelector('.plus-btn');
    item.querySelector('.amount').innerHTML = `${--itemAmount}`;
    if (itemAmount === 0) minusBtn.classList.toggle('btn_disabled');
    if (itemAmount === 3) plusBtn.classList.toggle('btn_disabled');
    this.placeholderUpdate();
  }
  shrink() {
    this.isClosing = true;
    const startHeight = `${this.content.offsetHeight}px`;
    const endHeight = `0px`;
    this.el.style.borderBottomRightRadius = '4px';
    this.el.style.borderBottomLeftRadius = '4px';
    if (this.animation){
      this.animation.cancel();
    }

    this.animation = this.content.animate({
      opacity: ['1','0'],
      height: [startHeight, endHeight]
    },{
      duration: 200,
      easing: 'ease-out',
    });
    this.animation.onfinish = () => this.onAnimationFinish(false);

    this.animation.oncancel = () => this.isClosing = false;
  }
  open() {
    this.el.style.height = `${this.el.offsetHeight}px`;
    this.el.open = true;
    window.requestAnimationFrame(() => this.expand());
  }
  expand() {
    this.isExpanding = true;
    const startHeight = `0px`;
    const endHeight = `${this.content.offsetHeight}px`;
    this.el.style.borderBottomRightRadius = '0px';
    this.el.style.borderBottomLeftRadius = '0px';
    
    if (this.animation) {
      this.animation.cancel();
    }
    
    this.animation = this.content.animate({
      opacity: ['0','1'],
      height: [startHeight, endHeight]
    }, {
      duration: 200,
      easing: 'ease-out'
    });
    this.animation.onfinish = () => this.onAnimationFinish(true);
    this.animation.oncancel = () => this.isExpanding = false;
  }

  onAnimationFinish(open){
    this.el.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;

    this.el.style.height = this.el.style.overflow = '';
  }
  placeholderUpdate(){
    const items = [...this.el.querySelectorAll('.item-content')];
    const amounts = [...this.el.querySelectorAll('.amount')];
    let placeholderWords = items.map(o => o.innerHTML);
    let placeholderNumbers = amounts.map(o => o.innerHTML);
    this.summary.innerHTML='';
    for(let i=0; i<items.length;i++){
      let lastnum = placeholderNumbers[i].substring(placeholderNumbers[i].length-1);
      switch (placeholderWords[i]){
        case 'спальни':{
          if(lastnum === '1') placeholderWords[i] = 'спальня';
          break;
        }
        case 'кровати':{
          if (lastnum === '1') placeholderWords[i] = 'кровать';
          break;
        }
        case 'ванные комнаты':{
          if (lastnum === '1') placeholderWords[i] = 'ванная комната';
          break;
        }
      }
      if (placeholderNumbers[i] != 0){
        this.summary.innerHTML+=placeholderNumbers[i] +' '+ placeholderWords[i];
        if (i < items.length - 1) this.summary.innerHTML+=', ';
      } 
      
    }
    this.summary.innerHTML = this.summary.innerHTML.substring(0,this.summary.innerHTML.length-2);
    if(this.summary.innerHTML === '') this.summary.innerHTML = this.defaultplaceholder;
  }
}
document.querySelectorAll('.dropdown').forEach((el) => {
  new Dropdown(el);
});