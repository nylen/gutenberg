/**
 * External dependencies
 */
import uuid from 'uuid/v4';

/**
 * Internal dependencies
 */
import { registerBlock, query } from 'api';
import Editable from 'components/editable';

const { html, prop } = query;

registerBlock( 'core/text', {
	title: wp.i18n.__( 'Text' ),

	icon: 'text',

	category: 'common',

	attributes: {
		content: html( 'div' ),
		align: prop( 'div', 'style.textAlign' )
	},

	controls: [
		{
			icon: 'editor-alignleft',
			title: wp.i18n.__( 'Align left' ),
			isActive: ( { align } ) => ! align || 'left' === align,
			onClick( attributes, setAttributes ) {
				setAttributes( { align: undefined } );
			}
		},
		{
			icon: 'editor-aligncenter',
			title: wp.i18n.__( 'Align center' ),
			isActive: ( { align } ) => 'center' === align,
			onClick( attributes, setAttributes ) {
				setAttributes( { align: 'center' } );
			}
		},
		{
			icon: 'editor-alignright',
			title: wp.i18n.__( 'Align right' ),
			isActive: ( { align } ) => 'right' === align,
			onClick( attributes, setAttributes ) {
				setAttributes( { align: 'right' } );
			}
		}
	],

	edit( { attributes, setAttributes, insertBlockAfter } ) {
		const { content, align } = attributes;

		return (
			<Editable
				value={ content }
				onChange={ ( value ) => setAttributes( { content: value } ) }
				style={ align ? { textAlign: align } : null }
				onSplit={ ( before, after ) => {
					setAttributes( { content: before } );
					insertBlockAfter( {
						uid: uuid(),
						blockType: 'core/text',
						attributes: {
							content: after
						}
					} );
				} }
			/>
		);
	},

	save( { attributes } ) {
		const { align, content } = attributes;

		return (
			<div
				style={ align ? { textAlign: align } : null }
				dangerouslySetInnerHTML={ { __html: content } }
			/>
		);
	}
} );
