import type { ModuleInstance } from './main.js'
import { type CompanionPresetDefinitions, combineRgb } from '@companion-module/base'

const white = combineRgb(255, 255, 255)
const black = combineRgb(0, 0, 0)

// Feedback colors (bright, used in active states)
const greenActive = combineRgb(0, 204, 0)
const blueActive = combineRgb(0, 102, 204)
const yellowActive = combineRgb(255, 255, 0)

// Base button colors (darker, used as default bg)
const darkGreen = combineRgb(0, 120, 0)
const darkRed = combineRgb(140, 0, 0)
const darkBlue = combineRgb(0, 51, 102)
const darkPurple = combineRgb(60, 0, 90)
const darkGrey = combineRgb(40, 40, 40)

export function UpdatePresets(self: ModuleInstance): void {
	const presets: CompanionPresetDefinitions = {}

	presets['next_slide'] = {
		type: 'button',
		category: 'Navigation',
		name: 'Next Slide',
		style: {
			text: 'NEXT\\n$(sherpresent:current_slide)/$(sherpresent:total_slides)',
			size: 'auto',
			color: white,
			bgcolor: darkGreen,
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
				style: { bgcolor: greenActive },
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
			bgcolor: darkRed,
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
				style: { bgcolor: greenActive },
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
			bgcolor: darkBlue,
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
				style: { bgcolor: yellowActive, color: black },
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
			bgcolor: darkGrey,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'presenting',
				options: {},
				style: { bgcolor: greenActive },
			},
		],
	}

	presets['presenting'] = {
		type: 'button',
		category: 'Info',
		name: 'Presenting',
		style: {
			text: 'PRESENTING',
			size: 'auto',
			color: white,
			bgcolor: darkGrey,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'presenting',
				options: {},
				style: { bgcolor: greenActive },
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
			bgcolor: darkPurple,
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
				style: { bgcolor: blueActive },
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
			bgcolor: darkPurple,
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
				style: { bgcolor: blueActive },
			},
		],
	}

	self.setPresetDefinitions(presets)
}
