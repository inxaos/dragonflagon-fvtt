import DFChatArchiveNew from "./DFChatArchiveNew.js";
import DFChatArchiveManager from "./DFChatArchiveManager.js";
import { DFChatArchive } from "./DFChatArchive.js";
import CONFIG from "../CONFIG.js";


export default function initDFChatArchive() {

	var archiveNew: DFChatArchiveNew = null;
	var archiveManager: DFChatArchiveManager = null;

	DFChatArchive.registerSettings();
	DFChatArchiveNew.registerSettings();

	game.settings.register(CONFIG.MOD_NAME, DFChatArchiveNew.PREF_HIDE_EXPORT, {
		name: 'DF_CHAT_ARCHIVE.Settings_HideExport',
		scope: 'world',
		type: Boolean,
		default: false,
		config: true,
		onChange: (newValue) => {
			if (!newValue)
				$('#dfcp-rt-buttons .export-log').show();
			else
				$('#dfcp-rt-buttons .export-log').hide();
		}
	});

	Hooks.on('renderChatLog', function (chatLog: ChatLog, html: JQuery<HTMLElement>, data: {}) {
		const archiveButton = $(`<a class="button chat-archive" title="${game.i18n.localize('DF_CHAT_ARCHIVE.ExportButtonTitle')}">
		<i class="fas fa-archive"></i></a>`)
		archiveButton.on('click', () => {
			if (archiveNew == null) {
				archiveNew = new DFChatArchiveNew();
				archiveNew.render(true);
			} else {
				archiveNew.bringToTop()
			}
		});
		html.find('.control-buttons')
			.prepend(archiveButton)
			.attr('style', 'flex:0 0 72px;');
		if (game.settings.get(CONFIG.MOD_NAME, DFChatArchiveNew.PREF_HIDE_EXPORT)) {
			html.find('.control-buttons .export-log').hide();
		}
	});

	Hooks.on('renderSettings', function (settings: Settings, html: JQuery<HTMLElement>, data: {}) {
		if (!game.user.isGM) return;
		const archiveManagerHtml = $(`<button data-action="archive"><i class="fas fa-archive"></i>${game.i18n.localize('DF_CHAT_ARCHIVE.OpenChatArchive')}</button>`);
		archiveManagerHtml.on('click', () => {
			if (archiveManager == null) {
				archiveManager = new DFChatArchiveManager();
				archiveManager.render(true);
			} else {
				archiveManager.bringToTop()
			}
		});
		html.find('#settings-game').append(archiveManagerHtml)
	});
	Hooks.on('closeDFChatArchiveNew', () => archiveNew = null)
	Hooks.on('closeDFChatArchiveManager', () => archiveManager = null)
}