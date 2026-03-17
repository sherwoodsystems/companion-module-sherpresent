import type { ModuleInstance } from './main.js'

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	self.setVariableDefinitions([
		{ variableId: 'current_slide', name: 'Current Slide' },
		{ variableId: 'total_slides', name: 'Total Slides' },
		{ variableId: 'is_presenting', name: 'Is Presenting' },
		{ variableId: 'is_open', name: 'Presentation Open' },
		{ variableId: 'zoom_level', name: 'Zoom Level' },
	])
}
