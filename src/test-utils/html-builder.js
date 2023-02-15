import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(dirname(import.meta.url));
const answerTemplate = fs.readFileSync(join(__dirname, 'answer-template.html'), 'utf-8');

const htmlParser = new DOMParser();
const parseHTML = (html) => htmlParser.parseFromString(html.trim(), 'text/html');

export const createElement = (html) => {
  const document = parseHTML(html);

  const body = document.body;
  const element = body.firstElementChild;
  return { body, element };
};

export const createRealAnswer = (answer) => createElement(answerTemplate.replace('$$$ANSWER$$$', answer));
export const createRealComment = (comment) => createElement(answerTemplate.replace('$$$COMMENT$$$', comment));

const createManualAnswer = (content) => {
  const { element, ...rest } = createElement(`
    <div class="answercell post-layout--right">
        <div class="s-prose js-post-body" itemprop="text">
            ${content}
        </div>
    </div>`);

  return {
    element: element?.firstElementChild?.firstElementChild,
    ...rest,
  };
};

export const createCodeBlock = (codeContent) => {
  const block = `<code>${codeContent}</code>`;
  return createManualAnswer(block);
};
export const createPreCodeBlock = (codeContent) => {
  const block = `<pre><code>${codeContent}</code></pre>`;
  return createManualAnswer(block);
};
