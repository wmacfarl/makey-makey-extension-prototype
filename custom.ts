enum Key {
    W = 13,
    A = 12,
    S = 11,
    D = 10,
    F = 9,
    G = 8
}

enum MouseDirections {
    UP = 0,
    DOWN = 1,
    LEFT = 2,
    RIGHT = 3
}

enum MouseButtons {
    LEFT = 4,
    RIGHT = 5
}

//% weight=100 color=#0fbc11 icon=""
namespace MakeyMakey{
    let dir_a = 0
    let SX1509_ADDRESS = 0
    let REG_RESET = 0
    let currentValue = 0
    SX1509_ADDRESS = 62
    let REG_DIR_A = 15
    let REG_DIR_B = 14
    let REG_DATA_A = 17
    let REG_DATA_B = 16
    let SX1509_LED_PIN = 6
// Configure pins 0-13 as inputs, 14-15 as outputs


    //% block="Initialize MakeyMakey"
    export function sx1509_init() {
        sx1509_reset()
        basic.pause(500)
        pins.i2cWriteNumber(
            SX1509_ADDRESS,
            (REG_DIR_A << 8) | 0x00,
            NumberFormat.UInt16BE,
            false
        )
        pins.i2cWriteNumber(
            SX1509_ADDRESS,
            (REG_DIR_B << 8) | 0x00,
            NumberFormat.UInt16BE,
            false
        )
        pins.i2cWriteNumber(
            SX1509_ADDRESS,
            (REG_DATA_A << 8) | 0xFF,
            NumberFormat.UInt16BE,
            false
        )
        pins.i2cWriteNumber(
            SX1509_ADDRESS,
            (REG_DATA_B << 8) | 0xFF,
            NumberFormat.UInt16BE,
            false
        )
    }

function sx1509_reset() {
    REG_RESET = 125
    pins.i2cWriteNumber(
        SX1509_ADDRESS,
        (REG_RESET << 8) | 0x12,
        NumberFormat.UInt16BE,
        false
    )
    pins.i2cWriteNumber(
        SX1509_ADDRESS,
        (REG_RESET << 8) | 0x34,
        NumberFormat.UInt16BE,
        false
    )
}
function sx1509_digitalWrite(pin: number, state: boolean) {
    let register = pin < 8 ? REG_DATA_A : REG_DATA_B;
    pins.i2cWriteNumber(
        SX1509_ADDRESS,
        register,
        NumberFormat.UInt8LE,
        true
    )
    currentValue = pins.i2cReadNumber(SX1509_ADDRESS, NumberFormat.UInt8LE, false)
    let data = (1 << (pin % 8));
    if (state) {
        currentValue |= data;
    } else {
        currentValue &= ~data;
    }
    pins.i2cWriteNumber(
        SX1509_ADDRESS,
        (register << 8) | currentValue,
        NumberFormat.UInt16BE,
        false
    )
}
    //% block="type key %key"
    export function typeKey(key: Key): void {
        pressKey(key);
        basic.pause(25);
        release(key);
    }

    //% block="press key %key"
    export function pressKey(key: Key): void {
        sx1509_digitalWrite(key, false);
    }

    //% block="release key %key"
    export function release(key: Key): void {
        sx1509_digitalWrite(key, true);
    }

    //% block="move mouse %direction"
    export function moveMouse(direction: MouseDirections): void {
        sx1509_digitalWrite(direction, false);
    }

    //% block="stop mouse %direction"
    export function stopMouse(direction: MouseDirections): void {
        sx1509_digitalWrite(direction, true);
    }

    //% block="press mouse button %button"
    export function pressMouseButton(button: MouseButtons): void {
        sx1509_digitalWrite(button, false);
    }

    //% block="release mouse button %button"
    export function releaseMouseButton(button: MouseButtons): void {
        sx1509_digitalWrite(button, true);
    }

    //% block="click mouse button %button"
    export function clickMouse(button: MouseButtons): void {
        pressMouseButton(button);
        basic.pause(25);
        releaseMouseButton(button);
    }
    //% block="move mouse %direction|for %seconds|seconds"
    //% seconds.shadow=timePicker
    export function moveMouseForSeconds(direction: MouseDirections, seconds: number): void {
        moveMouse(direction);
        basic.pause(seconds);
        stopMouse(direction);
    }

}