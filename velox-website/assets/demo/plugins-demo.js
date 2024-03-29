/*!
 * pep.js
 */
!function(a,b){"function"==typeof define&&define.amd?define(b):a.Dragdealer=b()}(this,function(){function j(a){var b="Webkit Moz ms O".split(" "),c=document.documentElement.style;if(void 0!==c[a])return a;a=a.charAt(0).toUpperCase()+a.substr(1);for(var d=0;d<b.length;d++)if(void 0!==c[b[d]+a])return b[d]+a}function k(a){i.backfaceVisibility&&i.perspective&&(a.style[i.perspective]="1000px",a.style[i.backfaceVisibility]="hidden")}var a=function(a,b){this.options=this.applyDefaults(b||{}),this.bindMethods(),this.wrapper=this.getWrapperElement(a),this.wrapper&&(this.handle=this.getHandleElement(this.wrapper,this.options.handleClass),this.handle&&(this.init(),this.bindEventListeners()))};a.prototype={defaults:{disabled:!1,horizontal:!0,vertical:!1,slide:!0,steps:0,snap:!1,loose:!1,speed:.1,xPrecision:0,yPrecision:0,handleClass:"handle",css3:!0,activeClass:"active",tapping:!0},init:function(){this.options.css3&&k(this.handle),this.value={prev:[-1,-1],current:[this.options.x||0,this.options.y||0],target:[this.options.x||0,this.options.y||0]},this.offset={wrapper:[0,0],mouse:[0,0],prev:[-999999,-999999],current:[0,0],target:[0,0]},this.change=[0,0],this.stepRatios=this.calculateStepRatios(),this.activity=!1,this.dragging=!1,this.tapping=!1,this.reflow(),this.options.disabled&&this.disable()},applyDefaults:function(a){for(var b in this.defaults)a.hasOwnProperty(b)||(a[b]=this.defaults[b]);return a},getWrapperElement:function(a){return"string"==typeof a?document.getElementById(a):a},getHandleElement:function(a,b){var c,d,e;if(a.getElementsByClassName){if(c=a.getElementsByClassName(b),c.length>0)return c[0]}else for(d=new RegExp("(^|\\s)"+b+"(\\s|$)"),c=a.getElementsByTagName("*"),e=0;e<c.length;e++)if(d.test(c[e].className))return c[e]},calculateStepRatios:function(){var a=[];if(this.options.steps>=1)for(var b=0;b<=this.options.steps-1;b++)a[b]=this.options.steps>1?b/(this.options.steps-1):0;return a},setWrapperOffset:function(){this.offset.wrapper=h.get(this.wrapper)},calculateBounds:function(){var a={top:this.options.top||0,bottom:-(this.options.bottom||0)+this.wrapper.offsetHeight,left:this.options.left||0,right:-(this.options.right||0)+this.wrapper.offsetWidth};return a.availWidth=a.right-a.left-this.handle.offsetWidth,a.availHeight=a.bottom-a.top-this.handle.offsetHeight,a},calculateValuePrecision:function(){var a=this.options.xPrecision||Math.abs(this.bounds.availWidth),b=this.options.yPrecision||Math.abs(this.bounds.availHeight);return[a?1/a:0,b?1/b:0]},bindMethods:function(){this.requestAnimationFrame="function"==typeof this.options.customRequestAnimationFrame?b(this.options.customRequestAnimationFrame,window):b(m,window),this.cancelAnimationFrame="function"==typeof this.options.customCancelAnimationFrame?b(this.options.customCancelAnimationFrame,window):b(n,window),this.animateWithRequestAnimationFrame=b(this.animateWithRequestAnimationFrame,this),this.animate=b(this.animate,this),this.onHandleMouseDown=b(this.onHandleMouseDown,this),this.onHandleTouchStart=b(this.onHandleTouchStart,this),this.onDocumentMouseMove=b(this.onDocumentMouseMove,this),this.onWrapperTouchMove=b(this.onWrapperTouchMove,this),this.onWrapperMouseDown=b(this.onWrapperMouseDown,this),this.onWrapperTouchStart=b(this.onWrapperTouchStart,this),this.onDocumentMouseUp=b(this.onDocumentMouseUp,this),this.onDocumentTouchEnd=b(this.onDocumentTouchEnd,this),this.onHandleClick=b(this.onHandleClick,this),this.onWindowResize=b(this.onWindowResize,this)},bindEventListeners:function(){c(this.handle,"mousedown",this.onHandleMouseDown),c(this.handle,"touchstart",this.onHandleTouchStart),c(document,"mousemove",this.onDocumentMouseMove),c(this.wrapper,"touchmove",this.onWrapperTouchMove),c(this.wrapper,"mousedown",this.onWrapperMouseDown),c(this.wrapper,"touchstart",this.onWrapperTouchStart),c(document,"mouseup",this.onDocumentMouseUp),c(document,"touchend",this.onDocumentTouchEnd),c(this.handle,"click",this.onHandleClick),c(window,"resize",this.onWindowResize),this.animate(!1,!0),this.interval=this.requestAnimationFrame(this.animateWithRequestAnimationFrame)},unbindEventListeners:function(){d(this.handle,"mousedown",this.onHandleMouseDown),d(this.handle,"touchstart",this.onHandleTouchStart),d(document,"mousemove",this.onDocumentMouseMove),d(this.wrapper,"touchmove",this.onWrapperTouchMove),d(this.wrapper,"mousedown",this.onWrapperMouseDown),d(this.wrapper,"touchstart",this.onWrapperTouchStart),d(document,"mouseup",this.onDocumentMouseUp),d(document,"touchend",this.onDocumentTouchEnd),d(this.handle,"click",this.onHandleClick),d(window,"resize",this.onWindowResize),this.cancelAnimationFrame(this.interval)},onHandleMouseDown:function(a){g.refresh(a),e(a),f(a),this.activity=!1,this.startDrag()},onHandleTouchStart:function(a){g.refresh(a),f(a),this.activity=!1,this.startDrag()},onDocumentMouseMove:function(a){g.refresh(a),this.dragging&&(this.activity=!0,e(a))},onWrapperTouchMove:function(a){return g.refresh(a),!this.activity&&this.draggingOnDisabledAxis()?(this.dragging&&this.stopDrag(),void 0):(e(a),this.activity=!0,void 0)},onWrapperMouseDown:function(a){g.refresh(a),e(a),this.startTap()},onWrapperTouchStart:function(a){g.refresh(a),e(a),this.startTap()},onDocumentMouseUp:function(){this.stopDrag(),this.stopTap()},onDocumentTouchEnd:function(){this.stopDrag(),this.stopTap()},onHandleClick:function(a){this.activity&&(e(a),f(a))},onWindowResize:function(){this.reflow()},enable:function(){this.disabled=!1,this.handle.className=this.handle.className.replace(/\s?disabled/g,"")},disable:function(){this.disabled=!0,this.handle.className+=" disabled"},reflow:function(){this.setWrapperOffset(),this.bounds=this.calculateBounds(),this.valuePrecision=this.calculateValuePrecision(),this.updateOffsetFromValue()},getStep:function(){return[this.getStepNumber(this.value.target[0]),this.getStepNumber(this.value.target[1])]},getValue:function(){return this.value.target},setStep:function(a,b,c){this.setValue(this.options.steps&&a>1?(a-1)/(this.options.steps-1):0,this.options.steps&&b>1?(b-1)/(this.options.steps-1):0,c)},setValue:function(a,b,c){this.setTargetValue([a,b||0]),c&&(this.groupCopy(this.value.current,this.value.target),this.updateOffsetFromValue(),this.callAnimationCallback())},startTap:function(){!this.disabled&&this.options.tapping&&(this.tapping=!0,this.setWrapperOffset(),this.setTargetValueByOffset([g.x-this.offset.wrapper[0]-this.handle.offsetWidth/2,g.y-this.offset.wrapper[1]-this.handle.offsetHeight/2]))},stopTap:function(){!this.disabled&&this.tapping&&(this.tapping=!1,this.setTargetValue(this.value.current))},startDrag:function(){this.disabled||(this.dragging=!0,this.setWrapperOffset(),this.offset.mouse=[g.x-h.get(this.handle)[0],g.y-h.get(this.handle)[1]],this.wrapper.className.match(this.options.activeClass)||(this.wrapper.className+=" "+this.options.activeClass),this.callDragStartCallback())},stopDrag:function(){if(!this.disabled&&this.dragging){this.dragging=!1;var a=this.groupClone(this.value.current);if(this.options.slide){var b=this.change;a[0]+=4*b[0],a[1]+=4*b[1]}this.setTargetValue(a),this.wrapper.className=this.wrapper.className.replace(" "+this.options.activeClass,""),this.callDragStopCallback()}},callAnimationCallback:function(){var a=this.value.current;this.options.snap&&this.options.steps>1&&(a=this.getClosestSteps(a)),this.groupCompare(a,this.value.prev)||("function"==typeof this.options.animationCallback&&this.options.animationCallback.call(this,a[0],a[1]),this.groupCopy(this.value.prev,a))},callTargetCallback:function(){"function"==typeof this.options.callback&&this.options.callback.call(this,this.value.target[0],this.value.target[1])},callDragStartCallback:function(){"function"==typeof this.options.dragStartCallback&&this.options.dragStartCallback.call(this,this.value.target[0],this.value.target[1])},callDragStopCallback:function(){"function"==typeof this.options.dragStopCallback&&this.options.dragStopCallback.call(this,this.value.target[0],this.value.target[1])},animateWithRequestAnimationFrame:function(a){a?(this.timeOffset=this.timeStamp?a-this.timeStamp:0,this.timeStamp=a):this.timeOffset=25,this.animate(),this.interval=this.requestAnimationFrame(this.animateWithRequestAnimationFrame)},animate:function(a,b){if(!a||this.dragging){if(this.dragging){var c=this.groupClone(this.value.target),d=[g.x-this.offset.wrapper[0]-this.offset.mouse[0],g.y-this.offset.wrapper[1]-this.offset.mouse[1]];this.setTargetValueByOffset(d,this.options.loose),this.change=[this.value.target[0]-c[0],this.value.target[1]-c[1]]}(this.dragging||b)&&this.groupCopy(this.value.current,this.value.target),(this.dragging||this.glide()||b)&&(this.updateOffsetFromValue(),this.callAnimationCallback())}},glide:function(){var a=[this.value.target[0]-this.value.current[0],this.value.target[1]-this.value.current[1]];return a[0]||a[1]?(Math.abs(a[0])>this.valuePrecision[0]||Math.abs(a[1])>this.valuePrecision[1]?(this.value.current[0]+=a[0]*Math.min(this.options.speed*this.timeOffset/25,1),this.value.current[1]+=a[1]*Math.min(this.options.speed*this.timeOffset/25,1)):this.groupCopy(this.value.current,this.value.target),!0):!1},updateOffsetFromValue:function(){this.offset.current=this.options.snap?this.getOffsetsByRatios(this.getClosestSteps(this.value.current)):this.getOffsetsByRatios(this.value.current),this.groupCompare(this.offset.current,this.offset.prev)||(this.renderHandlePosition(),this.groupCopy(this.offset.prev,this.offset.current))},renderHandlePosition:function(){var a="";return this.options.css3&&i.transform?(this.options.horizontal&&(a+="translateX("+this.offset.current[0]+"px)"),this.options.vertical&&(a+=" translateY("+this.offset.current[1]+"px)"),this.handle.style[i.transform]=a,void 0):(this.options.horizontal&&(this.handle.style.left=this.offset.current[0]+"px"),this.options.vertical&&(this.handle.style.top=this.offset.current[1]+"px"),void 0)},setTargetValue:function(a,b){var c=b?this.getLooseValue(a):this.getProperValue(a);this.groupCopy(this.value.target,c),this.offset.target=this.getOffsetsByRatios(c),this.callTargetCallback()},setTargetValueByOffset:function(a,b){var c=this.getRatiosByOffsets(a),d=b?this.getLooseValue(c):this.getProperValue(c);this.groupCopy(this.value.target,d),this.offset.target=this.getOffsetsByRatios(d)},getLooseValue:function(a){var b=this.getProperValue(a);return[b[0]+(a[0]-b[0])/4,b[1]+(a[1]-b[1])/4]},getProperValue:function(a){var b=this.groupClone(a);return b[0]=Math.max(b[0],0),b[1]=Math.max(b[1],0),b[0]=Math.min(b[0],1),b[1]=Math.min(b[1],1),(!this.dragging&&!this.tapping||this.options.snap)&&this.options.steps>1&&(b=this.getClosestSteps(b)),b},getRatiosByOffsets:function(a){return[this.getRatioByOffset(a[0],this.bounds.availWidth,this.bounds.left),this.getRatioByOffset(a[1],this.bounds.availHeight,this.bounds.top)]},getRatioByOffset:function(a,b,c){return b?(a-c)/b:0},getOffsetsByRatios:function(a){return[this.getOffsetByRatio(a[0],this.bounds.availWidth,this.bounds.left),this.getOffsetByRatio(a[1],this.bounds.availHeight,this.bounds.top)]},getOffsetByRatio:function(a,b,c){return Math.round(a*b)+c},getStepNumber:function(a){return this.getClosestStep(a)*(this.options.steps-1)+1},getClosestSteps:function(a){return[this.getClosestStep(a[0]),this.getClosestStep(a[1])]},getClosestStep:function(a){for(var b=0,c=1,d=0;d<=this.options.steps-1;d++)Math.abs(this.stepRatios[d]-a)<c&&(c=Math.abs(this.stepRatios[d]-a),b=d);return this.stepRatios[b]},groupCompare:function(a,b){return a[0]==b[0]&&a[1]==b[1]},groupCopy:function(a,b){a[0]=b[0],a[1]=b[1]},groupClone:function(a){return[a[0],a[1]]},draggingOnDisabledAxis:function(){return!this.options.horizontal&&g.xDiff>g.yDiff||!this.options.vertical&&g.yDiff>g.xDiff}};for(var b=function(a,b){return function(){return a.apply(b,arguments)}},c=function(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,c)},d=function(a,b,c){a.removeEventListener?a.removeEventListener(b,c,!1):a.detachEvent&&a.detachEvent("on"+b,c)},e=function(a){a||(a=window.event),a.preventDefault&&a.preventDefault(),a.returnValue=!1},f=function(a){a||(a=window.event),a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0},g={x:0,y:0,xDiff:0,yDiff:0,refresh:function(a){a||(a=window.event),"mousemove"==a.type?this.set(a):a.touches&&this.set(a.touches[0])},set:function(a){var b=this.x,c=this.y;a.clientX||a.clientY?(this.x=a.clientX,this.y=a.clientY):(a.pageX||a.pageY)&&(this.x=a.pageX-document.body.scrollLeft-document.documentElement.scrollLeft,this.y=a.pageY-document.body.scrollTop-document.documentElement.scrollTop),this.xDiff=Math.abs(this.x-b),this.yDiff=Math.abs(this.y-c)}},h={get:function(a){var b={left:0,top:0};return void 0!==a.getBoundingClientRect&&(b=a.getBoundingClientRect()),[b.left,b.top]}},i={transform:j("transform"),perspective:j("perspective"),backfaceVisibility:j("backfaceVisibility")},l=["webkit","moz"],m=window.requestAnimationFrame,n=window.cancelAnimationFrame,o=0;o<l.length&&!m;++o)m=window[l[o]+"RequestAnimationFrame"],n=window[l[o]+"CancelAnimationFrame"]||window[l[o]+"CancelRequestAnimationFrame"];return m||(m=function(a){return setTimeout(a,25)},n=clearTimeout),a});

