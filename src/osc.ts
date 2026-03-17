import dgram from 'dgram'
import osc from 'osc'
import type { ModuleConfig } from './config.js'

export type FeedbackCallback = (address: string, args: osc.OscArgument[]) => void

export class OscTransport {
	private sendSocket: dgram.Socket | null = null
	private recvSocket: dgram.Socket | null = null
	private config: ModuleConfig
	private onFeedback: FeedbackCallback

	constructor(config: ModuleConfig, onFeedback: FeedbackCallback) {
		this.config = config
		this.onFeedback = onFeedback
	}

	connect(): void {
		// Send socket
		this.sendSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true })
		this.sendSocket.on('error', (err) => {
			// Errors are non-fatal for the send socket
			console.error('OSC send socket error:', err.message)
		})

		// Receive socket
		this.recvSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true })

		this.recvSocket.on('message', (data) => {
			try {
				const msg = osc.readMessage(data, { metadata: true })
				if (msg.address) {
					this.handleIncoming(msg)
				}
			} catch {
				// Try reading as packet (bundles)
				try {
					const packet = osc.readPacket(data, { metadata: true })
					if ('address' in packet) {
						this.handleIncoming(packet)
					}
				} catch {
					// Malformed packet, ignore
				}
			}
		})

		this.recvSocket.on('error', (err) => {
			console.error('OSC receive socket error:', err.message)
		})

		if (this.config.mode === 'direct') {
			// Listen on feedbackPort for incoming feedback
			this.recvSocket.bind(this.config.feedbackPort, '0.0.0.0')
		} else {
			// Broadcast mode: listen on broadcastPort
			this.recvSocket.bind(this.config.broadcastPort, '0.0.0.0', () => {
				this.recvSocket?.setBroadcast(true)
			})
			this.sendSocket.bind(undefined, undefined, () => {
				this.sendSocket?.setBroadcast(true)
			})
		}
	}

	private handleIncoming(msg: osc.OscMessage): void {
		const args = msg.args ?? []

		if (this.config.mode === 'broadcast') {
			// Filter by channel prefix
			const prefix = `/clicker/${this.config.channel}/`
			if (!msg.address.startsWith(prefix)) {
				return
			}
			// Rewrite address to direct format for uniform handling
			const suffix = msg.address.slice(prefix.length)
			this.onFeedback(`/clicker/${suffix}`, args)
		} else {
			this.onFeedback(msg.address, args)
		}
	}

	send(address: string, args: osc.OscArgument[] = []): void {
		if (!this.sendSocket) return

		const msg = osc.writeMessage({ address, args })
		const buf = Buffer.from(msg)

		if (this.config.mode === 'direct') {
			this.sendSocket.send(buf, this.config.commandPort, this.config.host)
		} else {
			this.sendSocket.send(buf, this.config.broadcastPort, '255.255.255.255')
		}
	}

	disconnect(): void {
		try {
			this.sendSocket?.close()
		} catch {
			// Already closed
		}
		try {
			this.recvSocket?.close()
		} catch {
			// Already closed
		}
		this.sendSocket = null
		this.recvSocket = null
	}
}
