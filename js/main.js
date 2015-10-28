$(document).ready(function($) {
	var AppView = Backbone.View.extend({
		el: 'body',
		initialize: function  () {
			this.inputTodo = $('#newTodo');
		},
		events: {
			'keypress #newTodo': 'createOnEnter'
		},
		createOnEnter: function  (e) {
			if(e.keyCode != 13) return;
			this.inputTodo.val() && alert(this.inputTodo.val());

		}
	});

	var TodoView = Backbone.View.extend({
		el: 'li'
	});

	/**
	 * model of todo
	 * @type {[type]}
	 */
	var Todo = Backbone.Model.extend({
		defaults: {
			title : 'my todos....'
		},
		/**
		 * 勾选或者不勾选事项
		 * @return {[type]} [description]
		 */
		toggle: function () {
			// body...
		}
	});

	var TodoList = Backbone.Collection.extend({
		model: Todo,
		// Save all of the todo items under the `"todos-backbone"` namespace. 这个很重要，本地存储
    	localStorage: new Backbone.LocalStorage("todos-backbone"),

	});

	var app = new AppView;
});