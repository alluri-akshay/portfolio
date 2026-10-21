# Centered responsive content column

Implemented 21 October 2026 following the owner's 75% versus 100% zoom comparison.

The shared shell now caps content at 1120 CSS pixels and centers it using equal automatic margins. Side gutters increase smoothly from 24 to 192 pixels as the viewport grows, reaching approximately 12% at a typical 1280px desktop viewport. Wider screens gain additional whitespace after the content reaches its cap. Phone gutters range from 18 to 24 pixels. Navigation, hero, work, experience content, about, credentials, contact content, footer, and case studies share this column.

Removed competing mobile shell width declarations. Hero typography responds to its actual content width, with viewport-based fallbacks, and the hero stacks below 1100px to accommodate the narrower column. Background bands continue to span the viewport while their content stays centered.

Browser zoom remains under visitor control. This layout provides the requested contained composition without forcing a zoom level, shrinking body text, or setting a fixed page width on phones.

No build or test suite was run. Layout is ready for owner UI review.
