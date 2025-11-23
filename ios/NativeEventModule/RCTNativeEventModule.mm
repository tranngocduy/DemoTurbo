//
//  RCTNativeEventModule.m
//  DemoTurbo
//
//  Created by Admin on 23/11/25.
//

#import "RCTNativeEventModule.h"

@implementation RCTNativeEventModule {
  bool hasListeners;
}

+ (NSString *)moduleName {
  return @"NativeEventModule";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeEventModuleSpecJSI>(params);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getConstants) {
  return @{@"supportedEvents": [self supportedEvents]};
}

- (instancetype)init {
  if (self = [super init]) {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleRFIDTagDiscovered:) name:@"RFIDTagDiscovered" object:nil];
  }
  return self;
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"BleManagerDiscoverEPC"];
}

- (void)handleRFIDTagDiscovered:(NSNotification *)note {
  NSString *epc = note.userInfo[@"epc"];
  if (epc) {
    [self sendEPC:epc];
  }
}

- (void)startObserving {
  hasListeners = YES;
  NSLog(@"startObserving – bắt đầu nhận EPC");
}

- (void)stopObserving {
  hasListeners = NO;
  NSLog(@"stopObserving – dừng nhận EPC");
}

- (void)sendEPC:(NSString *)epc {
  if (!hasListeners) return;
  [self sendEventWithName:@"BleManagerDiscoverEPC" body:@{@"rfid_tag": epc}];
}

- (void)connectAddress:(nonnull NSString *)uuidString {
  [[RFIDBlutoothManager shareManager] connectToPeripheralWithUUID:uuidString];
}

- (void)startBleScan { 
  [[RFIDBlutoothManager shareManager] startBleScan];
}

- (void)startInventory { 
  [[RFIDBlutoothManager shareManager] startInventory];
}

- (void)stopInventory { 
  [[RFIDBlutoothManager shareManager] stopInventory];
}

@end
