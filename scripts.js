(function($){
        $.fn.serializeObject = function()
        {
        	query = this.serializeArray();
			object = {};
			for (i in query)
			{
				object[query[i].name] = query[i].value;
			}
			return object;
        };
 })(jQuery);

function rand(min, max)
{
	return Math.floor((Math.random()*max)+min);
}

$(document).ready(function(){

	var started = false;
	var target = $('#target');
	var configs;
	var misses = 0;
	var targetShown = 0;
	var maxDelay = 0;
	var minDelay = 9999;
	var mediumDelay = 0;
	var totalDelay = 0;
	var totalShots = 0;
	var totalHits = 0;
	var targetOnDelay = 0;
	var hitrate = 0;
	var winWidth = $(window).width();
	var winHeight = $(window).height();
	
	var shotSound = $('#shot')[0];

	$('#begin').click(function(){
		configs = $('form').serializeObject();
		console.log(configs);
		$('#configs').fadeOut(500);
		$('#backdrop').width(winWidth);
		$('#backdrop').height(winHeight);
		
		targetInterval = setInterval(function(){ nextTarget(); started = true; } ,100);
	});

	$(document).click(function(e) {
		misses += 1;
		if (started)
		{
			totalShots ++;
			if (configs.enableSound)
			{
				shotSound.currentTime=0;
				shotSound.play();
			}
		}
	});
	
	$(document).on('contextmenu','#backdrop',function(e) {
		e.preventDefault();
		misses += 1;
		if (started)
		{
			totalShots ++;
			if (configs.enableSound)
			{
				shotSound.currentTime=0;
				shotSound.play();
			}
		}
	});

	$('#backdrop').on('click','.target',(function(){	
		misses -= 1;
		totalHits++;
		hitrate = totalHits/(misses + totalHits);
		console.log("hit rate is");
		console.log(hitrate);
		targetShot = (new Date()).getTime();		
		delay = targetShot - $(this).data('shown');
		totalDelay += delay;
		mediumDelay = totalDelay / totalShots;
		if (delay > maxDelay) { maxDelay = delay; }
		if (delay < minDelay) { minDelay = delay; }
		$(this).remove();
	}));
	
	$('#backdrop').on('contextmenu','.target',(function(e){	
		e.preventDefault();//阻止右键菜单
		misses -= 1;
		totalHits++;
		hitrate = totalHits/(misses + totalHits);
		console.log("hit rate is");
		console.log(hitrate);
		targetShot = (new Date()).getTime();		
		delay = targetShot - $(this).data('shown');
		totalDelay += delay;
		mediumDelay = totalDelay / totalShots;
		if (delay > maxDelay) { maxDelay = delay; }
		if (delay < minDelay) { minDelay = delay; }
		$(this).remove();
	}));

	function nextTarget()
	{
		targetCount = $('.target').length;
		if ((targetCount+targetOnDelay) === 0) { showTarget(); }
		if (configs.multipleTargets && (targetCount+targetOnDelay < 3) && (rand(1,5) == 1)) { showTarget(); }
	}

	function showTarget()
	{
		targetOnDelay++;
		delay = (configs.randomDelay)? rand(1,mediumDelay): 1;
		setTimeout(function()
		{
			targetShown = (new Date()).getTime();
			target = $('<div id="'+targetShown+'" class="target" data-shown="'+ targetShown +'" />');			

			target.css('top',rand(1, winHeight-30)); 
			target.css('left',rand(1, winWidth-30));
			if (configs.randomSize) { target.width(rand(10,30)); target.height(rand(10,30)); }
			else { target.width(10); target.height(10); }

			$('#backdrop').append(target);

			if (configs.movingTarget)
			{
				y = rand(1, winHeight-30);
				x = rand(1, winWidth-30);
				target.animate({'top':y, 'left':x},10000);
			}
			targetOnDelay--;
		}, delay);
	}

});