package com.shoppingreactnativeapp.room.repository

import android.util.Log
import com.shoppingreactnativeapp.room.dao.ProductDao
import com.shoppingreactnativeapp.room.entity.ProductEntity
import kotlinx.coroutines.flow.Flow

private const val TAG = "ProductRepository"

class ProductRepository(
    private val productDao: ProductDao
) {
    fun getProductList(): Flow<List<ProductEntity>> {
        Log.d(TAG, "[Repository] getProductList() — returning Flow")
        return productDao.getAll()
    }

    suspend fun addToProductList(item: ProductEntity) {
        Log.d(TAG, "[Repository] addToProductList — id=${item.productId}, name=${item.productName}")
        productDao.insert(item)
        Log.d(TAG, "[Repository] insert done — id=${item.productId}")
    }

    suspend fun removeFromProductList(productId: String) {
        Log.d(TAG, "[Repository] removeFromProductList — id=$productId")
        productDao.deleteByProductId(productId)
        Log.d(TAG, "[Repository] delete done — id=$productId")
    }

    suspend fun isInProductList(productId: String): Boolean {
        val exists = productDao.exists(productId)
        Log.d(TAG, "[Repository] isInProductList=$exists — id=$productId")
        return exists
    }
}
