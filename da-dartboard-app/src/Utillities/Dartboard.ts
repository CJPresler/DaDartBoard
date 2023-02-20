export enum Segment {
    BULL, DBL_BULL,
    INNER_1, TRP_1, OUTER_1, DBL_1,
    INNER_2, TRP_2, OUTER_2, DBL_2,
    INNER_3, TRP_3, OUTER_3, DBL_3,
    INNER_4, TRP_4, OUTER_4, DBL_4,
    INNER_5, TRP_5, OUTER_5, DBL_5,
    INNER_6, TRP_6, OUTER_6, DBL_6,
    INNER_7, TRP_7, OUTER_7, DBL_7,
    INNER_8, TRP_8, OUTER_8, DBL_8,
    INNER_9, TRP_9, OUTER_9, DBL_9,
    INNER_10, TRP_10, OUTER_10, DBL_10,
    INNER_11, TRP_11, OUTER_11, DBL_11,
    INNER_12, TRP_12, OUTER_12, DBL_12,
    INNER_13, TRP_13, OUTER_13, DBL_13,
    INNER_14, TRP_14, OUTER_14, DBL_14,
    INNER_15, TRP_15, OUTER_15, DBL_15,
    INNER_16, TRP_16, OUTER_16, DBL_16,
    INNER_17, TRP_17, OUTER_17, DBL_17,
    INNER_18, TRP_18, OUTER_18, DBL_18,
    INNER_19, TRP_19, OUTER_19, DBL_19,
    INNER_20, TRP_20, OUTER_20, DBL_20,
}

const GRANBOARD_UUID = "442f1570-8a00-9a28-cbe1-e1d4212d53eb";

const SEGMENT_MAPPING = {
    "56-46-48-64":    Segment.BULL,     "52-46-48-64":    Segment.DBL_BULL,
    "50-46-51-64":    Segment.INNER_1,  "50-46-52-64":    Segment.TRP_1,  "50-46-53-64":    Segment.OUTER_1,  "50-46-54-64":    Segment.DBL_1,
    "57-46-49-64":    Segment.INNER_2,  "57-46-48-64":    Segment.TRP_2,  "57-46-50-64":    Segment.OUTER_2,  "56-46-50-64":    Segment.DBL_2,
    "55-46-49-64":    Segment.INNER_3,  "55-46-48-64":    Segment.TRP_3,  "55-46-50-64":    Segment.OUTER_3,  "56-46-52-64":    Segment.DBL_3,
    "48-46-49-64":    Segment.INNER_4,  "48-46-51-64":    Segment.TRP_4,  "48-46-53-64":    Segment.OUTER_4,  "48-46-54-64":    Segment.DBL_4,
    "53-46-49-64":    Segment.INNER_5,  "53-46-50-64":    Segment.TRP_5,  "53-46-52-64":    Segment.OUTER_5,  "52-46-54-64":    Segment.DBL_5,
    "49-46-48-64":    Segment.INNER_6,  "49-46-49-64":    Segment.TRP_6,  "49-46-51-64":    Segment.OUTER_6,  "52-46-52-64":    Segment.DBL_6,
    "49-49-46-49-64": Segment.INNER_7,  "49-49-46-50-64": Segment.TRP_7,  "49-49-46-52-64": Segment.OUTER_7,  "56-46-54-64":    Segment.DBL_7,
    "54-46-50-64":    Segment.INNER_8,  "54-46-52-64":    Segment.TRP_8,  "54-46-53-64":    Segment.OUTER_8,  "54-46-54-64":    Segment.DBL_8,
    "57-46-51-64":    Segment.INNER_9,  "57-46-52-64":    Segment.TRP_9,  "57-46-53-64":    Segment.OUTER_9,  "57-46-54-64":    Segment.DBL_9,
    "50-46-48-64":    Segment.INNER_10, "50-46-49-64":    Segment.TRP_10, "50-46-50-64":    Segment.OUTER_10, "52-46-51-64":    Segment.DBL_10,
    "55-46-51-64":    Segment.INNER_11, "55-46-52-64":    Segment.TRP_11, "55-46-53-64":    Segment.OUTER_11, "55-46-54-64":    Segment.DBL_11,
    "53-46-48-64":    Segment.INNER_12, "53-46-51-64":    Segment.TRP_12, "53-46-53-64":    Segment.OUTER_12, "53-46-54-64":    Segment.DBL_12,
    "48-46-48-64":    Segment.INNER_13, "48-46-50-64":    Segment.TRP_13, "48-46-52-64":    Segment.OUTER_13, "52-46-53-64":    Segment.DBL_13,
    "49-48-46-51-64": Segment.INNER_14, "49-48-46-52-64": Segment.TRP_14, "49-48-46-53-64": Segment.OUTER_14, "49-48-46-54-64": Segment.DBL_14,
    "51-46-48-64":    Segment.INNER_15, "51-46-49-64":    Segment.TRP_15, "51-46-50-64":    Segment.OUTER_15, "52-46-50-64":    Segment.DBL_15,
    "49-49-46-48-64": Segment.INNER_16, "49-49-46-51-64": Segment.TRP_16, "49-49-46-53-64": Segment.OUTER_16, "49-49-46-54-64": Segment.DBL_16,
    "49-48-46-49-64": Segment.INNER_17, "49-48-46-48-64": Segment.TRP_17, "49-48-46-50-64": Segment.OUTER_17, "56-46-51-64":    Segment.DBL_17,
    "49-46-50-64":    Segment.INNER_18, "49-46-52-64":    Segment.TRP_18, "49-46-53-64":    Segment.OUTER_18, "49-46-54-64":    Segment.DBL_18,
    "54-46-49-64":    Segment.INNER_19, "54-46-48-64":    Segment.TRP_19, "54-46-51-64":    Segment.OUTER_19, "56-46-53-64":    Segment.DBL_19,
    "51-46-51-64":    Segment.INNER_20, "51-46-52-64":    Segment.TRP_20, "51-46-53-64":    Segment.OUTER_20, "51-46-54-64":    Segment.DBL_20,

}

