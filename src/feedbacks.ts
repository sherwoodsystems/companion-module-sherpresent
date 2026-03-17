import { combineRgb } from '@companion-module/base'
import type { ModuleInstance } from './main.js'

export function UpdateFeedbacks(self: ModuleInstance): void {
	self.setFeedbackDefinitions({
		presenting: {
			name: 'Is Presenting',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(0, 204, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				return self.isPresenting
			},
		},
		slide_match: {
			name: 'Slide Number Match',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(255, 255, 0),
				color: combineRgb(0, 0, 0),
			},
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
			callback: (feedback) => {
				return self.currentSlide === Number(feedback.options.slide)
			},
		},
		is_open: {
			name: 'Presentation Open',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(0, 102, 204),
				color: combineRgb(255, 255, 255),
			},
			options: [],
			callback: () => {
				return self.isOpen
			},
		},
	})
}
