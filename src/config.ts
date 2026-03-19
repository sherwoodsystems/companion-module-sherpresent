import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	host: string
	mode: 'direct' | 'broadcast'
	commandPort: number
	feedbackPort: number
	broadcastPort: number
	broadcastAddress: string
	channel: string
}

const VALID_CHANNELS = [
	{ id: 'main', label: 'Main' },
	{ id: 'backup', label: 'Backup' },
	...Array.from({ length: 9 }, (_, i) => ({ id: `keynote${i + 1}`, label: `Keynote ${i + 1}` })),
	...Array.from({ length: 9 }, (_, i) => ({ id: `aux${i + 1}`, label: `Aux ${i + 1}` })),
]

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 8,
			regex: Regex.IP,
			default: '127.0.0.1',
		},
		{
			type: 'dropdown',
			id: 'mode',
			label: 'Mode',
			width: 4,
			default: 'broadcast',
			choices: [
				{ id: 'direct', label: 'Direct' },
				{ id: 'broadcast', label: 'Broadcast' },
			],
		},
		{
			type: 'number',
			id: 'commandPort',
			label: 'Command Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 9000,
			isVisible: (config) => config.mode === 'direct',
		},
		{
			type: 'number',
			id: 'feedbackPort',
			label: 'Feedback Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 9001,
			isVisible: (config) => config.mode === 'direct',
		},
		{
			type: 'number',
			id: 'broadcastPort',
			label: 'Broadcast Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 9002,
			isVisible: (config) => config.mode === 'broadcast',
		},
		{
			type: 'textinput',
			id: 'broadcastAddress',
			label: 'Broadcast Address',
			width: 4,
			regex: Regex.IP,
			default: '255.255.255.255',
			isVisible: (config) => config.mode === 'broadcast',
		},
		{
			type: 'dropdown',
			id: 'channel',
			label: 'Channel',
			width: 4,
			default: 'main',
			choices: VALID_CHANNELS,
			isVisible: (config) => config.mode === 'broadcast',
		},
	]
}
