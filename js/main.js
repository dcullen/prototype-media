$(bc).bind("init", function () {
    bc.device.setAutoRotateDirections([bc.ui.orientation.LANDSCAPE_LEFT, bc.ui.orientation.LANDSCAPE_RIGHT]);
    document.addEventListener('touchmove', function(e){ e.preventDefault(); });

    /* Calls function to reinitialize height/width based app elements on device orientation change. */
    $( bc ).bind( "vieworientationchange", function( evt, rslt ) {
        if(rslt.orientation == 'portrait'){
            portraitMode();
        }else{
            landscapeMode();
        }
    });
});


/**
*   
*   Page Change functionality.  This uses a new framework that is still very much a work in progress.
*
*/

list_load = function(el){
    if(el.hasClass('border_top')){
        clear_video_area();
    }else{
        clear_video_area();
        $('.view_list_popup').removeClass('border_top');
        $('#'+el.attr('data-id')+'_list').css('-webkit-transform', 'translate3d(0, 0, 0)');
        el.addClass('border_top');
    }
}

splash_load = function(){
    $('.input_box').bind('tap', function(e){
        $(this).val('');
    });
    $('#submit').bind('tap', function(e){
        lm.controller.changePage('video');
    }); 
}

splash_unload = function(){
    $('#splash').hide();
}

social_load = function(){
    if($('#social').hasClass('open')){
        clear_video_area();
    }else{
        clear_video_area();
        $('#social_popup').css('-webkit-transform', 'translate3d(0, 0, 0)');
        $($('#social')).addClass('open');
    }
}

queue_load = function(){
    clear_video_area();
    $(this).addClass('queue_open');
    $('#queue').css('-webkit-transform', 'translate3d(0, 0, 0)');
}

queue_unload = function(){
    $(this).removeClass('queue_open');
    clear_video_area();
}

tweet_popup_load = function(){
    $('#tweet_popup').show();
    setTimeout(function(){
        clear_video_area();
        $('#tweet_popup').css('opacity', 1);
        $('#tweet_popup').css('-webkit-transform', 'translate3d(0, 0, 0)');
    }, 500);
} 

tweet_popup_unload = function(){
    $('#tweet_popup').css('opacity', 0);
    $('#tweet_popup').css('-webkit-transform', 'translate3d(0, 50px, 0)');
    setTimeout(function(){
        $('#tweet_popup').hide();
    }, 500);
} 

