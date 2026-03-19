import type { ModuleInstance } from './main.js'

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		next_slide: {
			name: 'Next Slide',
			options: [],
			callback: async () => {
				self.send('next')
			},
		},
		prev_slide: {
			name: 'Previous Slide',
			options: [],
			callback: async () => {
				self.send('prev')
			},
		},
		goto_slide: {
			name: 'Go To Slide',
			options: [
				{
					id: 'slide',
					type: 'number',
					label: 'Slide Number',
					default: 1,
					min: 1,
					max: 999,
				},
			],
			callback: async (event) => {
				const slide = Number(event.options.slide) || 1
				self.send('goto', [{ type: 'i', value: slide }])
			},
		},
		request_status: {
			name: 'Request Status',
			options: [],
			callback: async () => {
				self.send('status')
			},
		},
		refresh_state: {
			name: 'Refresh State',
			options: [],
			callback: async () => {
				self.send('refresh')
			},
		},
		zoom_in: {
			name: 'Zoom In',
			options: [],
			callback: async () => {
				self.send('zoomIn')
			},
		},
		zoom_out: {
			name: 'Zoom Out',
			options: [],
			callback: async () => {
				self.send('zoomOut')
			},
		},
		scroll_up: {
			name: 'Scroll Up',
			options: [],
			callback: async () => {
				self.send('scrollUp')
			},
		},
		scroll_down: {
			name: 'Scroll Down',
			options: [],
			callback: async () => {
				self.send('scrollDown')
			},
		},
	})
}
