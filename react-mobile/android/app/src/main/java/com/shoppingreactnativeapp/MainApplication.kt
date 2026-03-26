package com.shoppingreactnativeapp.app

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.shoppingreactnativeapp.feature.calculator.native.NativeCalculatorPackage
import com.shoppingreactnativeapp.feature.product.native.ProductCatalogPackage
import com.shoppingreactnativeapp.feature.product.native.ProductPackage

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          add(NativeCalculatorPackage())
          add(ProductPackage())
          add(ProductCatalogPackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
