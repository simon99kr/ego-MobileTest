/*
	Copyright 2011, jQuery Project
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
 */

/************************************************************************
   파일명 : EgovMobile.js
   설  명 : 모바일 전자정부 실행환경 공통 JavaScript
   수정일       수정자        Version        Function 명
  -------      ----------      ----------     -----------------
  2011.07.14   윤병욱         1.0              최초 생성
************************************************************************/

/************************************************************************
   함수명 : 기타 Dialog                                  
   설  명 : actionsheet, alert, overlay, prompt, comfirm dialog 사용                
   사용법 : jActionSheet(), jAlert(), jOverlay(), jPrompt, jComfirm Dialog 사용
   인  자 : 제목, 내용, 색상, 리턴값
   작성일 : 2011-07-14   
   작성자 : 모바일 실행환경 개발팀 황민희       
   수정일       수정자             수정내용
   ------      ------     -------------------
   2011.07.14    황민희        최초생성                                       
************************************************************************/
/*
	jQuery Alert Dialogs Plugin
	Version 1.1
	Cory S.N. LaViska
	14 May 2009
 */
(function($) {
	
	$.alerts = {
		verticalOffset: -75,                // vertical offset of the dialog from center screen, in pixels
		horizontalOffset: 0,                // horizontal offset of the dialog from center screen, in pixels/
		repositionOnResize: true,           // re-centers the dialog on window resize
		overlayOpacity: .01,                // transparency level of overlay
		overlayColor: '#FFF',               // base color of overlay
		draggable: true,                    // make the dialogs draggable (requires UI Draggables plugin)
		okButton: '&nbsp;확인&nbsp;',         // text for the OK button
		cancelButton: '&nbsp;닫기&nbsp;', // text for the Cancel button

		alert: function(message, title, theme, callback) {
			if( title == null ) title = 'Alert';
			$.alerts._show(title, message, theme, null,  'alert', function(result) {
				if( callback ) callback(result);
			});
		},

		ActionSheet: function(message, title, theme, btmItem, callback) {
			if( title == null ) title = 'ActionSheet';
			$.alerts._show(title, message, theme, btmItem, 'ActionSheet', function(result) {
				if( callback ) callback(result);
			});
		},

		Overlay: function(message, title, theme,  callback) {
			if( title == null ) title = 'Overlay';
			$.alerts._show(title, message, theme, null,'Overlay', function(result) {
				if( callback ) callback(result);
			});
		},
		
		confirm: function(message, title, theme, callback) {
			if( title == null ) title = 'Confirm';
			$.alerts._show(title, message, theme, null, 'confirm', function(result) {
				if( callback ) callback(result);
			});
		},
			
		prompt: function(message, title, theme,  callback) {
			if( title == null ) title = 'Prompt';
			$.alerts._show(title, message, theme, null,  'prompt', function(result) {
				if( callback ) callback(result);
			});
		},
	
		_show: function(title, msg, value, btmItem, type, callback) { //value= theme
			if(value == null || value ==''){
				value = "a";
			}
				
			$.alerts._hide();
			$.alerts._overlay('show');
			
			$("BODY").append(
			  '<div id="popup_container">' +
			    '<h1 id="popup_title"></h1>' +
			    '<div id="popup_content">' +
			      '<div id="popup_message"></div>' +
				'</div>' +
			  '</div>');

			if(value =="undefined" || value == null){
				var dialclass = $('.ui-page-active').attr("class");
				var dialindex = $('.ui-page-active').attr("class").indexOf("ui-body-");				
				var theme = $('.ui-page-active').attr("class")[dialindex+8];
			}else{
				theme = value;
			}
			// IE6 Fix
			var pos = ($.browser.msie && parseInt($.browser.version) <= 6 ) ? 'absolute' : 'fixed'; 

			var dataTheme = "ui-dialog-theme-"+theme;

			$("#popup_container").css({
				position: "absolute",
				zIndex: 99999,
			});

			$("#popup_container").addClass(dataTheme);
			
			$("#popup_title").text(title);
			$("#popup_content").addClass(type);
		msg = "<div class='ui-dialog-msg'>" + msg + "</div>";
			$("#popup_message").text(msg);
			$("#popup_message").html( $("#popup_message").text().replace(/\n/g, '<br />') );
			
			$("#popup_container").css({
				minWidth: $("#popup_container").outerWidth(),
				maxWidth: $("#popup_container").outerWidth()
			});
			
			$.alerts._reposition();
			$.alerts._maintainPosition(true);
			
			switch( type ) {
				case 'alert':
					$("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /></div>');
					$("#popup_ok").click( function() {
						$.alerts._hide();
						callback(true);
					});
					$("#popup_ok").keypress( function(e) {
						if( e.keyCode == 13 || e.keyCode == 27 ) $("#popup_ok").trigger('click');
					});
				break;
				case 'ActionSheet':
					var popup_msg = '<div id="popup_panel" >' ;
					
					$("#popup_message").append('<div id="popup_panel" >');
					
					for(var i =0 ; i < btmItem.length ; i++){	
						popup_msg +='<input type="button" value="' +btmItem[i].value + '" id="'+btmItem[i].id+'"/>';					
					}
					popup_msg+='<input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>';
					
					$("#popup_message").append(popup_msg);
				
					for(var i =0 ; i < btmItem.length ; i++){
						$("#"+btmItem[i].id).click( function() {
							if( callback ) callback(this.value);
							$.alerts._hide();		
						});
					}	
				
					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback(false);
					});
					$("#select1ok").focus();
					$("#select1ok, #select2ok, #popup_cancel").keypress( function(e) {
						if( e.keyCode == 13 ) $("#select1ok").trigger('click');
						if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
					});
				break;
				
				case 'Overlay':
					$("#popup_message").after('<div id="popup_panel"></div>');
					$("#popup_container").click( function() {
						$.alerts._hide();
						callback(true);
					});
					$("#popup_ok").keypress( function(e) {
						if( e.keyCode == 13 || e.keyCode == 27 ) $("#popup_ok").trigger('click');
					});
				break;
				
				case 'confirm':
					$("#popup_message").after('<div id="popup_panel" ><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
					$("#popup_ok").click( function() {
						$.alerts._hide();
						if( callback ) callback(true);
					});
					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback(false);
					});
					$("#popup_ok, #popup_cancel").keypress( function(e) {
						if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
						if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
					});
				break;
				case 'prompt':
					$("#popup_message").append('<input type="text" size="30" id="popup_prompt" />').after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
					$("#popup_prompt").width( $("#popup_message").width() );
					$("#popup_ok").click( function() {
						var val = $("#popup_prompt").val();
						$.alerts._hide();
						if( callback ) callback( val );
					});
					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback( null );
					});
					$("#popup_prompt, #popup_ok, #popup_cancel").keypress( function(e) {
						if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
						if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
					});

					$("#popup_prompt").focus().select();
				break;
			}
			
			if( $.alerts.draggable ) {
				try {
					$("#popup_container").draggable({ handle: $("#popup_title") });
					$("#popup_title").css({ cursor: 'move' });
				} catch(e) { /* requires jQuery UI draggables */ }
			}
		},
		
		_hide: function() {
			$("#popup_container").remove();
			$.alerts._overlay('hide');
			$.alerts._maintainPosition(false);
		},
		
		_overlay: function(status) {
			switch( status ) {
				case 'show':
					$.alerts._overlay('hide');
					$("BODY").append('<div id="popup_overlay"></div>');
					$("#popup_overlay").css({
						position: 'absolute',
						zIndex: 99,		// 안드로이드 폰에 들어가면 List 밑으로 간다. 수정 필요 (99998에서 99로 변경 (2012-08-03))
						top: '0px',
						left: '0px',
						width: '100%',
						height: $(document).height(),
						opacity: $.alerts.overlayOpacity
					});
				break;
				case 'hide':
					$("#popup_overlay").remove();
				break;
			}
		},
		
		_reposition: function() {
			var height = $(window).height();
			var width = $(window).width();
			var scrollPosition = $(window).scrollTop();
 
			var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
			var top =(scrollPosition + height / 2 - $("#popup_container").outerHeight() / 2);

			if( top < 0 ) top = 0;
			if( left < 0 ) left = 0;
			
			// IE6 fix
			if( $.browser.msie && parseInt($.browser.version) <= 6 ) top = top + $(window).scrollTop();
			
			$("#popup_container").css({			
				top: top+"px",
				left: left +"px"
			});
			$("#popup_overlay").height( $(document).height() );
		},
		
		_maintainPosition: function(status) {
			if( $.alerts.repositionOnResize ) {
				switch(status) {
					case true:
						$(window).bind('resize', $.alerts._reposition);
					break;
					case false:
						$(window).unbind('resize', $.alerts._reposition);
					break;
				}
			}
		}
		
	}
	
	jAlert = function(message, title, theme , callback) {
		$.alerts.alert(message, title, theme, callback);
	}
	
	jActionSheet = function(message, title, theme, btmItem, callback) {	
		$.alerts.ActionSheet(message, title, theme, btmItem, callback);
	}
	
	jOverlay = function(message, title, theme, callback) {
		$.alerts.Overlay(message, title, theme, callback);
	}
	
	jConfirm = function(message, title, theme, callback) {
		$.alerts.confirm(message, title, theme, callback);
	};
		
	jPrompt = function(message, title, theme,  callback) {
		$.alerts.prompt(message, title, theme, callback);
	};
	
})(jQuery);


