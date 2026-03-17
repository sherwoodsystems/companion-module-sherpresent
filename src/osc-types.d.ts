declare module 'osc' {
	interface OscArgument {
		type: string
		value: number | string | boolean | Buffer
	}

	interface OscMessage {
		address: string
		args?: OscArgument[]
	}

	function writeMessage(msg: OscMessage): Uint8Array
	function readMessage(data: Uint8Array | Buffer, options?: object): OscMessage
	function readPacket(data: Uint8Array | Buffer, options?: object): OscMessage
}
