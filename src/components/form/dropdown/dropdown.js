class Dropdown{
  constructor(el) {
    this.el = el;
    this.summary = el.querySelector('summary');
    this.content = el.querySelector('.item-container');
    this.plusBtns = el.querySelectorAll('.plus-btn');
    this.minusBtns = el.querySelectorAll('.minus-btn');

    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.summary.addEventListener('click', (e) =>
      this.onClick(e));
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
    this.el.style.overflow = 'hidden';
    if (this.isClosing || !this.el.open){
      this.open();
    } else {
      this.shrink();
    }
  }
  onItemPlusClick(e){
    const item = e.target.parentNode;
    console.log(item);
    const itemText = item.querySelector('.item-content').innerHTML;
    let itemAmount = item.querySelector('.amount').innerHTML;
    const minusBtn = item.querySelector('.minus-btn');
    const plusBtn = item.querySelector('.plus-btn');
    item.querySelector('.amount').innerHTML = `${++itemAmount}`;
    console.log(itemAmount);
    if (itemAmount === 1) minusBtn.classList.toggle('btn_disabled'); 
    if (itemAmount === 4) plusBtn.classList.toggle('btn_disabled');
    this.placeholderUpdate();
  }
  onItemMinusClick(e){
    const item = e.target.parentNode;
    const itemText = item.querySelector('.item-content').innerHTML;
    let itemAmount = item.querySelector('.amount').innerHTML;
    const minusBtn = item.querySelector('.minus-btn');
    const plusBtn = item.querySelector('.plus-btn');
    item.querySelector('.amount').innerHTML = `${--itemAmount}`;
    if (itemAmount === 0) minusBtn.classList.toggle('btn_disabled'); 
    if (itemAmount === 3) plusBtn.classList.toggle('btn_disabled'); // TODO(Avircut): Add disabled button functionality
    this.placeholderUpdate();
  }
  shrink() {
    this.isClosing = true;
    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight}px`;
    this.el.style.borderBottomRightRadius = '4px';
    this.el.style.borderBottomLeftRadius = '4px';
    if (this.animation){
      this.animation.cancel();
    }

    this.animation = this.el.animate({
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
    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;
    this.el.style.borderBottomRightRadius = '0px';
    this.el.style.borderBottomLeftRadius = '0px';
    
    if (this.animation) {
      this.animation.cancel();
    }
    
    this.animation = this.el.animate({
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
  placeholderUpdate(){// TODO(Avircut): Добавить окончания для слов в зависимости от цифры
    const items = [...this.el.querySelectorAll('.item-content')];
    const amounts = [...this.el.querySelectorAll('.amount')];
    let placeholderWords = items.map(o => o.innerHTML);
    let placeholderNumbers = amounts.map(o => o.innerHTML);
    this.summary.innerHTML='';
    for(let i=0; i<items.length;i++){
      if(placeholderNumbers[i]!=0) this.summary.innerHTML+=' ' + placeholderNumbers[i] +' '+ placeholderWords[i];
      if(i < items.length - 1) this.summary.innerHTML+=',';
    }
  }
}
document.querySelectorAll('.dropdown').forEach((el) => {
  new Dropdown(el);
});