/************************************************************************
   함수명 : Tabs                                  
   설  명 : 문서 내 이동을 Tab으로 구현              
   사용법 :  <data-role="tabs">
   작성일 : 2011-07-14   
   작성자 : 모바일 실행환경 개발팀 윤병욱       
   수정일       수정자             수정내용
   ------      ------     -------------------
   2011.07.14    윤병욱        최초생성                                       
*************************************************************************/
(function($, undefined ) {
$.widget( "mobile.tabs", $.mobile.widget, {
	options: {
		iconpos: 'top',
		grid: null,
		load: function(event, ui) { },
		beforeTabHide: function(event, ui) { },
		beforeTabShow: function(event, ui) { },
		afterTabShow:  function(event, ui) { }
	},
	_create: function(){
		var
			$this = this,
			$tabs = this.element,
			$navbtns = $tabs.find("a"),
			iconpos = $navbtns.filter('[data-icon]').length ? this.options.iconpos : undefined;
		var $content = $tabs.closest('div[data-role="page"]').find('div[data-role="content"]');

		$tabs
			.addClass('ui-navbar')
			.attr("role","navigation")
			.find("ul")
				.grid({grid: this.options.grid });

		if( !iconpos ){ 
			$tabs.addClass("ui-navbar-noicons");
		}

		$navbtns
			.buttonMarkup({
				corners: false,
				shadow:  false,
				iconpos: iconpos
			})
			.removeClass('ui-link');

		$tabs.delegate("a", "click",function(event){
			$navbtns.removeClass( "ui-btn-active" );
			$( this ).addClass( "ui-btn-active" );
			event.preventDefault();
			return false;
		});

		// Set up the direct children of the page as the tab content, hide them
		$content.children().addClass('ui-tabs-content');
		
		// Now show the one that's active
		if( $navbtns.filter('.ui-btn-active').length == 0 )
			$navbtns.first().addClass('ui-btn-active');
		$content.children('#' + $navbtns.eq($this.currentTab()).attr('href')).addClass('ui-tabs-content-active');

		$navbtns.bind('click', function(event) {
			$this.changeTab(event, {
				currentTab: $navbtns.eq($this.currentTab()),
				nextTab: $(this),
				currentContent: $this.currentContent(),
				nextContent: $content.children($(this).attr('href'))
			});
		});

		this._trigger('load', null, {
			currentTab: $navbtns.eq($this.currentTab()),
			currentContent: $this.currentContent()
		});
	},
	currentTab: function() {
		var $tabs = this.element,
		$navbtns = $tabs.find("a");
		return this.element.find('.ui-btn-active').parent().prevAll().length;
	},
	currentContent: function() {
		return this.element.closest('div[data-role="page"]').find('div[data-role="content"]').children().filter('.ui-tabs-content-active');
	},
	changeTab: function(event, ui) {
		if( this._trigger('beforeTabHide', event, ui) )
		ui.currentContent.siblings().andSelf().removeClass('ui-tabs-content-active');
		if( this._trigger('beforeTabShow', event, ui) )
			ui.nextContent.addClass('ui-tabs-content-active');
		this._trigger('afterTabShow', event, $.extend({}, ui, { previousContent: ui.currentContent, currentContent: ui.nextContent, nextContent: null }));
	}
});
})( jQuery );

/************************************************************************
함수명 : activePageTheme                                  
설  명 : 활성화 된 page 의 테마를 조회한다.              
사용법 : activePageTheme();
작성일 : 2011-07-14   
작성자 : 모바일 실행환경 개발팀 윤병욱       
수정일       수정자             수정내용
------      ------     -------------------
2011.07.14    윤병욱        최초생성                                       
*************************************************************************/
function activePageTheme() {
    var dataTheme;
    
    if ($('.ui-page-active').length > 0) {
        $pageClass = $('.ui-page-active').attr('class');
        
        var startIndex = $pageClass.indexOf('ui-body-') + 8;
        var endIndex = startIndex + 1;

        if (startIndex > 0){
            dataTheme = $pageClass.substring(startIndex, endIndex);
        } else {
            dataTheme = 'a';
        }
        
    }

    return dataTheme;
}		

