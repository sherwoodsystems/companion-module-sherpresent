import dgram from 'dgram'
import osc from 'osc'

export interface OscConnectionInfo {
	host: string
	commandPort: number
	feedbackPort: number
}

export type FeedbackCallback = (address: string, args: osc.OscArgument[]) => void

export class OscTransport {
	private sendSocket: dgram.Socket | null = null
	private recvSocket: dgram.Socket | null = null
	private connection: OscConnectionInfo
	private onFeedback: FeedbackCallback

	constructor(connection: OscConnectionInfo, onFeedback: FeedbackCallback) {
		this.connection = connection
		this.onFeedback = onFeedback
	}

	connect(): void {
		// Send socket
		this.sendSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true })
		this.sendSocket.on('error', (err) => {
			console.error('OSC send socket error:', err.message)
		})

		// Receive socket
		this.recvSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true })

		this.recvSocket.on('message', (data) => {
			try {
				const msg = osc.readMessage(data, { metadata: true })
				if (msg.address) {
					this.onFeedback(msg.address, msg.args ?? [])
				}
			} catch {
				try {
					const packet = osc.readPacket(data, { metadata: true })
					if ('address' in packet) {
						const msg = packet
						this.onFeedback(msg.address, msg.args ?? [])
					}
				} catch {
					// Malformed packet, ignore
				}
			}
		})

		this.recvSocket.on('error', (err) => {
			console.error('OSC receive socket error:', err.message)
		})

		this.recvSocket.bind(this.connection.feedbackPort, '0.0.0.0')
	}

	send(address: string, args: osc.OscArgument[] = []): void {
		if (!this.sendSocket) return

		const msg = osc.writeMessage({ address, args })
		const buf = Buffer.from(msg)
		this.sendSocket.send(buf, this.connection.commandPort, this.connection.host)
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
