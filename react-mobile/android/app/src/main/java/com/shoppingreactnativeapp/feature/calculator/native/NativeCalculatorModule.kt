package com.shoppingreactnativeapp.feature.calculator.native

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class NativeCalculatorModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "NativeCalculator"

    @ReactMethod
    fun save(a: Double, b: Double, promise: Promise) {
        promise.resolve(a + b)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun multiply(a: Double, b: Double): Double {
        return a * b
    }
}