/************************************************************************
   함수명 : progressbar                                  
   설  명 : 화면 전환시 Progress Bar 를 표시한다.              
   사용법 : 실행 - $.mobile.showPageLoadingMsg('a~g');
           종료 - $.mobile.hidePageLoadingMsg('a~g');
           기타 설정 및 상세 사용 법은 Progress Dialog / Bar 컴포넌트 가이드 참조
   작성일 : 2011-07-14   
   작성자 : 모바일 실행환경 개발팀 윤병욱       
   수정일       수정자             수정내용
   ------      ------     -------------------
   2011.07.14    윤병욱        최초생성                                       
*************************************************************************/
/*
Copyright (c) 2011 Paul Bakaus, http://jqueryui.com/
Version 1.8.13
jQuery UI Authors (http://jqueryui.com/about)
*/
(function( $, undefined ) {

	$.widget( "ui.progressbar", {
	    options: {
	        value: 0,
	        max: 100
	    },
	
	    min: 0,
	
	    _create: function() {
	        this.element
	            .addClass( "ui-loader ui-progressbar ui-widget ui-widget-content ui-corner-all" )
	            .attr({
	                role: "progressbar",
	                "aria-valuemin": this.min,
	                "aria-valuemax": this.options.max,
	                "aria-valuenow": this._value()
	            });
	        
	        /* 김연수 수정
	        * 하단의
	        * if ($.mobile.progressTheme != undefined) {
		    	alert("11");
		    	//$('#progressbar2').addClass("ui-progressbar-" + $.mobile.progressTheme);
		    	$('#progressbar2').addClass("ui-progressbar-e");
		    } else {
		    	alert("2");
			    if (dataTheme) {
			    	$('#progressbar2').addClass("ui-progressbar-" + dataTheme);
			    }
		    }
		    *위 부분에서 addClass가 안먹어서 하위에 직접 테마를 입힘
		    */ 
	        
	        if ( window.opera && window.opera.version ) {	// mobile opera에서 각 corner에 포함된 border-radius 속성이 포함됨으로 인해 image가 표현되지 않는 문제로, 새로운 css style로 강제로 입힌다.
	        	this.valueDiv = $( "<div id='progressbar2' class='ui-widget-header ui-corner-left ui-progressbar-" + $.mobile.progressTheme + " ui-operacorner-mode' >&nbsp;</div>")
	            .appendTo( this.element );	        	
			}
	        else {
	        	this.valueDiv = $( "<div id='progressbar2' class='ui-widget-header ui-corner-left ui-progressbar-" + $.mobile.progressTheme + "' >&nbsp;</div>")
	            .appendTo( this.element );	        	
	        }
	        
//	        this.valueDiv = $( "<div id='progressbar2' class='ui-widget-header ui-corner-left ' >&nbsp;</div>")
//            .appendTo( this.element );

	        $("<div class='egov-loding'>" + $.mobile.loadingMessage + "</div>").appendTo( this.element );
	        
	        this.oldValue = this._value();
	        this._refreshValue();
	    },
	
	    destroy: function() {
	        this.element
	            .removeClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
	            .removeAttr( "role" )
	            .removeAttr( "aria-valuemin" )
	            .removeAttr( "aria-valuemax" )
	            .removeAttr( "aria-valuenow" );
	
	        this.valueDiv.remove();
	
	        $.Widget.prototype.destroy.apply( this, arguments );
	    },
	
	    value: function( newValue ) {
	        if ( newValue === undefined ) {
	            return this._value();
	        }
	
	        this._setOption( "value", newValue );
	        return this;
	    },
	
	    _setOption: function( key, value ) {
	        if ( key === "value" ) {
	            this.options.value = value;
	            this._refreshValue();
	            if ( this._value() === this.options.max ) {
	                this._trigger( "complete" );
	            }
	        }
	
	        $.Widget.prototype._setOption.apply( this, arguments );
	    },
	
	    _value: function() {
	        var val = this.options.value;
	        // normalize invalid value
	        if ( typeof val !== "number" ) {
	            val = 0;
	        }
	        return Math.min( this.options.max, Math.max( this.min, val ) );
	    },
	
	    _percentage: function() {
	        return 100 * this._value() / this.options.max;
	    },
	
	    _refreshValue: function() {
	        var value = this.value();
	        var percentage = this._percentage();
	
	        if ( this.oldValue !== value ) {
	            this.oldValue = value;
	            this._trigger( "change" );
	        }
	
	        this.valueDiv
	            .toggleClass( "ui-corner-right", value === this.options.max )
	            .width( percentage.toFixed(0) + "%" );
	        this.element.attr( "aria-valuenow", value );
	    }
	});
	
	$.extend( $.ui.progressbar, {
	    version: "1.8.13"
	});

})( jQuery );

// progressBar 에서 사용하는 Data 객체
var progressData = {
		percentage: 0,
		processType: 0,
		processTimeout: Object
}

//progressBar show
$.mobile._showPageProgressMsg = function (changeTheme) {
	
	var dataTheme;
	
    if (changeTheme != undefined) {
    	dataTheme = changeTheme;
    } else {
    	dataTheme = activePageTheme();
    }

    var activeBtn = $( "." + $.mobile.activeBtnClass ).first();
    
    $("#progressbar").css( {
        top: $.support.scrollTop && $(window).scrollTop() + $(window).height() / 2 ||
        activeBtn.length && activeBtn.offset().top || 100
    } );

    if ($.mobile.progressTheme != undefined) {
    	//alert("1:::"+$.mobile.progressTheme);	// 주석 2012-07-30 박지민
    	$('#progressbar2').addClass("ui-progressbar-" + $.mobile.progressTheme);
    } else {
	    if (dataTheme) {
	    	$('#progressbar2').addClass("ui-progressbar-" + dataTheme);
	    }
    }
    
    progressData.percentage = 0;
    clearTimeout(progressData.processTimeout);
    $("#progressbar").show();
    _progressing();

}

// Progress Bar Hide
$.mobile._hidePageProgressMsg = function () {
    $("#progressbar").hide();
    clearTimeout(progressData.processTimeout);
}


// Progress Bar 이동 효과
function _progressing(){

    $("#progressbar").progressbar( "option", "value", progressData.percentage );
    
    if (progressData.processType == 0) {
        if(progressData.percentage < 100){
        	progressData.percentage = progressData.percentage + 30;
        } else {
            progressData.processType = 1;
        }
    } else {
        if(progressData.percentage > 0){
        	progressData.percentage = progressData.percentage - 30;
        } else {
            progressData.processType = 0;
        }
    }
    
    // setTimeout 의 숫자 값을 변경하면 progress bar 의 속도 조절 가능
    progressData.processTimeout = setTimeout("_progressing()",500);
}