/*!
 * Elastic border
 */
$(".elastic-border").each(function(t){function s(t,i,o){this.x=t,this.ix=t,this.vx=0,this.cx=0,this.y=i,this.iy=i,this.cy=0,this.canvas=o}function h(){var t=$(".elastic-border"),i=t.get(0).getContext("2d");for(a=requestAnimationFrame(h),i.clearRect(0,0,t.width(),t.height()),i.fillStyle=l.leftColor,i.fillRect(0,0,t.width(),t.height()),o=0;o<=l.totalPoints-1;o++)n[o].move();for(i.fillStyle=l.rightColor,i.strokeStyle=l.rightColor,i.lineWidth=1,i.beginPath(),i.moveTo($(window).width()/2,0),o=0;o<=l.totalPoints-1;o++)e=n[o],null!=n[o+1]?(e.cx=(e.x+n[o+1].x)/2-1e-4,e.cy=(e.y+n[o+1].y)/2):(e.cx=e.ix,e.cy=e.iy),i.bezierCurveTo(e.x,e.y,e.cx,e.cy,e.cx,e.cy);if(i.lineTo($(window).width(),$(window).height()),i.lineTo($(window).width(),0),i.closePath(),i.fill(),l.showIndicators){for(i.fillStyle="#000",i.beginPath(),o=0;o<=l.totalPoints-1;o++)e=n[o],i.rect(e.x-2,e.y-2,4,4);i.fill(),i.fillStyle="#fff",i.beginPath();for(var o=0;o<=l.totalPoints-1;o++){var e=n[o];i.rect(e.cx-1,e.cy-1,2,2)}i.fill()}}var n=[],a=null,l=new function(){this.totalPoints=2,this.viscosity=10,this.mouseDist=100,this.damping=.05,this.showIndicators=!1,this.leftColor="#ffffff",this.rightColor="#110f10"},e=0,r=0,i=0,o=0,c=0,f=0;$(document).on("mousemove",function(t){c=e<t.pageX?1:e>t.pageX?-1:0,r<t.pageY?1:r>t.pageY?-1:0,e=t.pageX,r=t.pageY}),function t(){f=e-i,r-o,i=e,o=r,setTimeout(t,50)}(),s.prototype.move=function(){this.vx+=(this.ix-this.x)/l.viscosity;var t=this.ix-e,i=this.y-r,o=this.canvas.data("gap");(0<c&&e>this.x||c<0&&e<this.x)&&Math.sqrt(t*t)<l.mouseDist&&Math.sqrt(i*i)<o&&(this.vx=f/8),this.vx*=1-l.damping,this.x+=this.vx},$(window).on("resize",function(){!function(){var t=$(".elastic-border");t.get(0).getContext("2d"),cancelAnimationFrame(a),$(".elastic-border").get(0).width=$(window).width(),$(".elastic-border").get(0).height=$(window).height(),n=[];for(var i=t.height()/(l.totalPoints-1),o=$(window).width()/2,e=0;e<=l.totalPoints-1;e++)n.push(new s(o,e*i,t));h(),t.data("gap",i)}()}).trigger("resize")});