video_init = function(){
/**
   * Sets up video playlist
   * This will soon be pulling from the app/video cloud apis.
   */
    currentShow = 0;
    showCount = 5;
    shows = 
        {
           0 : { 
            showName : 'Revolution',
            showTwitter : 'NBCRevolution',
            showVideo : 'http://brightcove.vo.llnwd.net/pd22/media/1403111656001/1403111656001_1638392572001_94007-REVOLUTION-DIGITAL-VE1280X720.mp4'
            },
           1 : { 
            showName : 'Go On',
            showTwitter : 'NBCGo_On',
            showVideo : 'http://brightcove.vo.llnwd.net/pd22/media/1403111656001/1403111656001_1638358695001_94008-GO-ON-DIGITAL-VER1280X720.mp4'
            },
           2 : { 
            showName : 'Chicago Fire',
            showTwitter : 'NBCChicagoFire',
            showVideo : 'http://brightcove.vo.llnwd.net/pd22/media/1403111656001/1403111656001_1637973274001_94018-CHICAGO-FIRE-DIGITAL-VER-1280X720.mp4'
            },
           3 : { 
            showName : 'Animal Practice',
            showTwitter : 'AnimalPractice',
            showVideo : 'http://brightcove.vo.llnwd.net/pd22/media/1403111656001/1403111656001_1638351504001_94009-ANIMAL-PRACTICE-DIGITAL-VER1280X720.mp4'
            },
           4 : { 
            showName : 'Guys With Kids',
            showTwitter : 'NBCGuysWithKids',
            showVideo : 'http://brightcove.vo.llnwd.net/pd22/media/1403111656001/1403111656001_1638134116001_94013-GUYS-WITH-KIDS-DIGITAL-VER1280X720.mp4'
            },
           5 : { 
            showName : 'The New Normal',
            showTwitter : 'NBCTheNewNormal',
            showVideo : 'http://brightcove.vo.llnwd.net/pd22/media/1403111656001/1403111656001_1638132543001_94010-THE-NEW-NORMAL-DIGITAL-VER-1280X720.mp4'
            } 
        };

    $('#video').show();
    /**
       * Initializes video player in lm-app-0.1.js
       * This player is in a very beta state.  Will soon be easy to replicate on different apps/devices.
       */
    lm.video.init();
    /* Update content based on the video list */
    $('#showname').html(shows[0].showName);
    $('#show_title').html(shows[0].showName);

    /* Calls twitter API to get content based on the video list.  Also gets called on video change.  */
    get_twitter_content(shows[0].showTwitter);

    /* Sets up all scrollers for the app in one go. This will soon be part of a larger class.  */
    build_scrollers();

    /**
       *
       * Binds all buttons at once.  This takes a little longer up front but limits javascripts work later on.
       *
       */
    $('#right_header').bind('tap', function(e){
        lm.controller.changePage('queue', {runInit: false});
    });

    $('#queue_header').bind('tap', function(e){
        lm.controller.unload();        
    });

    $('.seasons').bind('tap', function(e){
        $('.seasons').removeClass('green_text');
        $(this).addClass('green_text');
        $('#now_playing_content').css('opacity', 0);
        setTimeout(function(){
            $('#now_playing_content').css('opacity', 1);
        }, 500);
    });

    $('#now_playing_content li').bind('tap', function(e){
        clear_video_area();
        setTimeout(function(){
            lm.video.loadShow();
        }, 50);
    });

    $('#queue_content li').bind('tap', function(e){
        clear_video_area();
        setTimeout(function(){
            lm.video.loadShow();
        }, 50);
    });

    $('.video_menu_item_left').bind('tap', function(e){
        $('.video_menu_item_left').removeClass('green_text');
        $(this).addClass('green_text');
        $('.video_list_content').css('opacity', 0);
        setTimeout(function(){
            shuffleNodes(document.getElementById("all_video_list"));
            $('.video_list_content').css('opacity', 1);
        }, 500);
    });

    $('.view_list_popup').bind('tap', function(e){
        lm.controller.changePage($(this).attr('data-id')+'_list', {runInit: false, loadFunction: list_load($(this))});
    });
    $('#social').bind('tap', function(e){
        lm.controller.changePage('social', {runInit: false});
    });
    $('.social_small').bind('tap', function(e){
        lm.controller.changePage('tweet_popup', {runInit: false});
    });
    $('.tweet_buttons').bind('tap', function(e){
        lm.controller.unload();
    });
    $('.social_close').bind('tap', function(e){
        clear_video_area();
    });

    $('#video_player').bind('tap', function(e){
        $('#drag_info').css('opacity', 1);
    });

    /* Creates the different drag/drop sections.  This code needs to be improved. */
    create_drag_info();
    create_drag_nowplaying();
    drag_and_drop();

    /* Sets app up based on orientation */
    if(bc.context.viewOrientation == 'portrait'){
        portraitMode();
    }else{
        landscapeMode();
    }
};

