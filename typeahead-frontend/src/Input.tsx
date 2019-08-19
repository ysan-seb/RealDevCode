import AbortController from 'abort-controller';
import cx from 'classnames';
import * as React from 'react';

import './Input.css';
import { Suggestion } from './interface';

interface Props {
	onPick: (suggestion: Suggestion) => void;
}

interface State {
	inputValue: string;
	suggestions: Suggestion[];
	cursor?: number;
}

enum KeyCode {
	UP = 38,
	DOWN = 40,
	ENTER = 13,
}

const Result: React.FC<{
	suggestions: Suggestion[];
	cursor?: number;
	onClick: (suggestion: Suggestion) => void;
	onHover: (i: number) => void;
}> = ({ suggestions, cursor, onClick, onHover }) => {
	if (suggestions.length === 0) {
		return null;
	}
	return (
		<ul>
			{suggestions.map((item, i) => (
				<li
					key={item.name}
					className={cx({ highlight: cursor === i })}
					onClick={() => onClick(item)}
					onMouseEnter={() => onHover(i)}
				>{`${item.name} | ${item.times}`}</li>
			))}
		</ul>
	);
};

export default class Input extends React.Component<Props, State> {
	public state: State = {
		inputValue: '',
		suggestions: [],
		cursor: undefined,
	};

	private REMOTE_ENDPOINT =
		'https://6wcm5jnqc2.execute-api.us-east-1.amazonaws.com/production/typeahead';

	private controller?: AbortController = undefined;

	private input = React.createRef<HTMLInputElement>();

	public render() {
		const suggestions = this.state.suggestions;
		return (
			<div className="AutoComplete">
				<input
					type="text"
					ref={this.input}
					value={this.state.inputValue}
					onChange={this.onChange}
					onFocus={this.onFocus}
					onKeyDown={this.onKeyDown}
				/>
				<Result
					suggestions={suggestions}
					cursor={this.state.cursor}
					onClick={this.onClick}
					onHover={this.onHover}
				/>
			</div>
		);
	}

	public componentWillUnmount() {
		if (this.controller) {
			this.controller.abort();
		}
	}

	private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let _inputValue
		this.setState({inputValue: event.target.value, cursor: undefined })
		// let controller = new AbortController()
		_inputValue = event.target.value
		// controller.abort()
		fetch(`${this.REMOTE_ENDPOINT}/${_inputValue}`)
		.then(res => res.json())
		.then(json => this.setState({suggestions: json}))
	};

	private onFocus = async (event: React.ChangeEvent<HTMLInputElement>) => {
		fetch(`${this.REMOTE_ENDPOINT}/`)
		.then(res => res.json())
		.then(json => this.setState({suggestions: json}))
	};

	private onClick = async (suggestion: Suggestion) => {
		this.input.current!.blur();
		this.props.onPick(suggestion)
		await this.pickSuggestion(suggestion);
		this.setState({suggestions: [], inputValue: '', cursor: undefined})
	};

	private pickSuggestion = async (suggestion: Suggestion) => {
		return await fetch(`${this.REMOTE_ENDPOINT}/set`, {
			method: 'post',
			body: JSON.stringify({ prefix: suggestion.name }),
			headers: {
				'Content-Type': 'application/json',
			},
		});
	};

	private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		let currentCursor = this.state.cursor
		let suggestionsSize = this.state.suggestions.length - 1
		
		if (e.keyCode === KeyCode.UP || e.keyCode === KeyCode.DOWN || e.keyCode === KeyCode.ENTER) {
			if (this.state.cursor === undefined) {
				this.setState({cursor: e.keyCode !== KeyCode.ENTER ? e.keyCode === KeyCode.UP ?  suggestionsSize : 0 : undefined})
				currentCursor = e.keyCode === KeyCode.UP ? suggestionsSize : 0
			} else if (this.state.cursor >= 0) {
				currentCursor = this.state.cursor
				if (e.keyCode === KeyCode.UP) {
					if (currentCursor > 0)
						currentCursor--
					else
						currentCursor = suggestionsSize
				} else if (e.keyCode === KeyCode.DOWN) {
					if (currentCursor < suggestionsSize)
						currentCursor++
					else
						currentCursor = 0
				} else if (e.keyCode === KeyCode.ENTER) {
					this.onClick(this.state.suggestions[currentCursor])
				}
				this.setState({cursor: currentCursor})
			}
		}
	};

	private onHover = (i: number) => {
		this.setState({cursor : i})
	};
}
