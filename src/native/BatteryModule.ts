import { NativeModules, NativeEventEmitter } from 'react-native';

const { BatteryModule } = NativeModules;

if (!BatteryModule) {
    throw new Error("BatteryModule is not linked correctly. Make sure it's properly configured in your native code.");
}

export const getBatteryLevel = async (): Promise<number> => {
    try {
        return new Promise((resolve, reject) => {
            BatteryModule.getBatteryLevel((batteryLevel: number) => {
                resolve(batteryLevel);
            });
        });
    } catch (error) {
        console.error("Error getting battery level:", error);
        throw new Error('Failed to retrieve battery level');
    }
};

export const batteryEventEmitter = new NativeEventEmitter(BatteryModule);
export default BatteryModule; 
