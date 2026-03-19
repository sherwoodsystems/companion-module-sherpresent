import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { UpdatePresets } from './presets.js'
import { OscTransport, type OscConnectionInfo } from './osc.js'
import type osc from 'osc'

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig

	transport: OscTransport | null = null

	// State
	currentSlide = 0
	totalSlides = 0
	isPresenting = false
	isOpen = false
	zoomLevel = 0
	currentBuild = 0
	totalBuilds = 0

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		this.updateActions()
		this.updateFeedbacks()
		this.updatePresets()
		this.updateVariableDefinitions()

		this.initTransport()
	}

	async destroy(): Promise<void> {
		this.transport?.disconnect()
		this.transport = null
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
		this.transport?.disconnect()
		this.transport = null
		this.initTransport()
	}

	private getConnectionInfo(): OscConnectionInfo {
		if (this.config.bonjourDevice) {
			const [host, rawPort] = this.config.bonjourDevice.split(':')
			return {
				host,
				commandPort: Number(rawPort) || this.config.commandPort,
				feedbackPort: this.config.feedbackPort,
			}
		}
		return {
			host: this.config.host,
			commandPort: this.config.commandPort,
			feedbackPort: this.config.feedbackPort,
		}
	}

	private initTransport(): void {
		this.transport = new OscTransport(this.getConnectionInfo(), (address, args) => {
			this.handleFeedback(address, args)
		})

		try {
			this.transport.connect()
			this.updateStatus(InstanceStatus.Ok)
			// Request initial state
			this.send('status')
		} catch (e) {
			this.updateStatus(InstanceStatus.ConnectionFailure, String(e))
		}
	}

	handleFeedback(address: string, args: osc.OscArgument[]): void {
		const getInt = (index: number): number => {
			const arg = args[index]
			if (arg && arg.type === 'i') return arg.value as number
			return 0
		}

		let changed = false

		if (address === '/clicker/state/presenting') {
			const val = getInt(0) !== 0
			if (this.isPresenting !== val) {
				this.isPresenting = val
				changed = true
			}
		} else if (address === '/clicker/state/open') {
			const val = getInt(0) !== 0
			if (this.isOpen !== val) {
				this.isOpen = val
				changed = true
			}
		} else if (address === '/clicker/slide/current') {
			const val = getInt(0)
			if (this.currentSlide !== val) {
				this.currentSlide = val
				changed = true
			}
		} else if (address === '/clicker/slide/total') {
			const val = getInt(0)
			if (this.totalSlides !== val) {
				this.totalSlides = val
				changed = true
			}
		} else if (address === '/clicker/slide/build') {
			const val = getInt(0)
			if (this.currentBuild !== val) {
				this.currentBuild = val
				changed = true
			}
		} else if (address === '/clicker/slide/builds') {
			const val = getInt(0)
			if (this.totalBuilds !== val) {
				this.totalBuilds = val
				changed = true
			}
		} else if (address === '/clicker/zoom/level' || address === '/clicker/state/zoom') {
			const val = getInt(0)
			if (this.zoomLevel !== val) {
				this.zoomLevel = val
				changed = true
			}
		}

		if (changed) {
			this.setVariableValues({
				current_slide: this.currentSlide,
				total_slides: this.totalSlides,
				is_presenting: this.isPresenting ? 'true' : 'false',
				is_open: this.isOpen ? 'true' : 'false',
				zoom_level: this.zoomLevel,
				current_build: this.currentBuild,
				total_builds: this.totalBuilds,
			})
			this.checkFeedbacks('presenting', 'slide_match', 'is_open', 'has_builds')
		}
	}

	buildAddress(command: string): string {
		return `/clicker/${command}`
	}

	send(command: string, args: osc.OscArgument[] = []): void {
		this.transport?.send(this.buildAddress(command), args)
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updatePresets(): void {
		UpdatePresets(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
