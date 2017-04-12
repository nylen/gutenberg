/**
 * Internal dependencies
 */
import { registerBlock, query } from 'api';
import Editable from 'components/editable';

const { attr, html } = query;

function Image( { url, alt, align } ) {
	let className;
	if ( align ) {
		className = `align${ align }`;
	}

	return <img src={ url } alt={ alt } className={ className } />;
}

function applyOrUnset( align ) {
	return ( attributes, setAttributes ) => {
		const nextAlign = attributes.align === align ? undefined : align;
		setAttributes( { align: nextAlign } );
	};
}

registerBlock( 'core/image', {
	title: wp.i18n.__( 'Image' ),

	icon: 'format-image',

	category: 'common',

	attributes: {
		url: attr( 'img', 'src' ),
		alt: attr( 'img', 'alt' ),
		caption: html( 'figcaption' ),
		align: ( node ) => ( node.className.match( /\balign(\S+)/ ) || [] )[ 1 ]
	},

	controls: [
		{
			icon: 'align-left',
			title: wp.i18n.__( 'Align left' ),
			isActive: ( { align } ) => 'left' === align,
			onClick: applyOrUnset( 'left' )
		},
		{
			icon: 'align-center',
			title: wp.i18n.__( 'Align center' ),
			isActive: ( { align } ) => 'center' === align,
			onClick: applyOrUnset( 'center' )
		},
		{
			icon: 'align-right',
			title: wp.i18n.__( 'Align right' ),
			isActive: ( { align } ) => 'right' === align,
			onClick: applyOrUnset( 'right' )
		},
		{
			icon: 'align-none',
			title: wp.i18n.__( 'No alignment' ),
			isActive: ( { align } ) => ! align || 'none' === align,
			onClick: applyOrUnset( 'none' )
		}
	],

	edit( { attributes, isSelected, setAttributes } ) {
		const { url, alt, align, caption } = attributes;

		return (
			<figure>
				<Image url={ url } alt={ alt } align={ align } />
				{ caption || isSelected ? (
					<Editable
						tagName="figcaption"
						placeholder={ wp.i18n.__( 'Write caption…' ) }
						value={ caption }
						onChange={ ( value ) => setAttributes( { caption: value } ) } />
				) : null }
			</figure>
		);
	},

	save( { attributes } ) {
		const { url, alt, align, caption } = attributes;
		const img = <Image url={ url } alt={ alt } align={ align } />;

		if ( ! caption ) {
			return img;
		}

		return (
			<figure>
				{ img }
				<figcaption dangerouslySetInnerHTML={ { __html: caption } } />
			</figure>
		);
	}
} );