/** Clears all popups.  This will soon be controlled with classes instead of inline css (bad) */
    var clear_video_area = function(){
        $('#movies_list').css('-webkit-transform', 'translate3d(0, 800px, 0)');
        $('#series_list').css('-webkit-transform', 'translate3d(0, 800px, 0)');
        $('#sports_list').css('-webkit-transform', 'translate3d(0, 800px, 0)');
        $('#documentaries_list').css('-webkit-transform', 'translate3d(0, 800px, 0)');
        $('#left_header').removeClass('now_playing_open');
        $('.view_list_popup').removeClass('border_top');
        $('.arrow_up').css('-webkit-transform', 'rotate(180deg)');
        $('#now_playing').css('-webkit-transform', 'translate3d(0, -230px, 0)');
        $('#queue').css('-webkit-transform', 'translate3d(0, -230px, 0)');
        $('#header').css('-webkit-transform', 'translate3d(0, 0, 0)');
        $('#social').removeClass('open');
        $('#social_popup').css('-webkit-transform', 'translate3d(0, 800px, 0)');
        if(!$('#more_info').hasClass('closed')){
            $('#more_info').addClass('closed');
            $('#more_info').css('-webkit-transition-duration', '500ms');
            $('#more_info').css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 350, 0, 0, 1)');
        }
    }

    
    var create_drag_info = function(){
        $('#drag_info').bind('touchstart', function(e){
            if(typeof dragInterval != undefined){
                window.clearInterval(dragInterval)
            }
        });
        $('#drag_info').bind('touchmove', function(e){
            if(bc.context.viewOrientation == 'portrait'){
                $('#more_info').css('-webkit-transition-duration', '0ms');
                $('#more_info').css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, '+(e.originalEvent.touches[0].pageX-400)+', 0, 0, 1)');
            }else{
                $('#more_info').css('-webkit-transition-duration', '0ms');
                $('#more_info').css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, '+(e.originalEvent.touches[0].pageX-660)+', 0, 0, 1)');    
            }
        });
        $('#drag_info').bind('touchend', function(e){
            moreinfo = $('#more_info');


            if(bc.context.viewOrientation == 'portrait'){
                if(moreinfo.hasClass('closed')){
                    if(moreinfo.position().left > 686){
                        move_container(moreinfo, 350);
                    }else{
                        clear_video_area();
                        moreinfo.removeClass('closed');
                        move_container(moreinfo, 0);
                    }
                }else{
                    if(moreinfo.position().left > 500){
                        moreinfo.addClass('closed');
                        move_container(moreinfo, 350);
                    }else{
                        clear_video_area();
                        moreinfo.removeClass('closed');
                        move_container(moreinfo, 0);
                    }
                }
            }else{
                if(moreinfo.hasClass('closed')){
                    if(moreinfo.position().left > 886){
                        move_container(moreinfo, 350);
                    }else{
                        clear_video_area();
                        moreinfo.removeClass('closed');
                        move_container(moreinfo, 0);
                    }
                }else{
                    if(moreinfo.position().left > 700){
                        moreinfo.addClass('closed');
                        move_container(moreinfo, 350);
                    }else{
                        clear_video_area();
                        moreinfo.removeClass('closed');
                        move_container(moreinfo, 0);
                    }
                }
            }
            dragInterval = window.setInterval(function(t){
                if($('#more_info').hasClass('closed')){
                    $('#drag_info').css('opacity', 0);
                }
            },5000);
        });
        var move_container = function(element, distance){
            moreinfo.css('-webkit-transition-duration', '500ms');
            element.css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, '+distance+', 0, 0, 1)');
        }
    };
    var create_drag_nowplaying = function(){
        
        $('#left_header').bind('touchstart', function(e){
            if($('#header').hasClass('closed')){
                $('#header').css('-webkit-transition-duration', '500ms');
                $('#header').css('-webkit-transform', 'translate3d(0, 10px, 0)');
            }
        });
        $('#left_header').bind('touchmove', function(e){
            $('#header').css('-webkit-transition-duration', '0ms');
            $('#now_playing').css('-webkit-transition-duration', '0ms');
            $('#now_playing').css('-webkit-transform','matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, '+(e.originalEvent.touches[0].pageY-250)+', 0, 1)');
            $('#header').css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, '+(e.originalEvent.touches[0].pageY-20)+', 0, 1)');
        });
        $('#left_header').bind('touchend', function(e){
            moreinfo = $('#header');
            now_playing = $('#now_playing');
            if(moreinfo.hasClass('closed')){
                if(moreinfo.position().top < 80){
                    $('#left_header').removeClass('now_playing_open');
                    now_playing_move(0, -230, 180);
                }else{
                    clear_video_area();
                    moreinfo.removeClass('closed');
                    $('#left_header').addClass('now_playing_open');
                    now_playing_move(230, 0, 0);
                }
            }else{
                if(moreinfo.position().top < 160){
                    moreinfo.addClass('closed');
                    $('#left_header').removeClass('now_playing_open');
                    now_playing_move(0, -230, 180);
                }else{
                    clear_video_area();
                    moreinfo.removeClass('closed');
                    $('#left_header').addClass('now_playing_open');
                    now_playing_move(230, 0, 0);
                }
            }
        });
    };

    startTime = 0;
    endTime = 0;
    startPos = 0;
    first = 1;
    drag_start = 0;
    timer = '';

    var drag_and_drop = function(){
        $('#all_video_list li').bind('touchstart',function(e){
            e.preventDefault();

            //Drag start timer - the time the user must hold the item before dragging is initialized - currently 500ms
            timer = setTimeout(function(){
                drag_start = 1;
                startPos = e.originalEvent.touches[0].pageY;
            }, 500);
            
        }).bind('touchmove', function(e) {
            e.preventDefault();
            var touch = e.originalEvent.changedTouches[0];
            

            if(drag_start == 1){
                if(first == 1){
                    $('#drag_item').css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, '+$(this).offset().left+', '+$(this).offset().top+', 0, 1)');
                    $('#drag_item_background').css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, '+$(this).offset().left+', '+$(this).offset().top+', 0, 1)');                    
                    $('#drag_item').show();
                    $('#drag_item_background').show();
                    if(movie_vert_scroller != null){
                       movie_vert_scroller.disable();
                    }
                    if(sports_vert_scroller != null){
                       sports_vert_scroller.disable();
                    }
                    $('#drag_background').show();

                    setTimeout(function(){
                        $('#drag_background').css('opacity', '.8');
                    }, 100);
                    open_add_queue();
                    first = 0;
                }
                if(e.originalEvent.touches[0].pageY <= 120)
                {
                   $('#dragged_item').show();
                   $('#drag_item').hide();
                   $('#drag_item_background').hide();
                }
                 if(e.originalEvent.touches[0].pageY > 120)
                {
                   $('#dragged_item').hide();
                   $('#drag_item').show();
                   $('#drag_item_background').show();
                }
                $('#drag_item').css('-webkit-transition-duration', '0ms');
                $('#drag_item').css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, '+(touch.pageX-55)+', '+(touch.pageY-92)+', 0, 1)');
                $('#drag_item_background').css('-webkit-transition-duration', '0ms');
                $('#drag_item_background').css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, '+(touch.pageX-55)+', '+(touch.pageY-92)+', 0, 1)');
            }
        }).bind('touchend', function(e){
            endTime = e.timeStamp || Date.now();
            if((endTime-startTime) < 80){
                clear_video_area();
                setTimeout(function(){
                    lm.video.loadShow();
                }, 50);
            }
            e.preventDefault();
            $('#drag_item').hide();
            $('#drag_item_background').hide();
            first = 1;
            drag_start = 0;
            startTime = 0;
            endTime = 0;
            startPos = 0;
            close_add_queue();
            $('#drag_background').css('opacity', '0');
            setTimeout(function(){
                $('#drag_background').hide();
            }, 500);
            if(movie_vert_scroller != null){
               movie_vert_scroller.enable();
            }
            if(sports_vert_scroller != null){
               sports_vert_scroller.enable();
            }
            clearTimeout(timer);
        });
    }

    var now_playing_move = function(moreinfo_distance, now_playing_distance, rotate){
        $('.arrow_up').css('-webkit-transform', 'rotate('+rotate+'deg)');
        moreinfo = $('#header');
        now_playing = $('#now_playing');
        moreinfo.css('-webkit-transition-duration', '500ms');
        moreinfo.css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, '+moreinfo_distance+', 0, 1)');
        now_playing.css('-webkit-transition-duration', '500ms');
        now_playing.css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, '+now_playing_distance+', 0, 1)');
    }

    var open_add_queue = function(){
        $('#header').css('-webkit-transition-duration', '500ms');
        $('#header').css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 120, 0, 1)');
        $('#drag_background').css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 120, 0, 1)');
        $('#drag_queue').css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
        $('#drag_queue_background').css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');

    }

    var close_add_queue = function(){
        $('#header').css('-webkit-transition-duration', '500ms');
        $('#header').css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
        $('#drag_background').css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
        $('#drag_queue').css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, -120, 0, 1)');
        $('#drag_queue_background').css('-webkit-transform',  'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, -120, 0, 1)');
    }

    /* This needs to be based on a settings object/array */
    var build_scrollers = function(elementId, horizontal, vertical){
        sports_scroller = scroller('sports_scroller', true, false);
        sports_vert_scroller = scroller('sports_vert_scroller', false, true);
        movie_scroller = scroller('movie_scroller', true, false);
        movie_vert_scroller = scroller('movie_vert_scroller', false, true);
        queue_content = scroller('queue_content', true, false);
        now_playing_content = scroller('now_playing_content', true, false);
    }

    var resetScrollers = function() {
        setTimeout(function () {
            sports_scroller.refresh();
            sports_vert_scroller.refresh();
            movie_scroller.refresh();
            movie_vert_scroller.refresh();
            queue_content.refresh();
            now_playing_content.refresh();
        }, 500);
    };

    var scroller = function(elementId, horizontal, vertical){
        iscroller = new iScroll(elementId, {
            hScroll: horizontal, vScroll: vertical, hScrollbar: false, vScrollbar: false, momentum: true
        });
        return iscroller;
    }

    
    var get_twitter_content = function(feed){
        if(typeof social_content_scroller != 'undefined'){
            social_content_scroller.destroy();
        }
        $.ajax({
            url: 'http://search.twitter.com/search.json?q='+encodeURIComponent(feed)+'&rpp=10',
            dataType: 'jsonp',
            async: false,
            success: function(data){
                twitter_feed = '';
                for (var i=0; i<data["results"].length; i++) {
                    twitter_feed += '<li>';
                    twitter_feed += '<div class="twitter_logo"><img height="48" width="48" src="'+ data["results"][i]['profile_image_url'] +'" /></div>';
                    twitter_feed += '<div class="twitter_content">';
                    twitter_feed += '<div class="twitter_name">'+data["results"][i]['from_user']+'</div>';
                    twitter_feed += data["results"][i]['text'];
                    twitter_feed += '</div>';
                    twitter_feed += '</li>';
                }
                $('#social_content ul').html(twitter_feed);
                setTimeout(function(){
                    social_content_scroller = scroller('social_content', false, true);
                }, 200);
            }
        });
    }
    var shuffle = function(items)
    {
        var cached = items.slice(0), temp, i = cached.length, rand;
        while(--i)
        {
            rand = Math.floor(i * Math.random());
            temp = cached[rand];
            cached[rand] = cached[i];
            cached[i] = temp;
        }
        return cached;
    }
    var shuffleNodes = function(element)
    {
        var nodes = element.children, i = 0;
        nodes = Array.prototype.slice.call(nodes);
        nodes = shuffle(nodes);
        while(i < nodes.length)
        {
            element.appendChild(nodes[i]);
            ++i;
        }
    }

    var portraitMode = function(){
        $('#player').css('width', '768px');
        $('#player').css('height', '432px');
        $('#more_info, #drag_info_background, #movie_vert_scroller #all_video_list, #header, #loading, #now_playing, .video_list, #queue, #progress, #video_player, .video_list_header').addClass('vert');
        lm.video.createProgressBar();
        resetScrollers();
    };

    var landscapeMode = function(){
        $('#player').css('width', '1024px');
        $('#player').css('height', '576px');
        $('#more_info, #drag_info_background, #movie_vert_scroller #all_video_list, #header, #loading, #now_playing, .video_list, #queue, #progress, #video_player, .video_list_header').removeClass('vert');
        lm.video.createProgressBar();
        resetScrollers();
    };