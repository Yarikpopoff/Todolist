var ToDoRecord = React.createClass({
	render: function() {
		return (
				<li className="record">
					<div className="record-marker">
						<div className={this.props.markerClass} onClick={this.props.onToggle}>{this.props.symbol}</div>
					</div>
					<div className={this.props.textClass}>{this.props.text}</div>
					<div className="record-delete" onClick={this.props.onDelete}>&times;</div>
				</li>
		);
	}
});

var ToDoList = React.createClass({
	
	getInitialState: function() {
		return {
			filter: 1, // 1-all, 2-new, 3-done
			newText: '',
			records: [] 
		};
	},

	componentDidMount: function() {
		this.getFromLocalStorage();
	},

	componentDidUpdate: function() {
		this.updateLocalStorage();
	},

	add: function() {
		var newText = this.state.newText;
		var newId = Math.random().toString().slice(-10);
		var newRecord = {
			id: newId,
			status: false,
			text: newText
		};
		var newRecords = this.state.records.slice();
		newRecords.push(newRecord);
		this.setState({ newText: '', records: newRecords });
	},
	
	all: function() {
		// this.getFromLocalStorage();
		this.setState({ filter: 1 });		
	},

	new: function() {
		// var localRecords = JSON.parse(localStorage.getItem('records'));
		// var newRecords = localRecords.filter(function(el) {
			// return el.status == false;
		// });
		// this.setState({ filter: true, records: newRecords });
		this.setState({ filter: 2 });		
	},

	completed: function() {
		// var localRecords = JSON.parse(localStorage.getItem('records'));		
		// var newRecords = localRecords.filter(function(el) {
			// return el.status == true;
		// });
		// this.setState({ filter: true, records: newRecords });
		this.setState({ filter: 3 });		
	},

	handleDelete: function(record) {
		var newRecords = this.state.records.filter(function(el) {
			return record.id !== el.id;
		});
		this.setState({ records: newRecords });
	},

	handleToggle: function(record) {
		var newRecords = this.state.records.map(function(el) {
			if (record.id == el.id) { 
				el.status = !el.status;
			};
			return el;
		});
		this.setState({ records: newRecords });
	},

	handleChange: function(event) {
		this.setState({newText: event.target.value});
	},

	updateLocalStorage: function() {
		// if (!this.state.filter) {
			var records = JSON.stringify(this.state.records);
			localStorage.setItem('records', records);
		// };
	},

	getFromLocalStorage: function() {
		var localRecords = JSON.parse(localStorage.getItem('records'));
		this.setState({ filter: false, records: localRecords ? localRecords : [] });
	},

	render: function () {
		
		var handleDelete = this.handleDelete;
		var handleToggle = this.handleToggle;

		var temp;
		
		if (this.state.filter == 1) {
			temp = this.state.records;
		} else
				if (this.state.filter == 2) {
					temp = this.state.records.filter(function(el) {
						return !el.status;
					});
				} else
					if (this.state.filter == 3) {
						temp = this.state.records.filter(function(el) {
							return el.status;
						});
					};

		return (
			<div className="to-do-list">
				<div className="record-add">
					<p>To-do List</p>
					<input 
						type="text" 
						placeholder="What you need to do?"
						value={this.state.newText}
						onChange={this.handleChange}>
					</input>
					<button onClick={this.add}>Add</button>
				</div>
				<ul> {
						temp.map(function(el, i) {
							return (
								<ToDoRecord 
									key={ i }
									symbol={el.status ? "✓" : ""} 
									markerClass={el.status ? "marker-ok" : "marker-new"} 
									text={el.text} 
									textClass={el.status ? "record-text text-ok" : "	record-text text-new"} 
									onDelete={handleDelete.bind(null, el)} 
									onToggle={handleToggle.bind(null, el)}>
								</ToDoRecord>
							);
						})
					}
				</ul>
				<div>
					<button onClick={this.all}>All</button>
					<button onClick={this.new}>New</button>
					<button onClick={this.completed}>Completed</button>
				</div>
			</div>
		);
	}
});

ReactDOM.render(
	<ToDoList />,
   	document.getElementById('mount-point')
);