const EventEmitter = require("events");

module.exports = class MessageReader extends EventEmitter
{
    constructor()
    {
        super();
        this._accumulatedData = Buffer.alloc(0);
    }

    _read()
    {
        const delimiterIndex = this._accumulatedData.indexOf("\r\n");

        if (delimiterIndex >= 0) {
            let messageBuffer = this._accumulatedData.subarray(0, delimiterIndex);

            this.emit("message", messageBuffer.toString());

            this._accumulatedData = this._accumulatedData.subarray(delimiterIndex + 2);
            this._read();
        }
    }

    pipe(dataChunk)
    {
        this._accumulatedData = Buffer.concat([ this._accumulatedData, dataChunk ]);
        this._read();
    }
}