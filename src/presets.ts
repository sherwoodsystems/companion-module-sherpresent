import type { ModuleInstance } from './main.js'
import { type CompanionPresetDefinitions, combineRgb } from '@companion-module/base'

export function UpdatePresets(self: ModuleInstance): void {
	const presets: CompanionPresetDefinitions = {}

	const white = combineRgb(255, 255, 255)
	const black = combineRgb(0, 0, 0)
	const green = combineRgb(0, 204, 0)
	const blue = combineRgb(0, 102, 204)

	presets['next_slide'] = {
		type: 'button',
		category: 'Navigation',
		name: 'Next Slide',
		style: {
			text: 'NEXT\\n$(sherpresent:current_slide)/$(sherpresent:total_slides)',
			size: 'auto',
			color: white,
			bgcolor: black,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'next_slide', options: {} }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'presenting',
				options: {},
				style: { bgcolor: green },
			},
		],
	}

	presets['prev_slide'] = {
		type: 'button',
		category: 'Navigation',
		name: 'Previous Slide',
		style: {
			text: 'PREV\\n$(sherpresent:current_slide)/$(sherpresent:total_slides)',
			size: 'auto',
			color: white,
			bgcolor: black,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'prev_slide', options: {} }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'presenting',
				options: {},
				style: { bgcolor: green },
			},
		],
	}

	presets['goto_1'] = {
		type: 'button',
		category: 'Navigation',
		name: 'Go To Slide 1',
		style: {
			text: 'GOTO 1',
			size: 'auto',
			color: white,
			bgcolor: black,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'goto_slide', options: { slide: 1 } }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'slide_match',
				options: { slide: 1 },
				style: { bgcolor: combineRgb(255, 255, 0), color: black },
			},
		],
	}

	presets['status'] = {
		type: 'button',
		category: 'Info',
		name: 'Status',
		style: {
			text: '$(sherpresent:current_slide)/$(sherpresent:total_slides)',
			size: 'auto',
			color: white,
			bgcolor: black,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'presenting',
				options: {},
				style: { bgcolor: green },
			},
		],
	}

	presets['zoom_in'] = {
		type: 'button',
		category: 'Zoom',
		name: 'Zoom In',
		style: {
			text: 'ZOOM+\\n$(sherpresent:zoom_level)%',
			size: 'auto',
			color: white,
			bgcolor: black,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'zoom_in', options: {} }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'is_open',
				options: {},
				style: { bgcolor: blue },
			},
		],
	}

	presets['zoom_out'] = {
		type: 'button',
		category: 'Zoom',
		name: 'Zoom Out',
		style: {
			text: 'ZOOM-\\n$(sherpresent:zoom_level)%',
			size: 'auto',
			color: white,
			bgcolor: black,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'zoom_out', options: {} }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'is_open',
				options: {},
				style: { bgcolor: blue },
			},
		],
	}

	self.setPresetDefinitions(presets)
}
