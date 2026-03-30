package com.shoppingreactnativeapp.room.repository

import com.shoppingreactnativeapp.room.dao.ProductDao
import com.shoppingreactnativeapp.room.entity.ProductEntity
import kotlinx.coroutines.flow.Flow

class ProductRepository(
    private val productDao: ProductDao
) {
    fun getProductList(): Flow<List<ProductEntity>> = productDao.getAll()

    suspend fun addToProductList(item: ProductEntity) {
        productDao.insert(item)
    }

    suspend fun removeFromProductList(productId: String) {
        productDao.deleteByProductId(productId)
    }

    suspend fun isInProductList(productId: String): Boolean {
        return productDao.exists(productId)
    }
}
