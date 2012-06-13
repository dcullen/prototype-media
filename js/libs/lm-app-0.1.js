/**
 * lm is the namespace for all functions, properties, and events available through the Lightmaker App Library.
 * @namespace
 */
var lm = {};

/**
 * Lightmaker Content Controller  Contains functions to manage app navigation.
 * @namespace
 */
lm.controller = {};

/**
 * Lightmaker Video Player  Contains functions to manage video player
 * @namespace
 */
lm.video = {};

( function( $, undefined ) {

/** 
* An array that keeps track of the page history.
*/
lm.controller.pageStack = [];

/**
 * @private
 */
lm.controller.options = undefined;

/** To automatically get JS files*/
lm.controller.getJs = true;

/** The currently active page, meaning the page that is currently in view.*/
lm.controller.currentPage = undefined;

/** The last active page, meaning the page that was last in view.*/
lm.controller.lastPage = undefined;

$( bc ).bind( "init", function() {
	lm.controller.init();
});

lm.controller.init = function() {
if(lm.controller.currentPage === undefined){
	lm.controller.currentPage = 'splash';
}
lm.controller.getJs = false;
  lm.controller.changePage(lm.controller.currentPage);
}
 /**
   * Called to change content on the app
   * This will do an ajax call to the page name and add .html to the end.
   * It will then call the function on complete pageName_load() and the lastPageName_unload()
   *
   * <p>A second and third attribute is available to handle specific cases.</p>
   *
   * @param pageName The name of the page to call.  This should have matching name.html and js/name.js file.
   * @param options set of options used to control page loading.  See example.
   * @example 
     These are the default parameters
     lm.controller.changePage('video', {
        pageName: 'video',
        runInit: null,
        runLoad: null,
        runUnload: null,
        initFunction: video_init,
        loadFunction: video_load, 
        unloadFunction: video_unload, 
        initStartTime: 0, 
        loadStartTime: 0, 
        unloadStartTime: 0
      });
   */
lm.controller.changePage = function(pageName, options) {
  if(bc.core.current_mode == 'development' && lm.controller.getJs == true){
    $.getScript('js/'+pageName+'.js', function() {
      lm.controller.getPage(pageName, options, true);
    });
  }else{
    lm.controller.getPage(pageName, options);
  }
}

/**
   * Called to go to last page in app
   * This will do an ajax call to the page name and add .html to the end.
   * It will then call the function on complete pageName_load() and the lastPageName_unload()
   *
   * <p>Two attributes are available to handle specific cases.</p>
   *
   * @param options set of options used to control page loading.  See changePage.
   */
lm.controller.back = function(options) {
  lm.controller.options.pageName = lm.controller.lastPage;
  if(bc.core.current_mode == 'development' && typeof window[lm.controller.options.pageName+'_load'] == 'undefined'){
    $.getScript('js/'+lm.controller.options.pageName+'.js', function() {
      lm.controller.getPage(lm.controller.options.pageName, options);
    });
  }else{
    lm.controller.switchPage();
  }
}

/**
   * Called to unload the current page in the app
   * This is useful for pop up boxes.  The current page will be set to the last page.
   * It will not run pagename_load again.
   *
   */
lm.controller.unload = function() {
	window[lm.controller.options.pageName+'_unload']();
  	lm.controller.options.pageName = lm.controller.lastPage;
}

/**
 * @private
 */
lm.controller.getPage = function(pageName, options, runInitFunction) {
  lm.controller.pageStack.push(pageName);
  lm.controller.lastPage = lm.controller.pageStack[lm.controller.pageStack.length-2];

  lm.controller.options = {
    pageName: pageName,
    runInit: true,
    runLoad: null,
    runUnload: null,
    initFunction: window[pageName+'_init'],
    loadFunction: window[pageName+'_load'], 
    unloadFunction: window[lm.controller.lastPage+'_unload'], 
    initStartTime: 0, 
    loadStartTime: 0, 
    unloadStartTime: 0
  }

  load_parameters = '';
  unload_parameters = '';

  // User defined options
  for (i in options) lm.controller.options[i] = options[i];

  if($('#'+pageName).attr('data-init') != 'true'){
  	runInitFunction = true;
  }
  if(runInitFunction && lm.controller.options.runInit){
    var pageName = lm.controller.options.pageName;
    $('#'+pageName).load(pageName+'.html', 
      function(){     
      	$('#'+pageName).attr('data-init', 'true'); 
        if(typeof lm.controller.options.initFunction != 'undefined'){
          setTimeout(lm.controller.options.initFunction, lm.controller.options.initStartTime);
        }else{
          console.log('Cannot load page.  No '+pageName+'_init'+' function.');
        }
        lm.controller.switchPage();
      }
    );
  }else{
    lm.controller.switchPage();
  }  
}
/**
 * @private
 */
lm.controller.switchPage = function() {
  var pageName = lm.controller.options.pageName;

  if(typeof lm.controller.lastPage != 'undefined'){
    if(typeof lm.controller.options.unloadFunction != 'undefined'){
      setTimeout(lm.controller.options.unloadFunction, lm.controller.options.unloadStartTime);
    }else{
      console.log('Cannot unload last page.  No '+lm.controller.lastPage+'_unload function.');
    }
  }
  if(typeof lm.controller.options.loadFunction != 'undefined'){
    setTimeout(lm.controller.options.loadFunction, lm.controller.options.loadStartTime);
  }else{
    console.log('Cannot load page.  No '+pageName+'_load'+' function.');
  }
}

/** Video player element */
lm.video.player = undefined;

/** Video player options */
lm.video.options = {};

/**
	* Call when ready to load video player
	* @param options set of options used to control page loading.  See example.
	* @example 
     These are the default parameters
     lm.video.init('video', {
	    play: $('#play'),
	    pause: $('#pause'),
	    next: $('#next'),
	    previous: $('#previous'),
	});
   */
lm.video.init = function(options) {

	lm.video.options = {
	    play: $('#play'),
	    pause: $('#pause'),
	    next: $('#next'),
	    previous: $('#previous'),
	}

  	for (i in options) lm.video.options[i] = options[i];

	lm.video.player = document.getElementById("player");
    lm.video.createProgressBar();
    lm.video.play();
    lm.video.options.play.bind('tap', function(e){
	    lm.video.play();
	    lm.video.options.pause.show();
	    lm.video.options.play.hide();
    });
    lm.video.options.pause.bind('tap', function(e){
        lm.video.pause();
        lm.video.options.play.show();
        lm.video.options.pause.hide();
    });
    lm.video.options.next.bind('tap', function(e){
        lm.video.loadShow();
    });
    lm.video.options.previous.bind('tap', function(e){
        lm.video.loadShow(true);
    });
}

/**
   * Plays Video
   */
lm.video.play = function() {
	lm.video.player.play();
}

/**
   * Pauses Video
   */
lm.video.pause = function() {
	lm.video.player.pause();
}

lm.video.createProgressBar = function(){
    if(typeof progress_bar != 'undefined'){
        clearInterval(progress_bar);
    }
    progress_bar = window.setInterval(function(t){
      if (lm.video.player.readyState > 0) {
        currentPrecent = lm.video.player.currentTime/lm.video.player.duration;
        if(bc.context.viewOrientation == 'portrait'){
            $('#progress_complete').css('width', Math.round(621*currentPrecent)+'px');
        }else{
            $('#progress_complete').css('width', Math.round(877*currentPrecent)+'px');
        }
        if(currentPrecent > .99){
            lm.video.loadShow();
        }
        clearInterval(t);
      }
    },200);
}

lm.video.loadShow = function(back){
    lm.video.pause();
    if(back){
        currentShow--;
        if(currentShow < 0){
            currentShow = showCount;
        }
    }else{
        currentShow++;
        if(currentShow > showCount){
            currentShow = 0;
        }
    }
    get_twitter_content(shows[currentShow].showTwitter);
    $('#loading .showname').html(shows[currentShow].showName);
    $('#showname').html(shows[currentShow].showName);
    $('#show_title').html(shows[currentShow].showName);
    $('#loading').show();
    setTimeout(function(){
        $('#loading').css('opacity', 1);
    }, 100)
    setTimeout(function(){
        lm.video.player.src = shows[currentShow].showVideo;
        lm.video.player.load();
        setTimeout(function(){
            $('#loading .season').css('-webkit-transform', 'translate3d(0, 0, 0)');
            $('#loading .showname').css('-webkit-transform', 'translate3d(0, 0, 0)');
            $('#loading .upnext').css('-webkit-transform', 'translate3d(0, 0, 0)');
            setTimeout(function(){
                $('#loading').css('opacity', 0);
                setTimeout(function(){
                    $('#loading').hide();
                }, 100)
                    $('#loading .season').css('-webkit-transform', 'translate3d(900px, 0, 0)');
                    $('#loading .showname').css('-webkit-transform', 'translate3d(1500px, 0, 0)');
                    $('#loading .upnext').css('-webkit-transform', 'translate3d(0, -600px, 0)');
                lm.video.player.play();
            }, 2500)
        }, 500)
    }, 200)
}

}( bc.lib.jQuery ));