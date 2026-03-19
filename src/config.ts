import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	bonjourDevice: { host: string; port: number; txt: Record<string, string> } | null
	host: string
	commandPort: number
	feedbackPort: number
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'bonjour-device',
			id: 'bonjourDevice',
			label: 'SherPresent Device',
			width: 12,
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 8,
			regex: Regex.IP,
			default: '127.0.0.1',
			isVisible: (config) => !config.bonjourDevice,
		},
		{
			type: 'number',
			id: 'commandPort',
			label: 'Command Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 9000,
			isVisible: (config) => !config.bonjourDevice,
		},
		{
			type: 'number',
			id: 'feedbackPort',
			label: 'Feedback Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 9001,
		},
	]
}
