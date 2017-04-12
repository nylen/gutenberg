/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';

export default class Editable extends wp.element.Component {
	constructor() {
		super( ...arguments );
		this.onInit = this.onInit.bind( this );
		this.onSetup = this.onSetup.bind( this );
		this.onChange = this.onChange.bind( this );
		this.onKeyDown = this.onKeyDown.bind( this );
		this.bindNode = this.bindNode.bind( this );
	}

	componentDidMount() {
		this.initialize();
	}

	initialize() {
		const config = {
			target: this.node,
			theme: false,
			inline: true,
			toolbar: false,
			browser_spellcheck: true,
			entity_encoding: 'raw',
			setup: this.onSetup,
			formats: {
				strikethrough: { inline: 'del' }
			}
		};

		tinymce.init( config );
	}

	onSetup( editor ) {
		this.editor = editor;
		editor.on( 'init', this.onInit );
		editor.on( 'focusout', this.onChange );
		editor.on( 'keydown', this.onKeyDown );
	}

	onInit() {
		this.editor.setContent( this.props.value );
	}

	onChange() {
		if ( ! this.editor.isDirty() ) {
			return;
		}
		const value = this.editor.getContent();
		this.editor.save();
		this.props.onChange( value );
	}

	onKeyDown( event ) {
		if ( ! this.props.tagName && event.keyCode === 13 ) {
			// Wait for the event to propagate
			setTimeout( () => {
				// Getting the content before and after the cursor
				this.editor.selection.getStart();
				const childNodes = Array.from( this.editor.getBody().childNodes );
				const splitIndex = childNodes.indexOf( this.editor.selection.getStart() );
				const getHtml = ( nodes ) => nodes.reduce( ( memo, node ) => memo + node.outerHTML, '' );
				const beforeNodes = childNodes.slice( 0, splitIndex );
				const before = getHtml( beforeNodes );
				const after = getHtml( childNodes.slice( splitIndex ) );

				// Splitting into two blocks
				this.editor.setContent( this.props.value );
				const hasAfter = !! childNodes.slice( splitIndex )
					.reduce( ( memo, node ) => memo + node.textContent, '' );
				this.props.onSplit( before, hasAfter ? after : '' );
			} );
		}
	}

	bindNode( ref ) {
		this.node = ref;
	}

	updateContent() {
		const bookmark = this.editor.selection.getBookmark( 2, true );
		this.editor.setContent( this.props.value );
		this.editor.selection.moveToBookmark( bookmark );
	}

	componentWillUnmount() {
		if ( this.editor ) {
			this.editor.destroy();
		}
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.value !== prevProps.value ) {
			this.updateContent();
		}
	}

	render() {
		const { tagName: Tag = 'div', style, className } = this.props;
		const classes = classnames( 'blocks-editable', className );

		return (
			<Tag
				ref={ this.bindNode }
				style={ style }
				className={ classes } />
		);
	}
}

Editable.defaultProps = {
	onSplit: () => {}
};
