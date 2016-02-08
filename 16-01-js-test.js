(function($){
    $(document).ready(function(){
        
        var orderFormSelector = ".landingorderform";
        var firstTimerMillis = 15000;
        var secondTimerMillis = 30000;

        if(typeof $.cookie('mmodal_events') == 'undefined')
        {
            $.cookie('mmodal_events', JSON.stringify([false,false,false,false]));
        }
        
        var evts = $.parseJSON($.cookie('mmodal_events'));
        var evts2 = [false,false];

        var cookieLifetime = 72;

        var firstEventTimer, secondEventTimer, uniqueEventOneTimer /* 1. не используется */;
        
        var conditions = {
            viewCookie : $.cookie("alreadyshowmodal") ? true : false,
            pageOnFocus : false,
            orderFormShown : false,
            someFormSubmited : false,
            userEnterPage : false,
        }
        
        $(window).on('load focus click', userFocusPage);
        
        $(window).on('blur', userLeavePage);

        function update_events()
        {
            $.cookie('mmodal_events', JSON.stringify(evts));
        }
/* 2. <==== Заменить на JQuery, для однообразности кода     */         
        function addEvent(obj, evt, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(evt, fn, false);
            }
            else if (obj.attachEvent) {
                obj.attachEvent("on" + evt, fn);
            }
        }
        
        addEvent(document, "mouseout", function(e) {
            e = e ? e : window.event;
            var from = e.relatedTarget || e.toElement;
            if (!from || from.nodeName == "HTML") {
                userLeavePage();
            }
        });
/* ====> */
        
        $(document).scroll(function(){
            conditions.userEnterPage = true;
            orderFormIsViewed();
            clearTimeout(firstEventTimer);
            clearTimeout(secondEventTimer);
            
            secondEventTimer = setTimeout(showSecondModal,secondTimerMillis);
        });
        
        $(document).click(function(){
            conditions.userEnterPage = true;
            clearTimeout(firstEventTimer);
            clearTimeout(secondEventTimer);
            
            secondEventTimer = setTimeout(showSecondModal,secondTimerMillis);
        });
        
        $(document).mousemove(function(){
            conditions.userEnterPage = true;
        });        
        
        function orderFormIsViewed() {
            var heightScreen = $(window).scrollTop();
            
            if (
                $(orderFormSelector).length &&
                (heightScreen >= $(orderFormSelector).offset().top - $(window).height())
            ) {
                conditions.orderFormShown = true;
            }
        }
        
        function userFocusPage(){
            if (document.hasFocus() && conditions.pageOnFocus == false) {
                conditions.pageOnFocus = true;
                
                orderFormIsViewed();
                
                firstEventTimer = setTimeout(showFirstModal,firstTimerMillis);
                secondEventTimer = setTimeout(showSecondModal,secondTimerMillis);
            }
        }
        
        function userLeavePage(e){
            conditions.pageOnFocus = false;
            clearTimeout(firstEventTimer);
            clearTimeout(secondEventTimer);
            
            if ( evts[2] || evts[3] || conditions.viewCookie || conditions.someFormSubmited ) {
                return;
            }
            
            if (!conditions.userEnterPage) {
                return;
            }
            
            if (conditions.orderFormShown) {
                evts[2] = true;
/* 3.1 <==== Вынести перед if, так как идентичны     */   
                update_events();
                events.call('marketing_open'); /* Ошибка: events is not defined (в другом скрипте?) */
/* ====> */       
                $.colorbox({inline:true, href:"#event-third", width:"880px", height:"auto", opacity: 0.85, closeButton: false});/* что должно отображаться в модальном окне? текущая страница? */
            } else {
                evts[3] = true;
/* 3.2 <==== Вынести перед if, так как идентичны     */   
                update_events();
                events.call('marketing_open'); /* Ошибка: events is not defined (в другом скрипте?) */
/* ====> */       
                $.colorbox({inline:true, href:"#event-second", width:"880px", height:"auto", opacity: 0.85, closeButton: false});/* что должно отображаться в модальном окне? текущая страница? */
            }
            
            var nowDate = new Date();
            nowDate.setHours( nowDate.getHours() + cookieLifetime );
            $.cookie("alreadyshowmodal","show",{ expires: nowDate, path: '/' });
        }
/* 4. <==== Заменить на одну процедуру, так как идентичны, args не используется. Возможно неверный код процедуры showSecondModal (копипаст не исправленный). 
			Если не исправленный копипаст - заменить на процедуру с аргументами для colorbox.
   */   
        function showFirstModal() {
            if (evts2[0] || evts2[1] || conditions.someFormSubmited || $("#cboxOverlay").is(':visible')) {
                return;
            }
            evts2[0] = evts2[1] = true;
            events.call('marketing_open');
            $.colorbox({inline:true, href:"#event-first", width:"880px", height:"auto", opacity: 0.85, closeButton: false}); /* что должно отображаться в модальном окне? текущая страница? */
        }

        function showSecondModal(args) {
            if (evts2[0] || evts2[1] || conditions.someFormSubmited || $("#cboxOverlay").is(':visible')) {
                return;
            }
            evts2[0] = evts2[1] = true;
            events.call('marketing_open');
            $.colorbox({inline:true, href:"#event-first", width:"880px", height:"auto", opacity: 0.85, closeButton: false});/* что должно отображаться в модальном окне? текущая страница? */
        }
/* ====> */       
        $(document).ajaxComplete(function(event,request,settings){
            possibleResponses = ["Order sent","Callback sent","Question sent", "Marketing sent"];
            
            if (possibleResponses.indexOf(request.responseText) >= 0) {
                conditions.someFormSubmited = true;
            }
        })
    });
})(jQuery)