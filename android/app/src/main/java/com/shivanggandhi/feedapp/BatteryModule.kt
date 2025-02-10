package com.shivanggandhi.feedapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback // Import Callback
import com.facebook.react.modules.core.DeviceEventManagerModule

class BatteryModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var batteryReceiver: BroadcastReceiver? = null

    override fun getName(): String {
        return "BatteryModule"
    }

    @ReactMethod
    fun getBatteryLevel(callback: Callback) { // Use Callback instead of Function1
        val batteryStatus: Intent? = reactApplicationContext.registerReceiver(
            null, IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        )
        val level = batteryStatus?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
        val scale = batteryStatus?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
        val batteryPct = (level / scale.toFloat() * 100).toInt()
        callback.invoke(batteryPct) // Use invoke to call the callback
    }

    @ReactMethod
    fun startBatteryListener() {
        if (batteryReceiver == null) {
            batteryReceiver = object : BroadcastReceiver() {
                override fun onReceive(context: Context?, intent: Intent?) {
                    val level = intent?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
                    val scale = intent?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
                    val batteryPct = (level / scale.toFloat() * 100).toInt()
                    sendBatteryLevelToJS(batteryPct)
                }
            }
            val filter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
            reactApplicationContext.registerReceiver(batteryReceiver, filter)
        }
    }

    private fun sendBatteryLevelToJS(batteryLevel: Int) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("BatteryLevelChanged", batteryLevel)
    }

    @ReactMethod
    fun stopBatteryListener() {
        if (batteryReceiver != null) {
            reactApplicationContext.unregisterReceiver(batteryReceiver)
            batteryReceiver = null
        }
    }
}
