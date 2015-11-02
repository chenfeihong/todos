;(function ($) {  
    $.fn.m139Check = function (options) { 
		var defaults = {
			checkClass : 'chk-m139check',
			labelClass : 'i-chooseMo',
			labeledClass : 'i-chooseYet',
			lblOtherClass:'',
			lblStyle:'',
			update : false
		};
		options = $.extend(defaults,options); 
		
		// 外部更新checked，手动调用一次
		var updateCheck = function($this){ 
			var $lbl = $this.next();
			if( $this.is(':checked')){
				$lbl.addClass(options.labeledClass);
			}
			else{ 
				$lbl.removeClass(options.labeledClass);
			}  
		}
		
		var createLabel = function( $this ){
			if ($this.hasClass(options.checkClass)) {return};
			var id = $this.attr('id');  
			var labelClass = options.labelClass;
			var lblStyle = options.lblStyle;
			if( !id){
				id= 'id_' + Math.round(Math.random() * 10000000000000000);
				$this.attr('id', id);
			}
			if( $this.is(':checked') ){
				labelClass = options.labelClass + ' ' +  options.labeledClass;
			}
			var lblId = 'lbl_' + id;
			var $lbl = $('<label id="'+ lblId +'" for="'+ id +'" class="'+ labelClass + '" style="'+ lblStyle+'">&nbsp;&nbsp;&nbsp;&nbsp;</label>');
			if( $('#' + lblId).length > 0 ){
				return false;
			}
			$this.addClass(options.checkClass).after($lbl);  
			$lbl.addClass(options.lblOtherClass);
			$lbl.click(function(){ 
				var $check = $(this).prev();  
				$check.change();  
				//避免点击快的时候出现选择样式而checkbox没选中
				/* 
				var $check = $(this).prev();
				if( $check.is(':checked')){
					$lbl.removeClass(options.labeledClass);
				}
				else{ 
					$lbl.addClass(options.labeledClass);
				} 
				*/ 
			});
			$this.change(function(e) {
				var event=e?e.target:(window.event?window.event.srcElement:null);
				if( $(event).is(':checked')){
					$(event).next().addClass(options.labeledClass);
				}
				else{ 
					$(event).next().removeClass(options.labeledClass);
				}
                
			}) //click 
			
			options.initCallback && options.initCallback($this);
		}
		
        return this.each(function () {  
			if(options.update){ 
				updateCheck( $(this) ); 
			}  
			else{
				createLabel( $(this) )
			} 
        });
    }; //m139check 
 
})(jQuery); 