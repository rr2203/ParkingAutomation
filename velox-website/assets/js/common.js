/*
 * Author: ArtStyles (ArtTemplate)
 * Template Name: ARCDECO
 * Version: 1.0.1
*/


$(document).ready(function() {

    'use strict';

    /*-----------------------------------------------------------------
      Detect device mobile
    -------------------------------------------------------------------*/

    var isMobile = false;
    if( /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('html').addClass('touch');
        isMobile = true;
    }
    else {
        $('html').addClass('no-touch');
        isMobile = false;
    }

	var isMacLike = /(Mac)/i.test(navigator.platform);


    /*-----------------------------------------------------------------
      Loaded
    -------------------------------------------------------------------*/

    var timeout = 3000;
	var tweenTime = 4; //sec

	var master = new TimelineMax({delay: tweenTime-1});
	master.eventCallback('onComplete', function() {
        tween(); //Init animations
		sliders(); //Init main slider
		jarallax(); //Init parallax images
    });

	$('body, .js-img-load').imagesLoaded({ background: !0 }).always( function( instance ) {
	    preloader(); //Init preloader
    });

	function preloader() {
		var tl = new TimelineMax({paused: true});
		tl.set('body', {
			className: '+=no-scroll'
		})
		.set('.preloader', {
			xPercent: '0',
			skewX: 0,
			skewType: 'simple'
		})
		.addLabel('first')
		.to('.preloader__logo', 1.5, {
			opacity: 1,
			scale: 1,
			webkitFilter: 'blur(0px)',
			ease: 'Power3.easeInOut'
		})
		.to('.preloader__progress span', 1, {
			width: '100%',
			ease: 'Power3.easeInOut'
		}, 'first+=.5')
		.to('.preloader', 1.3, {
			delay: 1,
			xPercent: '100',
			skewX: 15,
			transformOrigin: 'top left',
			ease: 'Power3.easeInOut'
		})
        .to('body', 0, {
			className: '-=no-scroll'
		}, '-=1.0');

        tl.duration(tweenTime).play();
        console.log(tl.endTime());

		return tl;
	};


    /*-----------------------------------------------------------------
      Smooth scroll
    -------------------------------------------------------------------*/

	function inertiaScroll() {
	    luxy.init({
		    wrapper: '.js-scroll',
		    targets : '.js-parallax',
		    wrapperSpeed: 0.08,
		    targetSpeed: 0.1,
		    targetPercentage: 0.1
	    });
	};

    inertiaScroll(); //Init


    /*-----------------------------------------------------------------
      Hamburger
    -------------------------------------------------------------------*/

    $('.hamburger').on('click', function() {
        $(this).toggleClass('is-active');
	    $('body').toggleClass('open');
    });

    // Closing the menu by Esc
    $(document).on('keyup', function(e) {
        if (e.keyCode === 27) $('.open .hamburger').click();
    });


    /*-----------------------------------------------------------------
      Overlay Nav
    -------------------------------------------------------------------*/

    var $navOverlay = $('.hamburger');
    var navTl = new TimelineMax({paused:true, reversed:true});

    $('.nav-overlay').each(function(i) {
        navTl.timeScale(1);
        navTl.to('.nav-overlay', 0, {
		   display: 'block',
           y: 0
		})
        .fromTo('.nav-overlay__bg', .9, {
		   scaleY: 0,
		   skewY: -5,
		   skewType: 'simple'
		}, {
			scaleY: 1,
            skewY: 0,
			transformOrigin: '0% 0%',
            ease: 'Power3.easeInOut'
		}, 'base')
        .staggerFromTo('.nav-overlay__menu-item', .4, {
            opacity: 0,
            y: -30
        }, {
			opacity: 1,
            y: 0
		},.1, 'base+=0.4');
    });

    $navOverlay.on('click', function() {
        navTl.reversed() ? navTl.play() : navTl.reverse();
    });

    // Hovered
    $('.nav-overlay__menu-item a').on('mouseenter', function(){
        $('.nav-overlay__menu').addClass('has-hovered');
    });
    $('.nav-overlay__menu-item a').on('mouseleave', function(){
        $('.nav-overlay__menu').removeClass('has-hovered');
    });


    /*-----------------------------------------------------------------
      Side Nav
    -------------------------------------------------------------------*/

    var $sideNavOpen = $('.hamburger');
    var tl = new TimelineMax({paused:true, reversed:true});

    $('.sideNav').each(function(i) {
        tl.timeScale(1);
        tl.to('.overlay-sideNav', 0.3, {
			opacity:1,
			zIndex:2,
			visibility:'visible'
		})
        .fromTo('.sideNav', 0.5, {
			xPercent: '100%',
			skewX: 15,
			scaleX: 0,
        }, {
			xPercent: 0,
			skewX: 0,
			scaleX: 1,
			ease: 'Back.easeOut.config(3)'
		}, '-=0.5')
        .staggerFrom('.sideNav__item', 0.2, {
            opacity: 0,
            x: 70,
            ease: Back.easeOut
        },0.06, '-=0.18');
    });

    $sideNavOpen.on('click', function() {
        tl.reversed() ? tl.play() : tl.reverse();
    });

    // Sub items
    $('.sideNav-collapsed').on('click', function() {
        $(this).toggleClass('sideNav__item-open').parent('li').siblings('li').children('span.sideNav-collapsed').removeClass('sideNav__item-open');
        $(this).parent().toggleClass('sideNav__item-open').children('ul').slideToggle(500).end().siblings('.sideNav__item-open').removeClass('sideNav__item-open').children('ul').slideUp(500);
    });


    /*-----------------------------------------------------------------
      Cursor
    -------------------------------------------------------------------*/

    var cursor = {
        delay: 8,
        _x: 0,
        _y: 0,
        endX: (window.innerWidth / 2),
        endY: (window.innerHeight / 2),
        cursorVisible: true,
        cursorEnlarged: false,
        $cursor: document.querySelector('.cursor'),
        $node: document.querySelector('.node'),

        init: function() {
			$('body').css('cursor', 'none');

            // Set up element sizes
            this.cursorSize = this.$cursor.offsetWidth;
            this.nodeSize = this.$node.offsetWidth;

            this.setupEventListeners();
            this.animateDotOutline();
			this.cursorDrag();
        },

        setupEventListeners: function() {
            var self = this;

            // Anchor hovering
			Array.prototype.slice.call(document.querySelectorAll('a, button, .zoom-cursor')).forEach(function (el) {
                el.addEventListener('mouseover', function() {
                    self.cursorEnlarged = true;
                    self.toggleCursorSize();
                });
                el.addEventListener('mouseout', function() {
                    self.cursorEnlarged = false;
                    self.toggleCursorSize();
                });
            });

            document.addEventListener('mousemove', function(e) {
                // Show the cursor
                self.cursorVisible = true;
                self.toggleCursorVisibility();

                // Position the dot
                self.endX = e.clientX;
                self.endY = e.clientY;
                self.$cursor.style.top = self.endY + 'px';
                self.$cursor.style.left = self.endX + 'px';
            });

            // Hide/show cursor
            document.addEventListener('mouseenter', function(e) {
                self.cursorVisible = true;
                self.toggleCursorVisibility();
                self.$cursor.style.opacity = 1;
                self.$node.style.opacity = 1;
            });

            document.addEventListener('mouseleave', function(e) {
                self.cursorVisible = true;
                self.toggleCursorVisibility();
                self.$cursor.style.opacity = 0;
                self.$node.style.opacity = 0;
            });
        },

        animateDotOutline: function() {
            var self = this;

            self._x += (self.endX - self._x) / self.delay;
            self._y += (self.endY - self._y) / self.delay;
            self.$node.style.top = self._y + 'px';
            self.$node.style.left = self._x + 'px';

            requestAnimationFrame(this.animateDotOutline.bind(self));
        },

        toggleCursorSize: function() {
            var self = this;

            if (self.cursorEnlarged) {
                self.$node.classList.add('expand');
            } else {
                self.$node.classList.remove('expand');
            }
        },

        toggleCursorVisibility: function() {
            var self = this;

            if (self.cursorVisible) {
                self.$cursor.style.opacity = 1;
                self.$node.style.opacity = 1;
            } else {
                self.$cursor.style.opacity = 0;
                self.$node.style.opacity = 0;
            }
        },

		cursorDrag: function() {
			var self = this;
			$('.cursorDrag').on('mouseenter', function(){
				self.$node.classList.add('drag', 'expand');
			});
			$('.cursorDrag').on('mouseleave', function(){
				self.$node.classList.remove('drag', 'expand');
			});
		}
    }

	if (!isMobile) {
        cursor.init(); //Init custom cursor
	}


    /*-----------------------------------------------------------------
      Magnetic
    -------------------------------------------------------------------*/

    $(document).on('mousemove', function(e){
        $('.magnetic').each(function() {
			if (!isMobile) {
                magnetic(this, e); //Init effect magnetic
			}
        });
    });

    function magnetic(el, e){
        var mX = e.pageX,
            mY = e.pageY;
        const obj = $(el);

        const customDist = 20 * obj.data('dist') || 80,
              centerX = obj.offset().left + obj.width() / 2,
              centerY = obj.offset().top + obj.height() / 2;

        var deltaX = Math.floor((centerX - mX)) * -.4,
            deltaY = Math.floor((centerY - mY)) * -.4;

        var distance = calcDistance(obj, mX, mY);

        if(distance < customDist){
            TweenMax.to(obj, .4, {
		        y: deltaY,
		        x: deltaX
	        });
        }
        else {
            TweenMax.to(obj, .4, {
		        y: 0,
		        x: 0
	        });
        }
    }

    function calcDistance(elem, mouseX, mouseY) {
        return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offset().left+(elem.width()/2)), 2) + Math.pow(mouseY - (elem.offset().top+(elem.height()/2)), 2)));
    }


    /*-----------------------------------------------------------------
      Scroll indicator
    -------------------------------------------------------------------*/

    function scrollIndicator() {
        $(window).on('scroll', function() {
            var wintop = $(window).scrollTop(), docheight =
            $(document).height(), winheight = $(window).height();
 	        var scrolled = (wintop/(docheight-winheight))*100;
  	        $('.scroll-line').css('width', (scrolled + '%'));
        });
    }

	scrollIndicator(); //Init


    /*-----------------------------------------------------------------
      ScrollTo
    -------------------------------------------------------------------*/

    function scrollToTop() {
        var $backToTop = $('.back-to-top'),
            $showBackTotop = $(window).height();

        $backToTop.hide();


        $(window).scroll( function() {
            var windowScrollTop = $(window).scrollTop();
            if( windowScrollTop > $showBackTotop ) {
                $backToTop.fadeIn('slow');
            } else {
                $backToTop.fadeOut('slow');
            }
        });

		$backToTop.on('click', function (e) {
            e.preventDefault();
            $(' body, html ').animate( {scrollTop : 0}, 'slow' );
        });
    }

	scrollToTop(); //Init


    /*-----------------------------------------------------------------
      Hiding Navbar on scroll down
    -------------------------------------------------------------------*/

	function hidingNavbar() {
        var c,
	        currentScrollTop = 0,
            $navbar = $('.navbar');

        $(window).scroll(function () {
            var a = $(window).scrollTop(),
                b = $navbar.height();

            currentScrollTop = a;

            if (c < currentScrollTop && a > b + b) {
                $navbar.addClass("scrollUp");
            } else if (c > currentScrollTop && !(a <= b)) {
                $navbar.removeClass("scrollUp");
            }
            c = currentScrollTop;
        });
    }

	hidingNavbar(); //Init


    /*-----------------------------------------------------------------
      Toggle Navbar
    -------------------------------------------------------------------*/

    function toggleNavbar() {
        $(window).on('scroll', function() {
	        $('.navbar-change').each(function(index, value) {
                var navToggle = $('#start').offset().top;

                if ($(window).scrollTop() >= navToggle){
                    $('.navbar').removeClass('navbar--white');
                } else {
                    $('.navbar').addClass('navbar--white');
                }
            });
        });
    }

	toggleNavbar(); //Init


    /*-----------------------------------------------------------------
      Slider
    -------------------------------------------------------------------*/

    // Main slider
    function sliders() {
        $('.slider').each(function() {
            var interleaveOffset = 0.7;

            var sliderCaption = new Swiper('.slider__caption', {
                slidesPerView: 1,
				loop: true,
				parallax: true,
                effect: 'fade',
				fadeEffect: {
                    crossFade: true
                },
                speed: 1200,
                simulateTouch: false,
				pagination: {
                    el: '.slider-pagination-fraction',
                    type: 'custom',
					progressbarOpposite: true,
		            clickable: false,
					renderCustom: function(swiper, current, total) {
                        var i = current ? current : 0;
                        return '<div>' + ('0' + i) + '</div><div>' + ('0' + total) + '</div>';
                    }
                }
            });

            var sliderImage = new Swiper('.slider__image', {
                slidesPerView: 1,
                loop: true,
				parallax: true,
			    speed: 1200,
                simulateTouch: false,
	            roundLengths: true,
				watchSlidesProgress: true,
                pagination: {
                    el: '.slider-pagination-progressbar',
                    type: 'progressbar',
					progressbarOpposite: true,
		            clickable: false
                },
                autoplay: {
                    disableOnInteraction: false,
					delay: 2500
                },
                keyboard: {
	                enabled: true
	            },
                mousewheel: {
		            eventsTarged: '.slider',
		            sensitivity: 1
	            },
                navigation: {
                    nextEl: '.slider-next',
                    prevEl: '.slider-prev'
                },
				breakpoints: {
					768: {
                        pagination: {
                            progressbarOpposite: false,
						}
                    }
				},
				on: {
                    progress: function() {
						if (!/Edge/.test(navigator.userAgent)) {
                            var swiper = this;
                            for (var i = 0; i < swiper.slides.length; i++) {
                                var slideProgress = swiper.slides[i].progress,
                                    innerOffset = swiper.width * interleaveOffset,
                                    innerTranslate = slideProgress * innerOffset;
                                swiper.slides[i].querySelector('.cover-slider').style.transform = 'translateX(' + innerTranslate + 'px)';
                            }
						}
                    },
                    touchStart: function() {
                        var swiper = this;
                        for (var i = 0; i < swiper.slides.length; i++) {
                            swiper.slides[i].style.transition = "";
                        }
                    },
                    setTransition: function(speed) {
						if (!/Edge/.test(navigator.userAgent)) {
                            var swiper = this;
                            for (var i = 0; i < swiper.slides.length; i++) {
                                swiper.slides[i].style.transition = speed + "ms";
                                swiper.slides[i].querySelector(".cover-slider").style.transition = speed + "ms";
                            }
						}
                    }
                }
            });

            sliderCaption.controller.control = sliderImage;
            sliderImage.controller.control = sliderCaption;
		});
	};

	// Portfolio carousel
	$('.carousel').each(function() {
		var carouselProject = new Swiper('.carousel-container', {
            slidesPerView: 4,
			parallax: true,
            speed: 1000,
            simulateTouch: false,
            keyboard: {
	            enabled: true
	        },
            mousewheel: {
		        eventsTarged: '.carousel',
		        sensitivity: 1
	        },
            navigation: {
                nextEl: '.slider-next',
                prevEl: '.slider-prev'
            },
			breakpoints: {
				1600: {
                    slidesPerView: 3
                },
				1024: {
                    slidesPerView: 2
                },
				768: {
                    slidesPerView: 1,
					simulateTouch: true
                }
			}
		});
	});

	// Project slider
	$('.project-slider').each(function() {
		var carouselProject = new Swiper('.project-slider', {
            slidesPerView: 'auto',
			centeredSlides: true,
			loop: true,
			grabCursor: true,
			//parallax: true,
            speed: 1000,
			watchSlidesProgress: true,
            pagination: {
                el: '.slider-pagination-progressbar',
                type: 'progressbar',
		        clickable: false
            }
		});
	});


    /*-----------------------------------------------------------------
      Style background image
    -------------------------------------------------------------------*/

    $('.js-image').each(function(){
        var dataImage = $(this).attr('data-image');
        $(this).css('background-image', 'url(' + dataImage + ')');
    });


    /*-----------------------------------------------------------------
      Autoresize textarea
    -------------------------------------------------------------------*/

    $('textarea').each(function(){
        autosize(this);
    });


    /*-----------------------------------------------------------------
      Switch categories & Filter mobile
    -------------------------------------------------------------------*/

    $('.select').on('click','.placeholder',function(){
      var parent = $(this).closest('.select');
      if ( ! parent.hasClass('is-open')){
          parent.addClass('is-open');
          $('.select.is-open').not(parent).removeClass('is-open');
      }else{
          parent.removeClass('is-open');
      }
    }).on('click','ul>li',function(){
        var parent = $(this).closest('.select');
        parent.removeClass('is-open').find('.placeholder').text( $(this).text() );
        parent.find('input[type=hidden]').attr('value', $(this).attr('data-value') );

	    $('.filter__item').removeClass('active');
	    $(this).addClass('active');
	    var selector = $(this).attr('data-filter');

	    $('.filter-container').isotope({
	        filter: selector
	    });
	    return false;
    });


    /*-----------------------------------------------------------------
      Masonry
    -------------------------------------------------------------------*/

    // Project
    var $projectMasonry = $('.project-masonry').isotope({
        itemSelector: '.content-grid__item',
	    layoutMode: 'fitRows',
        percentPosition: true,
	    transitionDuration: '0.5s',
        hiddenStyle: {
            opacity: 0,
            transform: 'scale(0.001)'
        },
        visibleStyle: {
            opacity: 1,
            transform: 'scale(1)'
        },
        fitRows: {
            gutter: '.gutter-sizer'
        },
        masonry: {
	        columnWidth: '.content-grid__item',
            gutter: '.gutter-sizer',
            isAnimated: true
        }
    });

    $projectMasonry.imagesLoaded().progress( function() {
        $projectMasonry.isotope ({
	        columnWidth: '.content-grid__item',
            gutter: '.gutter-sizer',
            isAnimated: true,
	        layoutMode: 'fitRows',
            fitRows: {
                gutter: '.gutter-sizer'
            }
	    });
    });

    // Post
    var $newsMasonry = $('.news-masonry').isotope({
        itemSelector: '.content-grid__item-two',
        percentPosition: true,
	    transitionDuration: '0.5s',
        hiddenStyle: {
            opacity: 0,
            transform: 'scale(0.001)'
        },
        visibleStyle: {
            opacity: 1,
            transform: 'scale(1)'
        },
        masonry: {
	        columnWidth: '.content-grid__item-two',
            gutter: '.gutter-sizer-two',
            isAnimated: true
        }
    });

    $newsMasonry.imagesLoaded().progress( function() {
        $newsMasonry.isotope ({
	        columnWidth: '.content-grid__item-two',
            gutter: '.gutter-sizer-two',
            isAnimated: true
	    });
    });


    /*-----------------------------------------------------------------
      Animations
    -------------------------------------------------------------------*/

	function tween() {
	    // init ScrollMagic
        var ctrl = new ScrollMagic.Controller();

	    //Tween for Filter
        $('.js-down-done').each(function() {
            var tl = new TimelineMax({delay: .4});
            tl.set('.filter__item', {
				y: 60,
				opacity: 0
			})
			.staggerTo('.filter__item', .3, {
                y: 0,
			    opacity: 1,
	            ease: 'Sine.easeIn'
            }, .02)
        });

        // Reveal image
		$('.reveal-overlay').each(function() {
			var tl = new TimelineMax({delay: .9});
			tl.set('.reveal-overlay', {
				z: 150
			})
            .fromTo(this, 1.2, {
                skewX: 30,
                scale: 2,
				skewType: 'simple'
            }, {
                skewX: 0,
                xPercent: 100,
                transformOrigin: '0% 100%',
                ease: 'Power2.easeOut'
            });

            new ScrollMagic.Scene({
                triggerElement: this,
	            triggerHook: 'onEnter',
				offset: 300,
	            reverse: false
            })
            .setTween(tl)
            .addTo(ctrl);
        });

		$('.reveal-box').each(function() {
			var tl = new TimelineMax();
			tl.set(this, {
				y: 80,
				opacity: 0
            })
			.to(this, .6, {
				y: 0,
				opacity: 1,
				ease: 'Power2.easeOut'
            });

            new ScrollMagic.Scene({
                triggerElement: this,
	            triggerHook: 'onEnter',
				offset: 200,
	            reverse: false
            })
            .setTween(tl)
            .addTo(ctrl);
        });

	    //Scale
        $('.js-scale').each(function() {
			var tl = new TimelineMax({delay: .3});
            tl.from(this, 1.0, {
                scale: 1.2,
			    opacity: 0,
	            ease: 'ExpoScaleEase.config(4, 1),'
            });
        });

	    //Words
        $('.js-words').each(function(i) {
			var $splitWords = $('.js-words');
	        var split = new SplitText($splitWords[i], {type: 'chars, words'});
	        var tl = new TimelineMax({delay: .4});
            tl.set(split.chars, {
                y: 60,
                opacity: 0
            })
            .staggerTo(split.chars, .3, {
                y: 0,
                opacity: 1,
                ease: 'Circ.easeOut'
            }, .02);

            new ScrollMagic.Scene({
                triggerElement: this,
	            triggerHook: 'onEnter',
	            reverse: false
            })
            .setTween(tl)
            .addTo(ctrl);
	    });

        // Lines
        $('.js-lines').each(function(i) {
			var $split = $('.js-lines');
	        var split = new SplitText($split[i], {type: 'lines', linesClass: 'tl-line'});
            var tl = new TimelineMax({delay: .4});
            tl.addLabel('enter')
            .staggerFromTo(split.lines, .6, {
                yPercent: 100
			}, {
				yPercent: 0,
	            ease: 'Circ.easeOut'
            }, .2, 'enter')
            .staggerFromTo(split.lines, .6, {
                opacity: 0
			}, {
				opacity: 1,
	            ease: 'Power1.easeOut'
            }, .2, 'enter');

            new ScrollMagic.Scene({
                triggerElement: this,
	            triggerHook: 'onEnter',
	            reverse: false
            })
            .setTween(tl)
            .addTo(ctrl);
        });
        $('.tl-line').wrap('<div></div>');

        // Show scroll
        $('.js-scroll-show').each(function() {
            var tl = new TimelineMax({delay: .3});
			tl.fromTo(this, 1, {
				y: 60,
                opacity: 0,
			}, {
                y: 0,
                opacity: 1,
	            ease: 'Circ.easeOut'
            });

            new ScrollMagic.Scene({
                triggerElement: this,
	            triggerHook: 'onEnter',
	            reverse: false
            })
            .setTween(tl)
            .addTo(ctrl);
        });

        // Hide scroll
        $('.js-scroll-hide').each(function() {
            var tl = new TimelineMax();
            tl.to(this, .4, {
                y: 60,
                opacity: 0,
	            ease: 'Power0.easeNone'
            });

            new ScrollMagic.Scene({
                triggerElement: this,
	            triggerHook: 'onLeave',
	            duration: 300
            })
            .setTween(tl)
            .addTo(ctrl);
        });

		// List
		$('.list-row').each(function() {
			tl = new TimelineMax();
			tl.timeScale(1);
            tl.staggerFromTo('.js-list', 1.2, {
				opacity: 0,
                xPercent: -100,
			}, {
                opacity: 1,
                xPercent: 0,
                ease: 'Expo.easeOut'
            },0.06);

            new ScrollMagic.Scene({
                triggerElement: this,
	            triggerHook: 'onEnter',
				reverse: false
            })
            .setTween(tl)
            .addTo(ctrl);
        });
	};

	// Init effect zooming item grid
	function zoomingItem() {
        $('.js-zooming').on('mouseenter', function(){
            $(this).addClass('has-hovered');
            $(this).removeClass('not-hovered');
        });
        $('.js-zooming').on('mouseleave', function(){
            $(this).removeClass('has-hovered');
            $(this).addClass('not-hovered');
        });
	};

	if (!isMobile) {
	    zoomingItem(); // Init
	};


    /*-----------------------------------------------------------------
      Start video
    -------------------------------------------------------------------*/

    function videoPlay($wrapper) {
        var $iframe = $wrapper.find('.js-video-iframe'),
        src = $iframe.data('src');
        $wrapper.addClass('is-active'),
	    $iframe.attr('src', src)
    }
    $(document).on('click', '.video__btn', function(e) {
        e.preventDefault();
        var $btn = $(this),
        $wrapper = $btn.closest('.js-video');
        $btn.addClass('is-active'), videoPlay($wrapper)
    });


    /*-----------------------------------------------------------------
      Jarallax
    -------------------------------------------------------------------*/

    function jarallax() {
        $('.jarallax').jarallax({
            speed: .8,
			disableParallax: /iPhone|iPod|Android/
        });

        $('.jarallax-keep-img').jarallax({
            speed: .8,
            keepImg: true,
			disableParallax: /iPhone|iPod|Android/
        });

        $('.jarallaxVideo').jarallax({
			speed: .8,
            disableVideo: /iPhone|iPod|Android/
        });
    };


    /*-----------------------------------------------------------------
      Parallax mouse
    -------------------------------------------------------------------*/

	var timeoutParallax;

    $('.parallax-container').mousemove(function(e){
        if(timeoutParallax) clearTimeout(timeoutParallax);
            setTimeout(callParallax.bind(null, e), 200);
    });

    function callParallax(e){
        parallaxIt(e, '.error-page', -50);
    }

    function parallaxIt(e, target, movement){
		if (!isMobile) {
            var $this = $('.parallax-container'),
                relX = e.pageX - $this.offset().left,
                relY = e.pageY - $this.offset().top;

            TweenMax.to(target, 1, {
                x: (relX - $this.width()/2) / $this.width() * movement,
                y: (relY - $this.height()/2) / $this.height() * movement,
                ease: Power2.easeOut
            })
		}
    }


    /*-----------------------------------------------------------------
	  mediumZoom
    -------------------------------------------------------------------*/

    mediumZoom($('[data-zoomable]').toArray())


    /*-----------------------------------------------------------------
      Lazyload
    -------------------------------------------------------------------*/

    lazySizes.init();


    /*-----------------------------------------------------------------
      Polyfill object-fit
    -------------------------------------------------------------------*/

    var $someImages = $('img.cover');
    objectFitImages($someImages);


    /*-----------------------------------------------------------------
      Video background
    -------------------------------------------------------------------*/

	$('#js-video-bg').each(function() {
	    setTimeout(function(){
            document.getElementById('js-video-bg').play();
        }, 2500);
    });


    /*-----------------------------------------------------------------
      Contacts form
    -------------------------------------------------------------------*/

    $("#contact-form").validator().on("submit", function (event) {
        if (event.isDefaultPrevented()) {
            formError();
            submitMSG(false, "Please fill in the form...");
        } else {
            event.preventDefault();
            submitForm();
        }
    });

    function submitForm(){
        var name = $("#nameContact").val(),
            email = $("#emailContact").val(),
            phone = $("#phoneContact").val(),
            message = $("#messageContact").val();

        var url = "send_mail.html";

        $.ajax({
            type: "POST",
            url: url,
            data: "name=" + name + "&email=" + email + "&message=" + message + "&phone=" + phone,
            success : function(text){
                if (text == "success"){
                    formSuccess();
                } else {
                    formError();
                    submitMSG(false,text);
                }
            }
        });
    }

    function formSuccess(){
        $("#contact-form")[0].reset();
        submitMSG(true, "Thanks! Your message has been sent.");
    }

    function formError(){
        $("#contactForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass();
        });
    }

    function submitMSG(valid, msg){
		var msgClasses;
        if(valid){
            msgClasses = "validation-success";
        } else {
           msgClasses = "validation-danger";
        }
        $("#validator-contact").removeClass().addClass(msgClasses).text(msg);
    }
});