// Progress Dialog 를 확장하여 theme 를 설정할 수 있게 변경
$.mobile.showPageLoadingMsg = function(changeTheme) {

     var activeTheme;
        
    if (changeTheme) {
    	activeTheme = changeTheme;
    } else {
    	activeTheme = activePageTheme();
    }

    if ($.mobile.progressTheme != undefined) {
    	activeTheme = $.mobile.progressTheme;
    }
    
	if (!activeTheme) {
    	activeTheme = 'a';
	}
	
    var dialogTheme = '';
    
    if (activeTheme == 'b') {
    	dialogTheme = 'ui-bar-' + activeTheme;
    } else {
    	dialogTheme = 'ui-body-' + activeTheme;
    }
    
    var dialogLoadingTheme = 'ui-icon-loading';

    if (activeTheme != 'a') {
    	dialogLoadingTheme = 'ui-icon-loadingB'; 
    }
    
    if ( window.opera && window.opera.version ) {	// mobile opera에서 각 corner에 포함된 border-radius 속성이 포함됨으로 인해 image가 표현되지 않는 문제로, 새로운 css style로 강제로 입힌다.
    	dialogLoadingTheme += ' ui-operacorner-mode';
    }    
	    
    var $loader = $.mobile.loadingMessage ?     $( "<div class='ui-loader " + dialogTheme + " ui-corner-all'>" + "<span class='ui-icon " + dialogLoadingTheme + " spin'></span>" + "<h1>" + $.mobile.loadingMessage + "</h1>" + "</div>" )   : undefined;
 
    if( $.mobile.loadingMessage ){

        $('.ui-loader', $.mobile.pageContainer).remove();
        
        var activeBtn = $( "." + $.mobile.activeBtnClass ).first();
    
        $loader
            .appendTo( $.mobile.pageContainer )
            //position at y center (if scrollTop supported), above the activeBtn (if defined), or just 100px from top
            .css( {
                top: $.support.scrollTop && $(window).scrollTop() + $(window).height() / 2 ||
                activeBtn.length && activeBtn.offset().top || 100
            } );
    }
    
    $('html').addClass( "ui-loading" );
};

// Progress Bar 사용여부에 따라 Dialog와 Bar 를 동적으로 변환해 준다.
if ($.mobile.progressBar) {
	$.mobile.showPageLoadingMsg = function(changeTheme) {
		$.mobile._showPageProgressMsg(changeTheme);
	}

	$.mobile.hidePageLoadingMsg = function() {
		$.mobile._hidePageProgressMsg();
	}
}

/************************************************************************
   함수명 : EgovMobile 초기화                                  
   설  명 : tabs 추가, small button 설정, popup_container 제거 기능                    
   사용법 : onload 시 자동 실행
   작성일 : 2011-07-14   
   작성자 : 모바일 실행환경 개발팀 구지연       
   수정일       수정자             수정내용
   ------      ------     -------------------
   2011.07.14    윤병욱        최초생성                                       
************************************************************************/
$('[data-role="page"]').live('pageshow', function(){
	
	// 활성화 페이지 조회
	$activePage = $('[class*="ui-page-active"]');
	
	// tabs 초기화
	$activePage.find('[data-role="tabs"]').tabs();

	// small button 초기화
	$activePage.find('a[class*="egov-btn-small"] span').addClass("egov-btn-small-span");
	
	// Progress Bar 초기화
	$('<div id="progressbar" style="height: 45px; display: none;"></div>').appendTo('body');
    $("#progressbar").progressbar({
        value: progressData.percentage
    });
    
    // 페이지 생성시 이전 popup 메시지 제거
	if($('#popup_container').length > 0) {
		$.alerts._hide();
	}
	
});

