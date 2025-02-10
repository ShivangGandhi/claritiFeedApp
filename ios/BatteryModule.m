#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(BatteryModule, RCTEventEmitter)

RCT_EXTERN_METHOD(getBatteryLevel: (RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(startBatteryListener)
RCT_EXTERN_METHOD(stopBatteryListener)

@end
