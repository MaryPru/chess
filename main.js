document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        offset: 0,
        delay: 0,
        duration: 1000,
        easing: 'ease',
        once: true,
    });
    const root = document.documentElement;
    const marqueeElementsDisplayed = getComputedStyle(root).getPropertyValue("--marquee-elements-displayed");

    const marqueeContents = document.querySelectorAll("ul.marquee-content");

    marqueeContents.forEach(marqueeContent => {
        root.style.setProperty("--marquee-elements", marqueeContent.children.length);

        for (let i = 0; i < marqueeElementsDisplayed; i++) {
            marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
        }

        let offset = 0;
        const speed = 1.5;

        function animate() {
            offset -= speed;

            if (Math.abs(offset) >= marqueeContent.scrollWidth / 2) {
                offset = 0;
            }

            marqueeContent.style.transform = `translateX(${offset}px)`;
            requestAnimationFrame(animate);
        }

        animate();
    });

    const swiper = new Swiper('.swiper', {
        loop: true,
        spaceBetween: 20,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 10,
            },

            768: {
                slidesPerView: 2,
            },
            1280: {
                slidesPerView: 3,
            },
        },
        on: {
            init: function () {
                updateControls(this);
            },
            slideChange: function () {
                updateControls(this);
            },
            resizeObserver: function () {
                this.update();
                updateControls(this);
            },
        },
    });

    function updateControls(swiper) {
        const totalSlides = swiper.slides.length;

        const windowWidth = window.innerWidth;

        if (windowWidth < 768) {
            currentIndex = swiper.realIndex + 1;
            if (currentIndex > totalSlides) {
                currentIndex = 1;
                swiper.slideTo(0);
            }
        } else if (windowWidth < 1280) {
            currentIndex = swiper.realIndex + 2;
            if (currentIndex > totalSlides) {
                currentIndex = 2;
                swiper.slideTo(0);
            }
        } else {
            currentIndex = swiper.realIndex + 3;
            if (currentIndex > totalSlides) {
                currentIndex = 3;
                swiper.slideTo(0);
            }
        }

        const totalSlidesElement = document.querySelector('.total-slides');
        document.querySelector('.current-slide').textContent = currentIndex;
        totalSlidesElement.textContent = totalSlides;

        const prev = document.querySelector('.swiper-button-prev');
        const next = document.querySelector('.swiper-button-next');

        if (currentIndex >= totalSlides) {
            totalSlidesElement.classList.add('disabled');
        } else {
            totalSlidesElement.classList.remove('disabled');
        }
    }

    let swiperInstance = null;

    function initOrDestroySwiper() {
        const grid = document.querySelector('.stages-grid');
        const wrapper = grid.querySelector('.swiper-wrapper');

        if (window.innerWidth < 900) {
            if (!swiperInstance) {
                grid.classList.add('slider');

                const wrapperEl = document.createElement('div');
                wrapperEl.classList.add('swiper-wrapper');

                const children = Array.from(grid.children);
                children.forEach(child => {
                    child.classList.add('swiper-slide');
                    wrapperEl.appendChild(child);
                });

                grid.appendChild(wrapperEl);

                swiperInstance = new Swiper('.stages-grid', {
                    spaceBetween: 12,
                    slidesPerView: 1,
                    loop: false,
                    navigation: {
                        nextEl: '.slider-button-next',
                        prevEl: '.slider-button-prev',
                    },
                    pagination: {
                        el: ".swiper-pagination",
                    },

                });
            }
        } else {
            if (swiperInstance) {
                swiperInstance.destroy(true, true);
                swiperInstance = null;

                grid.classList.remove('slider');

                if (wrapper) {
                    const slides = Array.from(wrapper.children);
                    slides.forEach(slide => {
                        slide.classList.remove('swiper-slide');
                        grid.appendChild(slide);
                    });

                    wrapper.remove();
                }
            }
        }
    }


    window.addEventListener('load', initOrDestroySwiper);
    window.addEventListener('resize', initOrDestroySwiper);
});
