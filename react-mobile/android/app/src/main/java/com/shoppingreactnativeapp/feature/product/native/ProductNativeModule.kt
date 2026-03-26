package com.shoppingreactnativeapp.feature.product.`native`

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.shoppingreactnativeapp.core.database.AppDatabase
import com.shoppingreactnativeapp.feature.product.data.local.entity.ProductEntity
import com.shoppingreactnativeapp.feature.product.data.repository.ProductRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

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
        scope.launch {
            try {
                val item = ProductEntity(
                    productId = productId,
                    productName = productName,
                    price = price,
                    imageUrl = imageUrl
                )
                repository.addToProductList(item)
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("ADD_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun removeFromProductList(productId: String, promise: Promise) {
        scope.launch {
            try {
                repository.removeFromProductList(productId)
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("REMOVE_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun getProductList(promise: Promise) {
        scope.launch {
            try {
                val items = repository.getProductList().first()
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
                promise.resolve(result)
            } catch (e: Exception) {
                promise.reject("GET_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun isInProductList(productId: String, promise: Promise) {
        scope.launch {
            try {
                val exists = repository.isInProductList(productId)
                promise.resolve(exists)
            } catch (e: Exception) {
                promise.reject("CHECK_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun clearAll(promise: Promise) {
        scope.launch {
            try {
                repository.getProductList()
                AppDatabase.getInstance(reactApplicationContext).productDao().clearAll()
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("CLEAR_ERROR", e.message, e)
            }
        }
    }
}