export class Dartboard {
    private readonly bluetoothConnection : BluetoothRemoteGATTCharacteristic;

    public static async ConnectToBoard() : Promise<Dartboard> {
        const boardBluetooth = await navigator.bluetooth.requestDevice({filters:[{services: [GRANBOARD_UUID]}]});

        if (!boardBluetooth || !boardBluetooth.gatt) {
            throw new Error("Could not find matching service on bluetooth dartboard");
        }

        if (!boardBluetooth.gatt.connected) {
            await boardBluetooth.gatt.connect();
        }

        const service = await boardBluetooth.gatt.getPrimaryService(GRANBOARD_UUID);

        // Find the characteristic that supports the notify property. That is the one that executes when
        // a dartboard segment is hit
        let boardCharacteristic = (await service.getCharacteristics()).find(characteristic => characteristic.properties.notify);

        if (!boardCharacteristic) {
            throw new Error("Could not find matching bluetooth charactaristic on dartboard");
        }

        const board = new Dartboard(boardCharacteristic);

        await boardCharacteristic.startNotifications();

        return board;
    }

    private constructor(bluetoothConnection: BluetoothRemoteGATTCharacteristic)
    {
        this.bluetoothConnection = bluetoothConnection;

        this.bluetoothConnection.addEventListener("characteristicvaluechanged", this.onSegmentHit.bind(this));
    }
    
    private onSegmentHit() {
        if (!this.bluetoothConnection.value) {
            return; // There is no new value
        }

        const segmentID = new Uint8Array(this.bluetoothConnection.value.buffer).join("-");
        const segment = (SEGMENT_MAPPING as any)[segmentID]; // There is probably a type safe way without resulting to "any"

        if (segment !== undefined) {
            console.log(segment)
        } else {
            console.log(`Unknown segment: ${segmentID}`);
        }
    }
}