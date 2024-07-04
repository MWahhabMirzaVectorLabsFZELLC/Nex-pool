document.addEventListener('DOMContentLoaded', () => {
    const coverContent = document.querySelector('.cover-content');
    const cards = document.querySelectorAll('.card');
    const animations = ['fadeIn', 'slideInFromLeft', 'slideInFromRight', 'bounceIn'];
    
    let animationIndex = 0;
    
    setInterval(() => {
        coverContent.classList.remove(...animations);
        animationIndex = (animationIndex + 1) % animations.length;
        coverContent.classList.add(animations[animationIndex]);
    }, 5000);
    
    let cardAnimationIndex = 0;
    setInterval(() => {
        cards.forEach((card, index) => {
            card.classList.remove(...animations);
            card.classList.add(animations[(cardAnimationIndex + index) % animations.length]);
        });
        cardAnimationIndex = (cardAnimationIndex + 1) % animations.length;
    }, 5000);
});

document.addEventListener('DOMContentLoaded', () => {
    const coverPhotos = document.querySelectorAll('.cover-photo');
    let currentSlide = 0;

    setInterval(() => {
        coverPhotos[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % coverPhotos.length;
        coverPhotos[currentSlide].classList.add('active');
    }, 5000);
});
