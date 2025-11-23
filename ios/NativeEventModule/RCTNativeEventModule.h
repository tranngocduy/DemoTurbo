//
//  RCTNativeEventModule.h
//  DemoTurbo
//
//  Created by Admin on 23/11/25.
//

#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>
#import <NativeEventModuleSpec/NativeEventModuleSpec.h>

#import "RFIDBlutoothManager.h"

NS_ASSUME_NONNULL_BEGIN

@interface RCTNativeEventModule : RCTEventEmitter <NativeEventModuleSpec>

- (void)sendEPC:(NSString *)epc;

@end

NS_ASSUME_NONNULL_END
