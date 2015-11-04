$(document).ready(function($) {
	/**
	 * 前面是View 的定义
	 */
	var AppView = Backbone.View.extend({
		el: 'body',
		statsTemplate: _.template($('#statsTemplate').html()),
		initialize: function  () {
			this.inputTodo = $('#newTodo');
			this.toggleAll = $('#toggleAll');
			this.listenTo(myTodoList, 'add', this.addOne);
			this.listenTo(myTodoList,'change', this.render);//监听change事件, 是为了监听toggle事件导致勾选数量发生变化， 重新render appview
			this.listenTo(myTodoList,'remove', this.render);//监听remove事件, 是为了删除某个待办后， 重新render appview

			myTodoList.fetch();//触发myTodoList的add事件，  这个地方灰常难以理解
			this.render();
		},
		render: function () {
			var done = myTodoList.done().length;
			var remaining = myTodoList.remaining().length;
			// alert(done.length + ', ' + remaining.length);
			var htmlText = this.statsTemplate({done:done, remaining: remaining});
			$('footer').html(htmlText);

			$('#main').show();
			myTodoList.length ==0 && $('#main').hide();//这样写屌不屌？？

			$('#toggleAll')[0].checked = !remaining;//全选按钮render
			
			$('input[type=checkbox]').m139Check({  
                lblOtherClass : 'c-pointer',
                lblStyle : 'position:absolute;',
                initCallback : function($this){
                    
                }
            });
		},
		events: {//注意， 这里的events的this指针都不是dom本身了 ，而是这个View本身
			'keypress #newTodo': 'createOnEnter',
			'click #toggleAll': 'toggleAll',
			'click #clear-completed': 'clearCompleted'
		},
		clearCompleted: function  () {
			_.invoke(myTodoList.done(), 'destroy');
		},
		initEvents: function  (argument) {
			//这句话意思是， model Todo 监听 集合myTodoList上的add事件
			this.listenTo(myTodoList, 'add', this.addOne);
		},
		/**
		 * 添加一个事项
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		createOnEnter: function  (e) {
			//判断逻辑
			if(e.keyCode != 13) return;
			if(!this.inputTodo.val()) {
				alert('请输入具体事项');
				return;
			}
			//this.inputTodo.val() && alert(this.inputTodo.val());
			//添加方法调用， 为什么独立写一个方法呢？ 因为前面只是数据完整性判断啊
			myTodoList.create({title: this.inputTodo.val()});//trigger create of myTodoList
		},
		addOne: function  (todo) {
			console.log('add a todo');
			console.log(todo);
			var view = new TodoView({model: todo});
			//console.log(view.render().el);
			$('#todoList').append(view.render().el);
		},
		toggleAll: function  () {
			var done = this.toggleAll[0].checked;
			myTodoList.each(function (todo) {
				todo.save({done: done});
			});
		}
	});

	var TodoView = Backbone.View.extend({
		tagName: 'li',/*我去啊， 你要理解tagName和className的意思啊*/
		className:'todo-item',
		template: _.template($('#item-template').html()),
		initialize: function  (argument) {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);//this.remove是view的自带方法哦
		},
		render: function  (argument) {
			//相当于给el赋值
			this.$el.html(this.template(this.model.toJSON()) );
			//给该li加上一个class 为done
			this.$el.toggleClass('done', this.model.get('done'));//是否加上done， 那得看done属性是否为true
			this.input = this.$('.textEdit');
			return this;//为什么return this， 链式调用啊
		},
		events: {
			'click .toggleCheckbox': 'toggleDone',
			'click a.destroy': 'clear',
			'dblclick .todoText': 'edit'
		},
		edit: function() {
			this.$el.addClass('editing');
			//this.input.show();
			this.input.focus();//为什么只要focus就可以了， 不需要show？
		},
		toggleDone: function  () {
			this.model.toggle();
		},
		clear: function (e) {//清除一个事件的model的数据
			this.model.destroy();//destroy 将触发Collection的remove事件
		}
	});

	/**
	 * model of 对应每一个事项
	 * @type {[type]}
	 */
	var Todo = Backbone.Model.extend({
		defaults: {
			title : 'my todos....',
			done: false//是否完成
		},
		/**
		 * 勾选或者不勾选事项
		 * @return {[type]} [description]
		 */
		toggle: function () {
			this.save({done: !this.get('done')});
			//触发appview render事件
			/*var object = {};
			_.extend(object, Backbone.Events);
			object.trigger('appViewRender');
			alert('fk');*/
		}
		
	});
	/**
	 * 所有事项
	 * @type {[type]}
	 */
	var TodoList = Backbone.Collection.extend({
		model: Todo,
		// Save all of the todo items under the `"todos-backbone"` namespace. 这个很重要，本地存储
    	localStorage: new Backbone.LocalStorage("todos-backbone"),
    	done: function  (argument) {//过滤， 返回所有done为true的
    		return this.where({done: true});
    	},
    	remaining: function () {
    		return this.where({done: false});
    	}
	});

	//具体变量定义
	var myTodoList = new TodoList;//collection myTodoList
	var app = new AppView;//整个appview, 记住为什么app的new放在myTodoList后面， 因为js中声明是提前，但是初始化不会提前啊， 而此时appView又依赖myTodoList, 所以appView必须放在后面

});