package com.shoppingreactnativeapp.feature.product.`native`

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.shoppingreactnativeapp.room.database.AppDatabase
import com.shoppingreactnativeapp.room.entity.ProductEntity
import com.shoppingreactnativeapp.room.repository.ProductRepository
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

private const val TAG = "ProductNativeModule"

class ProductNativeModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    private val repository: ProductRepository by lazy {
        val db = AppDatabase.getInstance(reactContext)
        ProductRepository(db.productDao())
    }

    override fun getName(): String = "ProductListModule"

    override fun invalidate() {
        scope.cancel()
        super.invalidate()
    }

    @ReactMethod
    fun addToProductList(
        productId: String,
        productName: String,
        price: Double,
        imageUrl: String?,
        promise: Promise
    ) {
        Log.d(TAG, "[JS→Native] addToProductList called — id=$productId, name=$productName, price=$price")
        scope.launch {
            try {
                val item = ProductEntity(
                    productId = productId,
                    productName = productName,
                    price = price,
                    imageUrl = imageUrl
                )
                repository.addToProductList(item)
                Log.d(TAG, "[Native→Room] insert OK — id=$productId")
                promise.resolve(true)
            } catch (e: Exception) {
                Log.e(TAG, "[Native→Room] insert FAILED — ${e.message}", e)
                promise.reject("ADD_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun removeFromProductList(productId: String, promise: Promise) {
        Log.d(TAG, "[JS→Native] removeFromProductList called — id=$productId")
        scope.launch {
            try {
                repository.removeFromProductList(productId)
                Log.d(TAG, "[Native→Room] delete OK — id=$productId")
                promise.resolve(true)
            } catch (e: Exception) {
                Log.e(TAG, "[Native→Room] delete FAILED — ${e.message}", e)
                promise.reject("REMOVE_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun getProductList(promise: Promise) {
        Log.d(TAG, "[JS→Native] getProductList called")
        scope.launch {
            try {
                val items = repository.getProductList().first()
                Log.d(TAG, "[Native→Room] getProductList returned ${items.size} items")
                val result = Arguments.createArray()
                items.forEach { item ->
                    val map = Arguments.createMap()
                    map.putDouble("id", item.id.toDouble())
                    map.putString("productId", item.productId)
                    map.putString("productName", item.productName)
                    map.putDouble("price", item.price)
                    map.putString("imageUrl", item.imageUrl ?: "")
                    map.putDouble("createdAt", item.createdAt.toDouble())
                    result.pushMap(map)
                }
                Log.d(TAG, "[Native→JS] resolving ${items.size} items")
                promise.resolve(result)
            } catch (e: Exception) {
                Log.e(TAG, "[Native→Room] getProductList FAILED — ${e.message}", e)
                promise.reject("GET_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun isInProductList(productId: String, promise: Promise) {
        Log.d(TAG, "[JS→Native] isInProductList called — id=$productId")
        scope.launch {
            try {
                val exists = repository.isInProductList(productId)
                Log.d(TAG, "[Native→Room] isInProductList=$exists — id=$productId")
                promise.resolve(exists)
            } catch (e: Exception) {
                Log.e(TAG, "[Native→Room] isInProductList FAILED — ${e.message}", e)
                promise.reject("CHECK_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun clearAll(promise: Promise) {
        Log.d(TAG, "[JS→Native] clearAll called")
        scope.launch {
            try {
                AppDatabase.getInstance(reactApplicationContext).productDao().clearAll()
                Log.d(TAG, "[Native→Room] clearAll OK")
                promise.resolve(true)
            } catch (e: Exception) {
                Log.e(TAG, "[Native→Room] clearAll FAILED — ${e.message}", e)
                promise.reject("CLEAR_ERROR", e.message, e)
            }
        }
    }
}
