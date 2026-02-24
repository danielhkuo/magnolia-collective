function userMarkdownSetup(md) {
  // The md parameter stands for the markdown-it instance used throughout the site generator.
  // Feel free to add any plugin you want here instead of /.eleventy.js
  const defaultImageRenderer = md.renderer.rules.image || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options, env, self);
  };

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const altText = token.content || '';

    // Call the original renderer (this will include any logic from .eleventy.js)
    const imgHtml = defaultImageRenderer(tokens, idx, options, env, self);

    // By default, Obsidian specifies metadata using pipes e.g. "image.png|right|My Caption"
    const parts = altText.split('|').map(s => s.trim());
    const alignments = ['left', 'right', 'center'];

    // Figure out the alignment, default to center if none is specified
    let alignment = parts.find(p => alignments.includes(p.toLowerCase()));
    if (!alignment) {
      alignment = 'center';
    }

    // Figure out the caption: anything that isn't alignment and isn't just a number (for width)
    const captionParts = parts.filter(p => !alignments.includes(p.toLowerCase()) && isNaN(p));

    // Obsidian often leaves the filename as the first part. Let's filter it out if it has an image extension
    if (captionParts.length > 0) {
      const firstPartLower = captionParts[0].toLowerCase();
      if (firstPartLower.match(/\.(png|jpe?g|gif|svg|webp|avif|canvas)$/)) {
        captionParts.shift();
      }
    }

    const captionText = captionParts.join(' ').trim();
    const figClasses = `image-figure align-${alignment}`;

    if (captionText) {
      return `<figure class="${figClasses}">\n${imgHtml}\n<figcaption class="image-caption">${captionText}</figcaption>\n</figure>`;
    } else {
      // If there is no caption, we still wrap it in a figure so it properly auto-aligns.
      return `<figure class="${figClasses}">\n${imgHtml}\n</figure>`;
    }
  };
}
function userEleventySetup(eleventyConfig) {
  // The eleventyConfig parameter stands for the the config instantiated in /.eleventy.js.
  // Feel free to add any plugin you want here instead of /.eleventy.js
}
exports.userMarkdownSetup = userMarkdownSetup;
exports.userEleventySetup = userEleventySetup;
