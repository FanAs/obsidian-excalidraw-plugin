import {Plugin} from "obsidian"
// @ts-ignore
import {exportToSvg} from '@excalidraw/utils';
import {ExcalidrawView} from "./ExcalidrawView"

const EMBED_CLASS_NAME = 'internal-embed';
const SRC_ATTRIBUTE_NAME = 'src';
const EXCALIDRAW_FILE_EXTENSION = '.excalidraw';

export default class ExcalidrawPlugin extends Plugin {
	public onload(): void {
		this.registerView('excalidraw', (leaf) => {
			return new ExcalidrawView(leaf);
		});

		this.registerExtensions(['excalidraw'], 'excalidraw');

		this.registerMarkdownPostProcessor((element) => this.postprocessor(element))
	}

	public onunload(): void {
	}

	private postprocessor(element: HTMLElement): void {
		const embed = element.getElementsByClassName(EMBED_CLASS_NAME).item(0);
		if (embed == null) {
			return;
		}

		const src = embed.getAttribute(SRC_ATTRIBUTE_NAME);
		if (src == null || !src.endsWith(EXCALIDRAW_FILE_EXTENSION)) {
			return;
		}

		const matchFile = this.app.vault.getFiles().find((file) => file.path === src || file.path === this.app.workspace.getActiveFile().parent.path + '/' + src);

		this.app.vault.cachedRead(matchFile).then((fileContent) => {
			element.innerHTML = exportToSvg(JSON.parse(fileContent)).outerHTML;
			const item = element.getElementsByTagName('svg').item(0);

			item.style.backgroundColor = 'white';
			item.setAttribute('width', '100%');
			item.setAttribute('height', '100%');
		})
	}
}
