document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.tooltip-rotate').forEach(wrapper => {
    const items = wrapper.querySelectorAll('.plot-item');
    const interval = wrapper.getAttribute('data-interval');
    let currentIndex = 0;

    if (!items.length) return;

    // Set first active
    items[currentIndex].classList.add('active');

    setInterval(() => {
      items[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % items.length;
      items[currentIndex].classList.add('active');
    }, interval);
  });
});
