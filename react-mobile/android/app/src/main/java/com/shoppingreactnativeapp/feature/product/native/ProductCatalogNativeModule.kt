package com.shoppingreactnativeapp.feature.product.`native`

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.shoppingreactnativeapp.room.database.AppDatabase
import com.shoppingreactnativeapp.room.entity.CatalogEntity
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch

private const val TAG = "CatalogNativeModule"

class ProductCatalogNativeModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    private val catalogDao by lazy {
        AppDatabase.getInstance(reactContext).catalogDao()
    }

    override fun getName(): String = "ProductCatalogModule"

    override fun invalidate() {
        scope.cancel()
        super.invalidate()
    }

    @ReactMethod
    fun getProductCatalog(promise: Promise) {
        Log.d(TAG, "[JS→Native] getProductCatalog called")
        scope.launch {
            try {
                val items = catalogDao.getAll()
                Log.d(TAG, "[Native→Room] getProductCatalog returned ${items.size} items")
                val result = Arguments.createArray()
                items.forEach { item ->
                    val map = Arguments.createMap()
                    map.putString("id", item.id)
                    map.putString("name", item.name)
                    map.putString("category", item.category)
                    map.putDouble("price", item.price)
                    map.putDouble("salePrice", item.salePrice)
                    map.putBoolean("sale", item.sale)
                    map.putString("bg", item.bg)
                    map.putString("image", item.image)
                    result.pushMap(map)
                }
                Log.d(TAG, "[Native→JS] resolving ${items.size} catalog items")
                promise.resolve(result)
            } catch (e: Exception) {
                Log.e(TAG, "[Native→Room] getProductCatalog FAILED — ${e.message}", e)
                promise.reject("CATALOG_ERROR", e.message, e)
            }
        }
    }
}
