import Foundation
import UIKit

@objc(BatteryModule)
class BatteryModule: RCTEventEmitter {

  override init() {
    super.init()
    UIDevice.current.isBatteryMonitoringEnabled = true
  }

  private var batteryLevel: Float {
    return UIDevice.current.batteryLevel * 100
  }

  @objc
  func getBatteryLevel(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      print("BatteryModule: getBatteryLevel called")
      
      UIDevice.current.isBatteryMonitoringEnabled = true
      let level = UIDevice.current.batteryLevel
      
      print("BatteryModule: Battery level fetched =", level)
      
      if level < 0 {
          print("BatteryModule: Battery level is unavailable")
          reject("BATTERY_ERROR", "Battery level is unavailable", nil)
      } else {
          resolve(Int(level * 100))
      }
  }


  @objc
  func startBatteryListener() {
    print("BatteryModule: startBatteryListener called") // Debug log
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(batteryLevelDidChange),
      name: UIDevice.batteryLevelDidChangeNotification,
      object: nil
    )
  }

  @objc
  func stopBatteryListener() {
    print("BatteryModule: stopBatteryListener called") // Debug log
    NotificationCenter.default.removeObserver(self, name: UIDevice.batteryLevelDidChangeNotification, object: nil)
  }

  @objc private func batteryLevelDidChange() {
    print("BatteryModule: batteryLevelDidChange called") // Debug log
    if UIDevice.current.batteryLevel >= 0 {
      sendEvent(withName: "BatteryLevelChanged", body: ["level": Int(batteryLevel)])
    }
  }

  override func supportedEvents() -> [String] {
    return ["BatteryLevelChanged"]
  }
}
