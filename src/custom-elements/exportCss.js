import sass from 'sass';
import fs from 'fs';
import * as path from 'path';
import * as parse5 from 'parse5';

export default function vitePluginStyleExtractor({ isSass, outputDirPath }) {
  function exportCss(src, id) {
    let indicator = parse5.parse(src);
    function getStyles() {
      let styles = { lang: 'css', styles: '' };
      indicator.childNodes.forEach((node) => {
        if (node.tagName === 'html') {
          let children = node.childNodes;
          children.forEach((child) => {
            if (child.tagName === 'head') {
              let headChildren = child.childNodes;
              headChildren.forEach((headChild) => {
                if (headChild.tagName === 'style') {
                  let tagAttributes = headChild.attrs ? headChild.attrs[0]['value'] : 'css';
                  let style = headChild.childNodes[0].value;
                  styles.lang = tagAttributes;
                  styles.styles = style;
                }
              });
            }
          });
        }
      });
      return styles;
    }
    let { lang, styles } = getStyles(indicator);
    if (isSass || ['scss', 'sass', 'less'].includes(lang)) {
      styles = sass.compileString(styles);
    }
    let filename = id.split('/').pop().replace(`.vue`, '.css');
    filename = path.join(outputDirPath, `style_${filename}`);

    fs.writeFileSync(filename, styles.css);
  }

  return {
    name: 'extract-css',

    transform(code, id) {
      exportCss(code, id);
      return {
        code: code,
        map: null,
      };
    },
    handleHotUpdate(ctx) {
      exportCss(ctx.file, ctx.file);
    },
  };
}
