import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, NativeEventEmitter, NativeModules } from 'react-native';

import BleManager from 'react-native-ble-manager';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';

import NativeEventModule from './specs/NativeEventModule';

const eventEmitter = new NativeEventEmitter(NativeModules.NativeEventModule);

const App = () => {

  const _checkPermission = async () => {
    const typePermission = PERMISSIONS.IOS.BLUETOOTH;

    let permission = await check(typePermission);

    if ((permission === RESULTS.DENIED)) permission = await request(typePermission);

    if ((permission === RESULTS.GRANTED) || (permission === RESULTS.LIMITED)) return true;
  }

  const _onScan = async () => {
    const isPermissionGranted = await _checkPermission();

    if (!isPermissionGranted) return null;


    BleManager.isStarted().then((started) => {
      console.log(`Module is ${started ? '' : 'not '}started`);

      NativeEventModule.startBleScan();
      BleManager.scan({ allowDuplicates: false }).then(() => {
        // Success code
        console.log("Scan started");
      });
    });
  }

  useEffect(() => {
    NativeEventModule.startBleScan();
    BleManager.start({ showAlert: false });

    const _tep = BleManager.onDiscoverPeripheral(async (peripheral) => {
      console.log('Discovered peripheral:', peripheral);
      if (peripheral.name === 'UR-4B08') {
        console.log('Found target peripheral:', peripheral);
        await BleManager.stopScan();
        const mac = peripheral.id.toUpperCase();
        NativeEventModule.connectAddress(mac);

        setTimeout(() => {
          NativeEventModule.startInventory();
        }, 5000)
      }
    });

     const __tep = eventEmitter.addListener('BleManagerDiscoverEPC', epc => {
      console.log('BleManagerDiscoverEPC', epc);
    });

    return () => {
      console.log('🧹 Cleaning up listeners');
      _tep.remove();
      __tep.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <TouchableOpacity hitSlop={16} onPress={_onScan}>
        <Text>Scan</Text>
      </TouchableOpacity>
    </View>
  );
}

export default App;