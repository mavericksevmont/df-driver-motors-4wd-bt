function stopDrive () {
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, 0)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CW, 0)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CW, 0)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CW, 0)
}
function setRightSide (speed: number) {
    setOneMotor(motor.Motors.M3, speed)
setOneMotor(motor.Motors.M4, speed)
}
bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Happy)
})
bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.No)
    stopDrive()
})
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    msg = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    if (msg == "a") {
        stopDrive()
        music.play(music.builtinPlayableSoundEffect(soundExpression.giggle), music.PlaybackMode.InBackground)
        basic.showIcon(IconNames.Rabbit)
    }
    if (msg == "b") {
        stopDrive()
        music.play(music.builtinPlayableSoundEffect(soundExpression.happy), music.PlaybackMode.InBackground)
        basic.showIcon(IconNames.Rollerskate)
    }
    if (msg == "mode_dpad") {
        mode = 0
        stopDrive()
        basic.showString("D")
    } else if (msg == "mode_analog") {
        mode = 1
        stopDrive()
        basic.showString("A")
    } else if (msg == "mode_accelerometer") {
        mode = 2
        stopDrive()
        basic.showString("T")
    } else {
        if (mode == 0) {
            if (msg == "UP") {
                basic.showArrow(ArrowNames.North)
                setDrive(255, 255)
            } else if (msg == "DOWN") {
                basic.showArrow(ArrowNames.South)
                setDrive(-255, -255)
            } else if (msg == "LEFT") {
                basic.showArrow(ArrowNames.West)
                setDrive(-180, 180)
            } else if (msg == "RIGHT") {
                basic.showArrow(ArrowNames.East)
                setDrive(180, -180)
            } else if (msg == "left" || msg == "right" || msg == "up" || msg == "down") {
                stopDrive()
            }
        }
        if (mode == 1 || mode == 2) {
            parseAndDriveAxes(msg)
        }
        // suwaki (c000..180, x000..180)
        if (msg.substr(0, 1) == "x") {
            slider = parseFloat(msg.substr(1, 3))
            led.plotBarGraph(
            slider,
            180
            )
            pins.servoWritePin(AnalogPin.P2, slider)
        }
        if (msg.substr(0, 1) == "c") {
            slider = parseFloat(msg.substr(1, 3))
            led.plotBarGraph(
            slider,
            180
            )
        }
    }
})
function setDrive (leftSpeed: number, rightSpeed: number) {
    setLeftSide(leftSpeed)
    setRightSide(rightSpeed)
}
// format: X+05,Y-72
function parseAndDriveAxes (frame: string) {
    if (frame.length < 9) {
        return
    }
    if (frame.substr(0, 1) != "X") {
        return
    }
    if (frame.substr(4, 2) != ",Y") {
        return
    }
    x = parseFloat(frame.substr(1, 3))
    y = parseFloat(frame.substr(6, 3))
    driveFromAxes(x, y)
}
function setLeftSide (speed: number) {
    setOneMotor(motor.Motors.M1, speed)
setOneMotor(motor.Motors.M2, speed)
}
function driveFromAxes (ax: number, ay: number) {
    left = ay + ax
    right = ay - ax
    left = left * 2.55
    right = right * 2.55
    setDrive(left, right)
}
let right = 0
let left = 0
let y = 0
let x = 0
let slider = 0
let mode = 0
let msg = ""
function setOneMotor(which: motor.Motors, speed: number) {
    if (speed > 255) {
        speed = 255
    }
    if (speed < -255) {
        speed = -255
    }

    if (speed > 0) {
        motor.MotorRun(which, motor.Dir.CW, speed)
    } else if (speed < 0) {
        motor.MotorRun(which, motor.Dir.CCW, 0 - speed)
    } else {
        motor.MotorRun(which, motor.Dir.CW, 0)
    }
}
music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.InBackground)
basic.showString("PIZZA")
basic.showIcon(IconNames.Heart)
bluetooth.startUartService()
stopDrive()