/*-----------------------------------------------------------------
  Loaded
-------------------------------------------------------------------*/

	var tweenTime = 4; //sec

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

/*!
 * Slide nav
 */

var slideOpen = document.querySelector('.slideOpen');
var slideClose = document.querySelector('.slideClose');
var slideCloseOverlay = document.querySelector('.overlay-slideNav');

var tl = new TimelineMax({ paused: true });

$('.slideNav').each(function(i) {
  tl.timeScale(1);
  tl.to('.overlay-slideNav', 0.3, { opacity: 1, zIndex:2, visibility:"visible" })
  
  .to(slideOpen, 0.5, {
    x: 300,
    opacity: 0,
    ease: Power2.easeInOut
  },'-=0.5')

  .to('.slideNav', 0.5, {
    x: 0,
    ease: Power2.easeInOut
  },'-=0.5')

  .to(slideClose, 0.5, {
    x: 0,
    opacity: 1,
    rotation: 360,
    ease: Power1.easeInOut
  },'-=0.5')

  .staggerFrom('.slideNav__item', 0.2, {
    opacity: 0,
    x: 70,
    ease: Back.easeOut
  },0.06, '-=0.18');

  openMenu = function openMenu() {return tl.play();};
  closeMenu = function closeMenu() {return tl.reverse();};

  slideOpen.addEventListener('click', openMenu, false);
  slideClose.addEventListener('click', closeMenu, false);
  slideCloseOverlay.addEventListener('click', closeMenu, false);
  
});