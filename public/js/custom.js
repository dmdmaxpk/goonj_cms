/*
Template Name: Admin Press Admin
Author: Themedesigner
Email: niravjoshi87@gmail.com
File: js
*/
$(function () {
    "use strict";
    $(function () {
        $(".preloader").fadeOut();
    });
    jQuery(document).on('click', '.mega-dropdown', function (e) {
        e.stopPropagation()
    });
    // ============================================================== 
    // This is for the top header part and sidebar part
    // ==============================================================  
    var set = function () {
            var width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width;
            var topOffset = 70;
            if (width < 1170) {
                $("body").addClass("mini-sidebar");
                $('.navbar-brand span').hide();
                $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
                $(".sidebartoggler i").addClass("ti-menu");
            }
            else {
                $("body").removeClass("mini-sidebar");
                $('.navbar-brand span').show();
                //$(".sidebartoggler i").removeClass("ti-menu");
            }
            
            var height = ((window.innerHeight > 0) ? window.innerHeight : this.screen.height) - 1;
            height = height - topOffset;
            if (height < 1) height = 1;
            if (height > topOffset) {
                $(".page-wrapper").css("min-height", (height) + "px");
            }
       
    };
    $(window).ready(set);
    $(window).on("resize", set);

    // ============================================================== 
    // Auto select left navbar
    // ============================================================== 
    $(function () {
        var url = window.location;
        var element = $('ul#sidebarnav a').filter(function () {
            return this.href == url;
        }).addClass('active').parent().addClass('active');
        while (true) {
            if (element.is('li')) {
                element = element.parent().addClass('in').parent().addClass('active');
            }
            else {
                break;
            }
        }
        
    });
    // ============================================================== 
    //tooltip
    // ============================================================== 
    $(function () {
            $('[data-toggle="tooltip"]').tooltip()
     })
    // ============================================================== 
    //Popover
    // ============================================================== 
    $(function () {
            $('[data-toggle="popover"]').popover()
        })

    // ============================================================== 
    // Resize all elements
    // ============================================================== 
    $("body").trigger("resize");


    // ============================================================== 
    // Collapsable cards
    // ==============================================================
        $('a[data-action="collapse"]').on('click',function(e){
            e.preventDefault();
            $(this).closest('.card').find('[data-action="collapse"] i').toggleClass('ti-minus ti-plus');
            $(this).closest('.card').children('.card-body').collapse('toggle');
           
        }); 
        // Toggle fullscreen
        $('a[data-action="expand"]').on('click',function(e){
            e.preventDefault();
            $(this).closest('.card').find('[data-action="expand"] i').toggleClass('mdi-arrow-expand mdi-arrow-compress');
            $(this).closest('.card').toggleClass('card-fullscreen');
        });

        // Close Card
        $('a[data-action="close"]').on('click',function(){
            $(this).closest('.card').removeClass().slideUp('fast');
        });
    
 
        
    
});