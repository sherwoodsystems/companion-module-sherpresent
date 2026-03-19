import type {
	CompanionStaticUpgradeScript,
	CompanionUpgradeContext,
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
} from '@companion-module/base'
import type { ModuleConfig } from './config.js'

export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig>[] = [
	function migrateToV1(
		_context: CompanionUpgradeContext<ModuleConfig>,
		props: CompanionStaticUpgradeProps<ModuleConfig>,
	): CompanionStaticUpgradeResult<ModuleConfig> {
		const config = props.config as unknown as Record<string, unknown> | null
		if (!config) {
			return { updatedConfig: null, updatedActions: [], updatedFeedbacks: [] }
		}

		let configChanged = false

		// Migrate old single-port config to new multi-port config
		if ('port' in config && !('commandPort' in config)) {
			config.commandPort = 9000
			config.feedbackPort = 9001
			config.mode = 'direct'
			config.broadcastPort = 9002
			config.channel = 'main'
			delete config.port
			configChanged = true
		}

		return {
			updatedConfig: configChanged ? (config as unknown as ModuleConfig) : null,
			updatedActions: [],
			updatedFeedbacks: [],
		}
	},

	function migrateToV2(
		_context: CompanionUpgradeContext<ModuleConfig>,
		props: CompanionStaticUpgradeProps<ModuleConfig>,
	): CompanionStaticUpgradeResult<ModuleConfig> {
		const config = props.config as unknown as Record<string, unknown> | null
		if (!config) {
			return { updatedConfig: null, updatedActions: [], updatedFeedbacks: [] }
		}

		let configChanged = false

		// Migrate from broadcast/direct mode to bonjour discovery
		if ('mode' in config || 'broadcastPort' in config || 'channel' in config) {
			config.bonjourDevice = null

			if (!('host' in config)) config.host = '127.0.0.1'
			if (!('commandPort' in config)) config.commandPort = 9000
			if (!('feedbackPort' in config)) config.feedbackPort = 9001

			delete config.mode
			delete config.broadcastPort
			delete config.broadcastAddress
			delete config.channel
			configChanged = true
		}

		return {
			updatedConfig: configChanged ? (config as unknown as ModuleConfig) : null,
			updatedActions: [],
			updatedFeedbacks: [],
		}
	},
]
