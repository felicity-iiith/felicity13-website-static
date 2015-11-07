$(function(){
	
	var $container = $('#container'),
		loading = false,
		currentVideoInterval,
		$loader = $('<div class="loader"></div>').hide();
	
	function classToggle($elem, className) {
	
		$('.' + className).removeClass(className);
		$elem.addClass(className);
		
		if (className == 'loading') {
		
			$('.loader').remove();
			$elem.append($loader);
			$loader.fadeIn(400);
		
		}
	}
	
	
	function openItem() {
	
		var $elem = $(this),
			$openContent = $(".item.open .content"),
			$content = $elem.children('.content'),
			elemId = $elem.attr('id'),
			imageURL = $content.attr('data-image'),
			videoId = $content.attr('data-video-id'),
			videoWidth = $content.attr('data-width'),
			videoHeight = $content.attr('data-height'),
			playerType = $content.attr('data-player'),
			$slider = $content.parent().find(".seek");
			$playpause = $slider.siblings(".playpause");
		
		$openContent.tubeplayer("pause");
		
		if (loading) { return };
		
		if (imageURL) {

			$content.html('<img src="' + imageURL + '" />');
			classToggle($elem, 'loading');
			loading = true;
		
		}
		
		if (videoId) {
			
			$content.css({'width' : videoWidth, 'height' : videoHeight}); //resizing content area for isotope
			
					function sliderPlaying() {
				
				lightsOff($elem, true);
				
				if (playerType == "youtube" || !playerType) {
				
					$playpause.addClass('playing');
					clearInterval(currentVideoInterval); //Prevents more than one interval
					
					currentVideoInterval = window.setInterval(function() {
						
						
						var value = $content.tubeplayer("data");
	
						
						$slider.slider("option", "value", Math.floor(value.currentTime/value.duration*100));
					
					}, 2000);
				
				}
				
			}
			
			if (playerType == "youtube" || !playerType) {
				
				$content.tubeplayer({
				
					initialVideo: videoId,
					width: videoWidth,
					height: videoHeight,
					showControls: 0,
					modestbranding: true,
					iframed: false, //Stops buggy behaviour with iframe version and isotope
					onPlayerPlaying: function(){
						sliderPlaying();
					},
					allowFullScreen: false,
					onPlayerPaused: function() {
						clearInterval(currentVideoInterval);
						$playpause.removeClass('playing');
					}
			
				});
				
			} else if (playerType == "vimeo") {
				
				function rgbToHex(rgb) { 
				  var rgbvals = /rgb\((.+),(.+),(.+)\)/i.exec(rgb); 
				  var rval = parseInt(rgbvals[1]); 
				  var gval = parseInt(rgbvals[2]); 
				  var bval = parseInt(rgbvals[3]); 
				  return ( 
					rval.toString(16) + 
					gval.toString(16) + 
					bval.toString(16) 
				  ).toUpperCase(); 
				} 
				
				var playerColor = $elem.find('.ribbonHead h4').css('backgroundColor'),
					playerColor = rgbToHex(playerColor);
					

				
				$content.html('<iframe id="player1" src="http://player.vimeo.com/video/' + videoId + '?title=0&byline=0&portrait=0&api=1&player_id=player1&color=' + playerColor + '" ' +
				' width="' + videoWidth + '" height="' + videoHeight + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
				
				
				
				var iframe = $('#player1')[0],
					player = $f(iframe);
				
				
				player.addEvent('ready', function() {
					
					player.addEvent('play', sliderPlaying)

				});
				
				
			}
			
			
	
		
			$slider.on("slidestop", function(event, ui){
			
				if (playerType == "youtube" || !playerType) {
			
					var sliderPos = $(this).slider( "option", "value" ),
						value =  $content.tubeplayer("data");
						
					$content.tubeplayer("seek", Math.floor(value.duration/100*sliderPos));
					
				}
				
				
				
			});
			
			$playpause.off("click").on("click", function() { //unbind with "off" to stop multiple bindings of same button
				
				if (playerType == "youtube" || !playerType) {
				
					if ($(this).hasClass('playing')) {
					
						$content.tubeplayer("pause");
					
					} else {
					
						$content.tubeplayer("play");
					
					}
				}
			
			})
			
		
		}
		
		$content.waitForImages( function () {
			
			loading = false;
			
			$openContent.tubeplayer("destroy"); //Removes any video elements
			$openContent.parent().find(".seek").slider("option", "value", 0); //resets slider of closed video element
			$openContent.parent().find(".playpause").removeClass("playing"); //Resets play button
			
			$('.loading').removeClass('loading');
			$('.loader').remove();
			
			classToggle($elem, 'open');
			
			$('.item').off('click', openItem); //Open item no longer clickable
			$('.item:not(.open)').on('click', openItem); //Rebind all closed items
			
			$('.item img').off('click', lightsOff); //Unbind any lights off
			$(".item img").off('mousemove', bulbTip); //Unbind any Tooltip bulb
			$('.open:not(.info) img').on('click', lightsOff); //Lights off bind
			$(".open:not(.info) img").on('mousemove', bulbTip); //Tooltip bulb
			$(".open:not(.info) img").on('mouseout', function() {
			
				$('#lightbulb').hide();
			
			});
			
			
			$("html").addClass("scrolling"); // Fixes scroll bug by making page very high for a moment
			
			$container.isotope('reLayout', function() {
			
				var position = $elem.data('isotope-item-position'),
					positionY = position.y - 100;
					containerHeight = $container.height();
					
				if (positionY < 0) { positionY = 0} 
			
				$("body").scrollTo(positionY, 500, {easing: "easeInOutQuad"})
				$("html").removeClass("scrolling");
				
			});
				
				
		});
		
		
	};
	
	function lightsOff($elem, video) {
		
		
		$('.item img').off('mousemove', bulbTip); //Unbind tooltip
		$(".open:not(.info)").on('mouseover', function() {
		
			$('#lightbulb').hide();
			
		});
		
		if (video != true) {
		
			var $elem = $(this).parents('.item');

		}
		
		$elem.addClass('lightsOff');
		$('#overlay').show('fade', 'fast', function() {
		
			$('#lightbulb').hide();
		
		});

	}
	
	function lightsOn() {
		
		$('#overlay').hide('fade', 'fast', function() {
		
			$('#lightbulb').hide();
			$(".open:not(.info) img").on('mousemove', bulbTip); //Tooltip bulb
		
		});
		
		$('.lightsOff').removeClass('lightsOff');
	
	}
	
	function bulbTip(e) {

		$('#lightbulb').show().css({
		
			top: (e.pageY - 15) + "px",
            left: (e.pageX + 15) + "px"
		
		});
	
	}
	
	//Building ribbon stuffs
	$('.item:not(.info) h4').each(function() {
	
		$(this).wrap('<div class="ribbonHead"></div>').after('<div class="ribbonBack"></div>');
		
	})
	
	$('.item:not(.info) h5.categories').each(function() {
	
		$(this).wrap('<div class="ribbonTag" />').after('<div class="ribbonBack"></div>');
	
	})
	
	$('.item:not(.info) h5.caption').each(function() {
	
		$(this).wrap('<div class="ribbonTag ribbonCaption" />').after('<div class="ribbonBack ribbonCaption"></div>');
	
	})

	$('.item.video h5.caption').each(function() {
		
		$(this).append('<div class="playpause"></div><div class="seek"></div>');
	
	})
	
	//binding stuffs
	$(window).on('mousewheel', function() {
		
		$(window)._scrollable().stop(); //Cancels scrolling animation when mousewheel is used, to stop conflict.
		
	}) 
	
	$('#overlay').on('click', lightsOn);
	$('#overlay').on('mousemove', bulbTip);
	
	$('.item:not(.open)').on('click', openItem);
	
	$('#nav ul li').on('click', function() {
		
		
		var filter = $(this).children('a').attr('data-filter');
		
		$('.selected').removeClass('selected');
		$(this).addClass('selected');
		
		
		$container.isotope({
		
			filter: '.static' + ' ,' + filter
			
		}, function() {
	
			$(window).stop().scrollTo($("#container"), 500, {easing: "easeInOutQuad"});
		
		})
	
	});
	
	$container.isotope({
		masonry: {
			columnWidth: 193
		},
		itemPositionDataEnabled: true,
		transformsEnabled: false
		
	});
	
	
	
	$(".seek").slider({range: "min", min: 0});
	



});