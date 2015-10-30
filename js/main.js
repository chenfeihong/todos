$(document).ready(function($) {
	/**
	 * 前面是View 的定义
	 */
	var AppView = Backbone.View.extend({
		el: 'body',
		initialize: function  () {
			this.inputTodo = $('#newTodo');
			this.listenTo(myTodoList, 'add', this.addOne);
		},
		events: {
			'keypress #newTodo': 'createOnEnter'
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
			myTodoList.create({title: this.inputTodo.val()});
		},
		addOne: function  (todo) {
			console.log('add a todo');
			console.log(todo);
			var view = new TodoView({model: todo});
			console.log(view.render().el);
			$('#todoList').append(view.render().el);
		}
	});

	var TodoView = Backbone.View.extend({
		el: null,
		tagName: 'li',/*我去啊， 你要理解tagName和className的意思啊*/
		className:'todo-item',
		template: _.template($('#item-template').html()),
		initialize: function  (argument) {
			this.listenTo(this.model, 'change', this.render);
		},
		render: function  (argument) {
			//相当于给el赋值
			this.$el.html(this.template(this.model.toJSON()) );
			//给该li加上一个class 为done
			this.$el.toggleClass('done', this.model.get('done'));
			return this;//为什么return this， 链式调用啊
		},
		events: {
			'click .toggleCheckbox': 'toggleDone'
		},
		toggleDone: function  () {
			this.model.toggle();
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
		}
		
	});
	/**
	 * 所有事项
	 * @type {[type]}
	 */
	var TodoList = Backbone.Collection.extend({
		model: Todo,
		// Save all of the todo items under the `"todos-backbone"` namespace. 这个很重要，本地存储
    	localStorage: new Backbone.LocalStorage("todos-backbone")
	});

	//具体变量定义
	var myTodoList = new TodoList;//collection myTodoList
	var app = new AppView;//整个appview, 记住为什么app的new放在myTodoList后面， 因为js中声明是提前，但是初始化不会提前啊， 而此时appView又依赖myTodoList, 所以appView必须放在后面

});