/************************************************************************
함수명 : Opera 12 Selector Design 문제                             
설  명 : Jquerymobile 1.1.1에서 오페라 브라우저의 경우 ui-select-nativeonly class를 추가하여 디자인의 문제가 발생                    
사용법 : jquery.mobile-1.1.1.js 의 selector 생성 script 그대로 복사 및 addclass 부분을 주석처리
작성일 : 2012-09-04   
작성자 : 모바일 실행환경 개발팀 박지민       
수정일       수정자             수정내용
------      ------     -------------------
2012.09.04    박지민        최초생성                                       
************************************************************************/
(function( $, undefined ) {

$.widget( "mobile.selectmenu", $.mobile.widget, {
	options: {
		theme: null,
		disabled: false,
		icon: "arrow-d",
		iconpos: "right",
		inline: false,
		corners: true,
		shadow: true,
		iconshadow: true,
		overlayTheme: "a",
		hidePlaceholderMenuItems: true,
		closeText: "Close",
		nativeMenu: true,
		// This option defaults to true on iOS devices.
		preventFocusZoom: /iPhone|iPad|iPod/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1,
		initSelector: "select:not(:jqmData(role='slider'))",
		mini: false
	},

	_button: function(){
		return $( "<div/>" );
	},

	_setDisabled: function( value ) {
		this.element.attr( "disabled", value );
		this.button.attr( "aria-disabled", value );
		return this._setOption( "disabled", value );
	},

	_focusButton : function() {
		var self = this;

		setTimeout( function() {
			self.button.focus();
		}, 40);
	},

  _selectOptions: function() {
    return this.select.find( "option" );
  },

	// setup items that are generally necessary for select menu extension
	_preExtension: function(){
		var classes = "";
		// TODO: Post 1.1--once we have time to test thoroughly--any classes manually applied to the original element should be carried over to the enhanced element, with an `-enhanced` suffix. See https://github.com/jquery/jquery-mobile/issues/3577
		/* if( $el[0].className.length ) {
			classes = $el[0].className;
		} */
		if( !!~this.element[0].className.indexOf( "ui-btn-left" ) ) {
			classes =  " ui-btn-left";
		}
		
		if(  !!~this.element[0].className.indexOf( "ui-btn-right" ) ) {
			classes = " ui-btn-right";
		}
		
		this.select = this.element.wrap( "<div class='ui-select" + classes + "'>" );
		this.selectID  = this.select.attr( "id" );
		this.label = $( "label[for='"+ this.selectID +"']" ).addClass( "ui-select" );
		this.isMultiple = this.select[ 0 ].multiple;
		if ( !this.options.theme ) {
			this.options.theme = $.mobile.getInheritedTheme( this.select, "c" );
		}
	},

	_create: function() {
		this._preExtension();

 		// Allows for extension of the native select for custom selects and other plugins
		// see select.custom for example extension
		// TODO explore plugin registration
		this._trigger( "beforeCreate" );

		this.button = this._button();

		var self = this,

			options = this.options,

			inline = options.inline || this.select.jqmData( "inline" ),
			mini = options.mini || this.select.jqmData( "mini" ),			
			iconpos = options.icon ? ( options.iconpos || this.select.jqmData( "iconpos" ) ) : false,

			// IE throws an exception at options.item() function when
			// there is no selected item
			// select first in this case
			selectedIndex = this.select[ 0 ].selectedIndex == -1 ? 0 : this.select[ 0 ].selectedIndex,

			// TODO values buttonId and menuId are undefined here
			button = this.button
				.text( $( this.select[ 0 ].options.item( selectedIndex ) ).text() )
				.insertBefore( this.select )
				.buttonMarkup( {
					theme: options.theme,
					icon: options.icon,
					iconpos: iconpos,
					inline: inline,
					corners: options.corners,
					shadow: options.shadow,
					iconshadow: options.iconshadow,
					mini: mini
				});

/*			
		// Opera does not properly support opacity on select elements
		// In Mini, it hides the element, but not its text
		// On the desktop,it seems to do the opposite
		// for these reasons, using the nativeMenu option results in a full native select in Opera
		
		if ( options.nativeMenu && window.opera && window.opera.version ) {
			button.addClass( "ui-select-nativeonly" );
		}
		
		// 오페라 버전 12에서 Selector의 디자인은 ui-select-nativeonly class로 인해 문제가 발생하였고,
		// 이 부분을 주석처리하여 jquery.mobile-1.1.1.js의 함수를 호출하지 않고 여기서 create 하도록 적용.
*/		
		
		// Add counter for multi selects
		if ( this.isMultiple ) {
			this.buttonCount = $( "<span>" )
				.addClass( "ui-li-count ui-btn-up-c ui-btn-corner-all" )
				.hide()
				.appendTo( button.addClass('ui-li-has-count') );
		}

		// Disable if specified
		if ( options.disabled || this.element.attr('disabled')) {
			this.disable();
		}

		// Events on native select
		this.select.change( function() {
			self.refresh();
		});

		this.build();
	},

	build: function() {
		var self = this;

		this.select
			.appendTo( self.button )
			.bind( "vmousedown", function() {
				// Add active class to button
				self.button.addClass( $.mobile.activeBtnClass );
			})
            .bind( "focus", function() {
                self.button.addClass( $.mobile.focusClass );
            })
            .bind( "blur", function() {
                self.button.removeClass( $.mobile.focusClass );
            })
			.bind( "focus vmouseover", function() {
				self.button.trigger( "vmouseover" );
			})
			.bind( "vmousemove", function() {
				// Remove active class on scroll/touchmove
				self.button.removeClass( $.mobile.activeBtnClass );
			})
			.bind( "change blur vmouseout", function() {
				self.button.trigger( "vmouseout" )
					.removeClass( $.mobile.activeBtnClass );
			})
			.bind( "change blur", function() {
				self.button.removeClass( "ui-btn-down-" + self.options.theme );
			});

		// In many situations, iOS will zoom into the select upon tap, this prevents that from happening
		self.button.bind( "vmousedown", function() {
			if( self.options.preventFocusZoom ){
				$.mobile.zoom.disable( true );
			}
		})
		.bind( "mouseup", function() {
			if( self.options.preventFocusZoom ){
				$.mobile.zoom.enable( true );
			}
		});
	},

	selected: function() {
		return this._selectOptions().filter( ":selected" );
	},

	selectedIndices: function() {
		var self = this;

		return this.selected().map( function() {
			return self._selectOptions().index( this );
		}).get();
	},

	setButtonText: function() {
		var self = this, selected = this.selected();

		this.button.find( ".ui-btn-text" ).text( function() {
			if ( !self.isMultiple ) {
				return selected.text();
			}

			return selected.length ? selected.map( function() {
				return $( this ).text();
			}).get().join( ", " ) : self.placeholder;
		});
	},

	setButtonCount: function() {
		var selected = this.selected();

		// multiple count inside button
		if ( this.isMultiple ) {
			this.buttonCount[ selected.length > 1 ? "show" : "hide" ]().text( selected.length );
		}
	},

	refresh: function() {
		this.setButtonText();
		this.setButtonCount();
	},

	// open and close preserved in native selects
	// to simplify users code when looping over selects
	open: $.noop,
	close: $.noop,

	disable: function() {
		this._setDisabled( true );
		this.button.addClass( "ui-disabled" );
	},

	enable: function() {
		this._setDisabled( false );
		this.button.removeClass( "ui-disabled" );
	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$.mobile.selectmenu.prototype.enhanceWithin( e.target, true );
});
})( jQuery );

/* andriod 2.3.3 ( 진저브레드 ) 에서 백버튼을 통한 뒤로가기와 페이지 이동이 문제가 있어서, jquery.history.js 파일의 내용을 EgovMobile-1.1.1.js 에 삽입 */

window.JSON||(window.JSON={}),function(){function f(a){return a<10?"0"+a:a}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";return e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g,e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)d=rep[c],typeof d=="string"&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));return e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g,e}}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var JSON=window.JSON,cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}(),function(a,b){"use strict";var c=a.History=a.History||{},d=a.jQuery;if(typeof c.Adapter!="undefined")throw new Error("History.js Adapter has already been loaded...");c.Adapter={bind:function(a,b,c){d(a).bind(b,c)},trigger:function(a,b,c){d(a).trigger(b,c)},extractEventData:function(a,c,d){var e=c&&c.originalEvent&&c.originalEvent[a]||d&&d[a]||b;return e},onDomLoad:function(a){d(a)}},typeof c.init!="undefined"&&c.init()}(window),function(a,b){"use strict";var c=a.document,d=a.setTimeout||d,e=a.clearTimeout||e,f=a.setInterval||f,g=a.History=a.History||{};if(typeof g.initHtml4!="undefined")throw new Error("History.js HTML4 Support has already been loaded...");g.initHtml4=function(){if(typeof g.initHtml4.initialized!="undefined")return!1;g.initHtml4.initialized=!0,g.enabled=!0,g.savedHashes=[],g.isLastHash=function(a){var b=g.getHashByIndex(),c;return c=a===b,c},g.saveHash=function(a){return g.isLastHash(a)?!1:(g.savedHashes.push(a),!0)},g.getHashByIndex=function(a){var b=null;return typeof a=="undefined"?b=g.savedHashes[g.savedHashes.length-1]:a<0?b=g.savedHashes[g.savedHashes.length+a]:b=g.savedHashes[a],b},g.discardedHashes={},g.discardedStates={},g.discardState=function(a,b,c){var d=g.getHashByState(a),e;return e={discardedState:a,backState:c,forwardState:b},g.discardedStates[d]=e,!0},g.discardHash=function(a,b,c){var d={discardedHash:a,backState:c,forwardState:b};return g.discardedHashes[a]=d,!0},g.discardedState=function(a){var b=g.getHashByState(a),c;return c=g.discardedStates[b]||!1,c},g.discardedHash=function(a){var b=g.discardedHashes[a]||!1;return b},g.recycleState=function(a){var b=g.getHashByState(a);return g.discardedState(a)&&delete g.discardedStates[b],!0},g.emulated.hashChange&&(g.hashChangeInit=function(){g.checkerFunction=null;var b="",d,e,h,i;return g.isInternetExplorer()?(d="historyjs-iframe",e=c.createElement("iframe"),e.setAttribute("id",d),e.style.display="none",c.body.appendChild(e),e.contentWindow.document.open(),e.contentWindow.document.close(),h="",i=!1,g.checkerFunction=function(){if(i)return!1;i=!0;var c=g.getHash()||"",d=g.unescapeHash(e.contentWindow.document.location.hash)||"";return c!==b?(b=c,d!==c&&(h=d=c,e.contentWindow.document.open(),e.contentWindow.document.close(),e.contentWindow.document.location.hash=g.escapeHash(c)),g.Adapter.trigger(a,"hashchange")):d!==h&&(h=d,g.setHash(d,!1)),i=!1,!0}):g.checkerFunction=function(){var c=g.getHash();return c!==b&&(b=c,g.Adapter.trigger(a,"hashchange")),!0},g.intervalList.push(f(g.checkerFunction,g.options.hashChangeInterval)),!0},g.Adapter.onDomLoad(g.hashChangeInit)),g.emulated.pushState&&(g.onHashChange=function(b){var d=b&&b.newURL||c.location.href,e=g.getHashByUrl(d),f=null,h=null,i=null,j;return g.isLastHash(e)?(g.busy(!1),!1):(g.doubleCheckComplete(),g.saveHash(e),e&&g.isTraditionalAnchor(e)?(g.Adapter.trigger(a,"anchorchange"),g.busy(!1),!1):(f=g.extractState(g.getFullUrl(e||c.location.href,!1),!0),g.isLastSavedState(f)?(g.busy(!1),!1):(h=g.getHashByState(f),j=g.discardedState(f),j?(g.getHashByIndex(-2)===g.getHashByState(j.forwardState)?g.back(!1):g.forward(!1),!1):(g.pushState(f.data,f.title,f.url,!1),!0))))},g.Adapter.bind(a,"hashchange",g.onHashChange),g.pushState=function(b,d,e,f){if(g.getHashByUrl(e))throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(f!==!1&&g.busy())return g.pushQueue({scope:g,callback:g.pushState,args:arguments,queue:f}),!1;g.busy(!0);var h=g.createStateObject(b,d,e),i=g.getHashByState(h),j=g.getState(!1),k=g.getHashByState(j),l=g.getHash();return g.storeState(h),g.expectedStateId=h.id,g.recycleState(h),g.setTitle(h),i===k?(g.busy(!1),!1):i!==l&&i!==g.getShortUrl(c.location.href)?(g.setHash(i,!1),!1):(g.saveState(h),g.Adapter.trigger(a,"statechange"),g.busy(!1),!0)},g.replaceState=function(a,b,c,d){if(g.getHashByUrl(c))throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(d!==!1&&g.busy())return g.pushQueue({scope:g,callback:g.replaceState,args:arguments,queue:d}),!1;g.busy(!0);var e=g.createStateObject(a,b,c),f=g.getState(!1),h=g.getStateByIndex(-2);return g.discardState(f,e,h),g.pushState(e.data,e.title,e.url,!1),!0}),g.emulated.pushState&&g.getHash()&&!g.emulated.hashChange&&g.Adapter.onDomLoad(function(){g.Adapter.trigger(a,"hashchange")})},typeof g.init!="undefined"&&g.init()}(window),function(a,b){"use strict";var c=a.console||b,d=a.document,e=a.navigator,f=a.sessionStorage||!1,g=a.setTimeout,h=a.clearTimeout,i=a.setInterval,j=a.clearInterval,k=a.JSON,l=a.alert,m=a.History=a.History||{},n=a.history;k.stringify=k.stringify||k.encode,k.parse=k.parse||k.decode;if(typeof m.init!="undefined")throw new Error("History.js Core has already been loaded...");m.init=function(){return typeof m.Adapter=="undefined"?!1:(typeof m.initCore!="undefined"&&m.initCore(),typeof m.initHtml4!="undefined"&&m.initHtml4(),!0)},m.initCore=function(){if(typeof m.initCore.initialized!="undefined")return!1;m.initCore.initialized=!0,m.options=m.options||{},m.options.hashChangeInterval=m.options.hashChangeInterval||100,m.options.safariPollInterval=m.options.safariPollInterval||500,m.options.doubleCheckInterval=m.options.doubleCheckInterval||500,m.options.storeInterval=m.options.storeInterval||1e3,m.options.busyDelay=m.options.busyDelay||250,m.options.debug=m.options.debug||!1,m.options.initialTitle=m.options.initialTitle||d.title,m.intervalList=[],m.clearAllIntervals=function(){var a,b=m.intervalList;if(typeof b!="undefined"&&b!==null){for(a=0;a<b.length;a++)j(b[a]);m.intervalList=null}},m.debug=function(){(m.options.debug||!1)&&m.log.apply(m,arguments)},m.log=function(){var a=typeof c!="undefined"&&typeof c.log!="undefined"&&typeof c.log.apply!="undefined",b=d.getElementById("log"),e,f,g,h,i;a?(h=Array.prototype.slice.call(arguments),e=h.shift(),typeof c.debug!="undefined"?c.debug.apply(c,[e,h]):c.log.apply(c,[e,h])):e="\n"+arguments[0]+"\n";for(f=1,g=arguments.length;f<g;++f){i=arguments[f];if(typeof i=="object"&&typeof k!="undefined")try{i=k.stringify(i)}catch(j){}e+="\n"+i+"\n"}return b?(b.value+=e+"\n-----\n",b.scrollTop=b.scrollHeight-b.clientHeight):a||l(e),!0},m.getInternetExplorerMajorVersion=function(){var a=m.getInternetExplorerMajorVersion.cached=typeof m.getInternetExplorerMajorVersion.cached!="undefined"?m.getInternetExplorerMajorVersion.cached:function(){var a=3,b=d.createElement("div"),c=b.getElementsByTagName("i");while((b.innerHTML="<!--[if gt IE "+ ++a+"]><i></i><![endif]-->")&&c[0]);return a>4?a:!1}();return a},m.isInternetExplorer=function(){var a=m.isInternetExplorer.cached=typeof m.isInternetExplorer.cached!="undefined"?m.isInternetExplorer.cached:Boolean(m.getInternetExplorerMajorVersion());return a},m.emulated={pushState:!Boolean(a.history&&a.history.pushState&&a.history.replaceState&&!/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(e.userAgent)&&!/AppleWebKit\/5([0-2]|3[0-2])/i.test(e.userAgent)),hashChange:Boolean(!("onhashchange"in a||"onhashchange"in d)||m.isInternetExplorer()&&m.getInternetExplorerMajorVersion()<8)},m.enabled=!m.emulated.pushState,m.bugs={setHash:Boolean(!m.emulated.pushState&&e.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(e.userAgent)),safariPoll:Boolean(!m.emulated.pushState&&e.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(e.userAgent)),ieDoubleCheck:Boolean(m.isInternetExplorer()&&m.getInternetExplorerMajorVersion()<8),hashEscape:Boolean(m.isInternetExplorer()&&m.getInternetExplorerMajorVersion()<7)},m.isEmptyObject=function(a){for(var b in a)return!1;return!0},m.cloneObject=function(a){var b,c;return a?(b=k.stringify(a),c=k.parse(b)):c={},c},m.getRootUrl=function(){var a=d.location.protocol+"//"+(d.location.hostname||d.location.host);if(d.location.port||!1)a+=":"+d.location.port;return a+="/",a},m.getBaseHref=function(){var a=d.getElementsByTagName("base"),b=null,c="";return a.length===1&&(b=a[0],c=b.href.replace(/[^\/]+$/,"")),c=c.replace(/\/+$/,""),c&&(c+="/"),c},m.getBaseUrl=function(){var a=m.getBaseHref()||m.getBasePageUrl()||m.getRootUrl();return a},m.getPageUrl=function(){var a=m.getState(!1,!1),b=(a||{}).url||d.location.href,c;return c=b.replace(/\/+$/,"").replace(/[^\/]+$/,function(a,b,c){return/\./.test(a)?a:a+"/"}),c},m.getBasePageUrl=function(){var a=d.location.href.replace(/[#\?].*/,"").replace(/[^\/]+$/,function(a,b,c){return/[^\/]$/.test(a)?"":a}).replace(/\/+$/,"")+"/";return a},m.getFullUrl=function(a,b){var c=a,d=a.substring(0,1);return b=typeof b=="undefined"?!0:b,/[a-z]+\:\/\//.test(a)||(d==="/"?c=m.getRootUrl()+a.replace(/^\/+/,""):d==="#"?c=m.getPageUrl().replace(/#.*/,"")+a:d==="?"?c=m.getPageUrl().replace(/[\?#].*/,"")+a:b?c=m.getBaseUrl()+a.replace(/^(\.\/)+/,""):c=m.getBasePageUrl()+a.replace(/^(\.\/)+/,"")),c.replace(/\#$/,"")},m.getShortUrl=function(a){var b=a,c=m.getBaseUrl(),d=m.getRootUrl();return m.emulated.pushState&&(b=b.replace(c,"")),b=b.replace(d,"/"),m.isTraditionalAnchor(b)&&(b="./"+b),b=b.replace(/^(\.\/)+/g,"./").replace(/\#$/,""),b},m.store={},m.idToState=m.idToState||{},m.stateToId=m.stateToId||{},m.urlToId=m.urlToId||{},m.storedStates=m.storedStates||[],m.savedStates=m.savedStates||[],m.normalizeStore=function(){m.store.idToState=m.store.idToState||{},m.store.urlToId=m.store.urlToId||{},m.store.stateToId=m.store.stateToId||{}},m.getState=function(a,b){typeof a=="undefined"&&(a=!0),typeof b=="undefined"&&(b=!0);var c=m.getLastSavedState();return!c&&b&&(c=m.createStateObject()),a&&(c=m.cloneObject(c),c.url=c.cleanUrl||c.url),c},m.getIdByState=function(a){var b=m.extractId(a.url),c;if(!b){c=m.getStateString(a);if(typeof m.stateToId[c]!="undefined")b=m.stateToId[c];else if(typeof m.store.stateToId[c]!="undefined")b=m.store.stateToId[c];else{for(;;){b=(new Date).getTime()+String(Math.random()).replace(/\D/g,"");if(typeof m.idToState[b]=="undefined"&&typeof m.store.idToState[b]=="undefined")break}m.stateToId[c]=b,m.idToState[b]=a}}return b},m.normalizeState=function(a){var b,c;if(!a||typeof a!="object")a={};if(typeof a.normalized!="undefined")return a;if(!a.data||typeof a.data!="object")a.data={};b={},b.normalized=!0,b.title=a.title||"",b.url=m.getFullUrl(m.unescapeString(a.url||d.location.href)),b.hash=m.getShortUrl(b.url),b.data=m.cloneObject(a.data),b.id=m.getIdByState(b),b.cleanUrl=b.url.replace(/\??\&_suid.*/,""),b.url=b.cleanUrl,c=!m.isEmptyObject(b.data);if(b.title||c)b.hash=m.getShortUrl(b.url).replace(/\??\&_suid.*/,""),/\?/.test(b.hash)||(b.hash+="?"),b.hash+="&_suid="+b.id;return b.hashedUrl=m.getFullUrl(b.hash),(m.emulated.pushState||m.bugs.safariPoll)&&m.hasUrlDuplicate(b)&&(b.url=b.hashedUrl),b},m.createStateObject=function(a,b,c){var d={data:a,title:b,url:c};return d=m.normalizeState(d),d},m.getStateById=function(a){a=String(a);var c=m.idToState[a]||m.store.idToState[a]||b;return c},m.getStateString=function(a){var b,c,d;return b=m.normalizeState(a),c={data:b.data,title:a.title,url:a.url},d=k.stringify(c),d},m.getStateId=function(a){var b,c;return b=m.normalizeState(a),c=b.id,c},m.getHashByState=function(a){var b,c;return b=m.normalizeState(a),c=b.hash,c},m.extractId=function(a){var b,c,d;return c=/(.*)\&_suid=([0-9]+)$/.exec(a),d=c?c[1]||a:a,b=c?String(c[2]||""):"",b||!1},m.isTraditionalAnchor=function(a){var b=!/[\/\?\.]/.test(a);return b},m.extractState=function(a,b){var c=null,d,e;return b=b||!1,d=m.extractId(a),d&&(c=m.getStateById(d)),c||(e=m.getFullUrl(a),d=m.getIdByUrl(e)||!1,d&&(c=m.getStateById(d)),!c&&b&&!m.isTraditionalAnchor(a)&&(c=m.createStateObject(null,null,e))),c},m.getIdByUrl=function(a){var c=m.urlToId[a]||m.store.urlToId[a]||b;return c},m.getLastSavedState=function(){return m.savedStates[m.savedStates.length-1]||b},m.getLastStoredState=function(){return m.storedStates[m.storedStates.length-1]||b},m.hasUrlDuplicate=function(a){var b=!1,c;return c=m.extractState(a.url),b=c&&c.id!==a.id,b},m.storeState=function(a){return m.urlToId[a.url]=a.id,m.storedStates.push(m.cloneObject(a)),a},m.isLastSavedState=function(a){var b=!1,c,d,e;return m.savedStates.length&&(c=a.id,d=m.getLastSavedState(),e=d.id,b=c===e),b},m.saveState=function(a){return m.isLastSavedState(a)?!1:(m.savedStates.push(m.cloneObject(a)),!0)},m.getStateByIndex=function(a){var b=null;return typeof a=="undefined"?b=m.savedStates[m.savedStates.length-1]:a<0?b=m.savedStates[m.savedStates.length+a]:b=m.savedStates[a],b},m.getHash=function(){var a=m.unescapeHash(d.location.hash);return a},m.unescapeString=function(b){var c=b,d;for(;;){d=a.unescape(c);if(d===c)break;c=d}return c},m.unescapeHash=function(a){var b=m.normalizeHash(a);return b=m.unescapeString(b),b},m.normalizeHash=function(a){var b=a.replace(/[^#]*#/,"").replace(/#.*/,"");return b},m.setHash=function(a,b){var c,e,f;return b!==!1&&m.busy()?(m.pushQueue({scope:m,callback:m.setHash,args:arguments,queue:b}),!1):(c=m.escapeHash(a),m.busy(!0),e=m.extractState(a,!0),e&&!m.emulated.pushState?m.pushState(e.data,e.title,e.url,!1):d.location.hash!==c&&(m.bugs.setHash?(f=m.getPageUrl(),m.pushState(null,null,f+"#"+c,!1)):d.location.hash=c),m)},m.escapeHash=function(b){var c=m.normalizeHash(b);return c=a.escape(c),m.bugs.hashEscape||(c=c.replace(/\%21/g,"!").replace(/\%26/g,"&").replace(/\%3D/g,"=").replace(/\%3F/g,"?")),c},m.getHashByUrl=function(a){var b=String(a).replace(/([^#]*)#?([^#]*)#?(.*)/,"$2");return b=m.unescapeHash(b),b},m.setTitle=function(a){var b=a.title,c;b||(c=m.getStateByIndex(0),c&&c.url===a.url&&(b=c.title||m.options.initialTitle));try{d.getElementsByTagName("title")[0].innerHTML=b.replace("<","&lt;").replace(">","&gt;").replace(" & "," &amp; ")}catch(e){}return d.title=b,m},m.queues=[],m.busy=function(a){typeof a!="undefined"?m.busy.flag=a:typeof m.busy.flag=="undefined"&&(m.busy.flag=!1);if(!m.busy.flag){h(m.busy.timeout);var b=function(){var a,c,d;if(m.busy.flag)return;for(a=m.queues.length-1;a>=0;--a){c=m.queues[a];if(c.length===0)continue;d=c.shift(),m.fireQueueItem(d),m.busy.timeout=g(b,m.options.busyDelay)}};m.busy.timeout=g(b,m.options.busyDelay)}return m.busy.flag},m.busy.flag=!1,m.fireQueueItem=function(a){return a.callback.apply(a.scope||m,a.args||[])},m.pushQueue=function(a){return m.queues[a.queue||0]=m.queues[a.queue||0]||[],m.queues[a.queue||0].push(a),m},m.queue=function(a,b){return typeof a=="function"&&(a={callback:a}),typeof b!="undefined"&&(a.queue=b),m.busy()?m.pushQueue(a):m.fireQueueItem(a),m},m.clearQueue=function(){return m.busy.flag=!1,m.queues=[],m},m.stateChanged=!1,m.doubleChecker=!1,m.doubleCheckComplete=function(){return m.stateChanged=!0,m.doubleCheckClear(),m},m.doubleCheckClear=function(){return m.doubleChecker&&(h(m.doubleChecker),m.doubleChecker=!1),m},m.doubleCheck=function(a){return m.stateChanged=!1,m.doubleCheckClear(),m.bugs.ieDoubleCheck&&(m.doubleChecker=g(function(){return m.doubleCheckClear(),m.stateChanged||a(),!0},m.options.doubleCheckInterval)),m},m.safariStatePoll=function(){var b=m.extractState(d.location.href),c;if(!m.isLastSavedState(b))c=b;else return;return c||(c=m.createStateObject()),m.Adapter.trigger(a,"popstate"),m},m.back=function(a){return a!==!1&&m.busy()?(m.pushQueue({scope:m,callback:m.back,args:arguments,queue:a}),!1):(m.busy(!0),m.doubleCheck(function(){m.back(!1)}),n.go(-1),!0)},m.forward=function(a){return a!==!1&&m.busy()?(m.pushQueue({scope:m,callback:m.forward,args:arguments,queue:a}),!1):(m.busy(!0),m.doubleCheck(function(){m.forward(!1)}),n.go(1),!0)},m.go=function(a,b){var c;if(a>0)for(c=1;c<=a;++c)m.forward(b);else{if(!(a<0))throw new Error("History.go: History.go requires a positive or negative integer passed.");for(c=-1;c>=a;--c)m.back(b)}return m};if(m.emulated.pushState){var o=function(){};m.pushState=m.pushState||o,m.replaceState=m.replaceState||o}else m.onPopState=function(b,c){var e=!1,f=!1,g,h;return m.doubleCheckComplete(),g=m.getHash(),g?(h=m.extractState(g||d.location.href,!0),h?m.replaceState(h.data,h.title,h.url,!1):(m.Adapter.trigger(a,"anchorchange"),m.busy(!1)),m.expectedStateId=!1,!1):(e=m.Adapter.extractEventData("state",b,c)||!1,e?f=m.getStateById(e):m.expectedStateId?f=m.getStateById(m.expectedStateId):f=m.extractState(d.location.href),f||(f=m.createStateObject(null,null,d.location.href)),m.expectedStateId=!1,m.isLastSavedState(f)?(m.busy(!1),!1):(m.storeState(f),m.saveState(f),m.setTitle(f),m.Adapter.trigger(a,"statechange"),m.busy(!1),!0))},m.Adapter.bind(a,"popstate",m.onPopState),m.pushState=function(b,c,d,e){if(m.getHashByUrl(d)&&m.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(e!==!1&&m.busy())return m.pushQueue({scope:m,callback:m.pushState,args:arguments,queue:e}),!1;m.busy(!0);var f=m.createStateObject(b,c,d);return m.isLastSavedState(f)?m.busy(!1):(m.storeState(f),m.expectedStateId=f.id,n.pushState(f.id,f.title,f.url),m.Adapter.trigger(a,"popstate")),!0},m.replaceState=function(b,c,d,e){if(m.getHashByUrl(d)&&m.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(e!==!1&&m.busy())return m.pushQueue({scope:m,callback:m.replaceState,args:arguments,queue:e}),!1;m.busy(!0);var f=m.createStateObject(b,c,d);return m.isLastSavedState(f)?m.busy(!1):(m.storeState(f),m.expectedStateId=f.id,n.replaceState(f.id,f.title,f.url),m.Adapter.trigger(a,"popstate")),!0};if(f){try{m.store=k.parse(f.getItem("History.store"))||{}}catch(p){m.store={}}m.normalizeStore()}else m.store={},m.normalizeStore();m.Adapter.bind(a,"beforeunload",m.clearAllIntervals),m.Adapter.bind(a,"unload",m.clearAllIntervals),m.saveState(m.storeState(m.extractState(d.location.href,!0))),f&&(m.onUnload=function(){var a,b;try{a=k.parse(f.getItem("History.store"))||{}}catch(c){a={}}a.idToState=a.idToState||{},a.urlToId=a.urlToId||{},a.stateToId=a.stateToId||{};for(b in m.idToState){if(!m.idToState.hasOwnProperty(b))continue;a.idToState[b]=m.idToState[b]}for(b in m.urlToId){if(!m.urlToId.hasOwnProperty(b))continue;a.urlToId[b]=m.urlToId[b]}for(b in m.stateToId){if(!m.stateToId.hasOwnProperty(b))continue;a.stateToId[b]=m.stateToId[b]}m.store=a,m.normalizeStore(),f.setItem("History.store",k.stringify(a))},m.intervalList.push(i(m.onUnload,m.options.storeInterval)),m.Adapter.bind(a,"beforeunload",m.onUnload),m.Adapter.bind(a,"unload",m.onUnload));if(!m.emulated.pushState){m.bugs.safariPoll&&m.intervalList.push(i(m.safariStatePoll,m.options.safariPollInterval));if(e.vendor==="Apple Computer, Inc."||(e.appCodeName||"")==="Mozilla")m.Adapter.bind(a,"hashchange",function(){m.Adapter.trigger(a,"popstate")}),m.getHash()&&m.Adapter.onDomLoad(function(){m.Adapter.trigger(a,"hashchange")})}},m.init()}(window)