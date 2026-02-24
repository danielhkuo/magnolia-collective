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
    
    // Figure out the alignment
    const alignment = parts.find(p => alignments.includes(p.toLowerCase()));
    
    // Figure out the caption: anything that isn't alignment and isn't just a number (for width)
    const captionParts = parts.filter(p => !alignments.includes(p.toLowerCase()) && isNaN(p));
    const captionText = captionParts.join(' ').trim();

    if (captionText) {
      let figClasses = "image-figure";
      if (alignment) {
        figClasses += ` align-${alignment.toLowerCase()}`;
      }
      return `<figure class="${figClasses}">\n${imgHtml}\n<figcaption class="image-caption">${captionText}</figcaption>\n</figure>`;
    }

    return imgHtml;
  };
}
function userEleventySetup(eleventyConfig) {
  // The eleventyConfig parameter stands for the the config instantiated in /.eleventy.js.
  // Feel free to add any plugin you want here instead of /.eleventy.js
}
exports.userMarkdownSetup = userMarkdownSetup;
exports.userEleventySetup = userEleventySetup;
