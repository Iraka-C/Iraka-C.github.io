# A Markdown Renderer [Github Address](https://github.com/Iraka-C/Iraka-C.github.io)

These are words.

## On the upper-right corner is the index of this page!

The followings are links to be shown in title bar menu. Hover your mouse on the title to show them. You can't see them in context.

[Menu item 1](*https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)

[Menu item 2](*https://marked.js.org/using_pro#renderer)

[Back to front](*../index.html)

(You cannot see the items above)

```js
markdown.html?title=<encodeURIComponent("Title Text")>&src=<encodeURIComponent("url to markdown")>
```

Embedded iframes: (If the "url to markdown" is invalid, this renderer will show 404. If this page cannot reach the file, it will show an error).

Drag the bottom-right corner to resize (not working on all browsers!)

![FRAME](../markdown.html)

![FRAME](//bing.com)

This renderer will automatically translate all relative paths in the markdown file (except unsafe ones, see [this section](#xss defense)).

## 2<sup>nd</sup> level title

### 3<sup>rd</sup> level title

**Bold** and *Italics*.

Superscript <sup>1</sup> and Subscript <sub>2</sub> .

<u>Underline</u> and <del>Delete line</del>。

[In-page anchor](#codes)

> Block quote
>
> * List lv.1
>   * List lv.2
>     * List lv.3
>     * List lv.3
> * List lv.1
>
> Include your quote here
>
> * [ ] Checkbox
> * [ ] Checkbox2
> * [x] Checked Checkbox
>
> > Block quote lv. 2
> >
> > > Quotes can be nested.
> >
> > 1. Ordered list 1
> > 2. Ordered list 2
> > 3. Ordered list 3

### Codes

Supports rendering `coding languages` in code format:

```javascript
function initPage(){
	marked.setOptions({
		highlight: function(code,lang,callback) {
			require('pygmentize-bundled')({lang: lang,format: 'html'},code,function(err,result) {
				callback(err,result.toString());
			});
		}
	});
	loadMarkdownFile().then(content=>{
		parseAndInsertMarkdown(content);
	}); // kick at first
}
```


> When the line is too long, horizontally drag to show all! (or on PC, use arrow keys)

Inline expression: $\alpha_r=\alpha_c+\alpha_b(1-\alpha_c) 10^{-4}$. You may also add hyperlink to expressions: [$\alpha_r=\alpha_c+\alpha_b(1-\alpha_c)$](//en.wikipedia.org/wiki/URI_fragment).

Audio and video. Include `AUDIO` or `VIDEO` tag in image expression `![AUDIO/VIDEO](url)`:

![AUDIO](../resources/d.mp3)

![VIDEO](../resources/tower.mp4)

> If the video has a large size, you may control its size using `<video>` tag in wide-screen view mode.
> 
> ---
> 
> <video controls width="200"><source src="../resources/tower.mp4"></video>

Align left

<center>Middle</center>

<div align="right">A text box<br>on the right</div>

Image: (use `OPAQUE` tag in image name to render as solid background)

![](https://upload.wikimedia.org/wikipedia/en/7/7b/Aspheric_navitar_elgeet.jpg)

![OPAQUE](https://upload.wikimedia.org/wikipedia/commons/3/3b/CIE1931xy_blank.svg)

![](https://upload.wikimedia.org/wikipedia/commons/3/3b/CIE1931xy_blank.svg)

If you use `<img>` tag to specify its size, add `class='opaque' `to get inline opaque image <img src="https://upload.wikimedia.org/wikipedia/commons/3/3b/CIE1931xy_blank.svg" width="100" class="opaque">. Elsewise, <img src="https://upload.wikimedia.org/wikipedia/commons/3/3b/CIE1931xy_blank.svg" width="100"> is a transparent image.



GIFs are also available:

<img src="https://upload.wikimedia.org/wikipedia/commons/6/63/Logistic_Map_Animation.gif" width="400" />

### Next 3<sup>rd</sup> level title

### Super Long Title Super Long Title Super Long Title Super Long Title Super Long Title Super Long Title Super Long Title Super Long Title Super Long Title Super Long Title Super Long Title Super Long Title Super Long Title Super Long Title Super Long Title Super Long Title Super Long Title Super Long Title Super Long Title Super Long Title Super Long Title

#### 4<sup>th</sup> level title (won't appear in index!)

Render an expression block: (4 backslashes for a new line! Markdown escape character issue)

$$
\begin{aligned}
	\alpha_r &= 1-\prod_{i=1}^N (1-f_i\alpha_c) \\\\
	&= 1-\exp\left[\sum_{i=1}^N \ln\left[1-f_i\left(1-(1-\alpha)^{1/N}\right)\right]\right] \\\\
	&\approx 1-\exp\left[\sum_{i=1}^N \ln(1-f_i\alpha/N)\right] \\\\
	&\approx 1-\exp(-\frac{\alpha}{N}\sum_{i=1}^N f_i) \\\\
	&\approx \frac{\alpha}{N}\sum_{i=1}^N f_i
\end{aligned}
$$

Table: highlight a column by hovering mouse cursor on the table head bar

| align left |    align middle     | align right |
| :--- | :---: | ---: |
| 1 | * list<br />* items |  2 |
| inline <img src="https://upload.wikimedia.org/wikipedia/commons/7/70/Rainbow1.svg" width="200" /> image | SVG image and video | <video controls width="200"><source src="../resources/tower.mp4"></video> |

Horizontal split line:

---

Next chapter

## XSS Defense

### Common XSS attack via html tag and CSS

The following contents will be filtered by the renderer:

| Type     | Sample (already filtered)                     |
| ----------: | :----------------------------------------------------------: |
| Script Embedding | `<script>alert(1)</script>`<br/><script>alert(1)</script> |
| Script Embedding | `<script>alert(1)</script>`<br/>`![img](javascript:alert(1))`<br>![img](javascript:alert(1)) |
| Escaped Script Embedding | `<script>alert(1)</script>`<br/>`[bad-link](&#0000106&#0000097&#0000118&#0000097`<br/>`&#0000115&#0000099&#0000114&#0000105&#0000112`<br/>`&#0000116&#0000058&#0000097&#0000108&#0000101`<br/>`&#0000114&#0000116&#0000040&&#0000048&&#0000041)`<br/>[bad-link](&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&&#0000048&&#0000041) |
|               CSS Attack | `<div style='background-image:url("javascript:alert(1)")'>para</div>`<br><div style='background-image:url("javascript:alert(1)")'>para</div> |

[Generally,  this renderer doesn't allow actions like `style, href="some script", onxxx="some script"`. Contents like this will be filtered when parsing the `.md` file]()

NOTICE: some unsafe relative path (like `resources/main-bg.jpg`) will also be treated as unsafe. Use other types of relative path instead! (in this case, `/resources/main-bg.jpg`)