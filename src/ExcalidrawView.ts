import {TextFileView, WorkspaceLeaf} from "obsidian"
// @ts-ignore
import {exportToSvg} from '@excalidraw/utils';

const EXCALIDRAW_FILE_EXTENSION = 'excalidraw';

export class ExcalidrawView extends TextFileView {
	private viewData: string;

	public constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	public clear() {

	}

	public getViewData(): string {
		return this.viewData;
	}

	public setViewData(data: string, clear: boolean) {
		this.viewData = data;

		this.contentEl.innerHTML = exportToSvg(JSON.parse(data)).outerHTML;
		const item = this.contentEl.getElementsByTagName('svg').item(0);

		item.style.backgroundColor = 'white';
		item.setAttribute('width', '100%');
		item.setAttribute('height', '100%');
	}

	/**
	 * gets the title of the document
	 */
	public getDisplayText() {
		if (this.file) {
			return this.file.basename;
		}

		return 'excalidraw (no file)';
	}

	/**
	 * confirms this view can accept defined extension
	 *
	 * @param extension
	 */
	public canAcceptExtension(extension: string) {
		return extension === EXCALIDRAW_FILE_EXTENSION;
	}

	/**
	 * the view type name
	 */
	public getViewType() {
		return 'excalidraw';
	}
}
